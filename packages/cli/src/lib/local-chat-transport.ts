import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
  type ChatTransport,
  type InferUITools,
  type LanguageModelUsage,
  type UIMessage,
  type UIMessageChunk,
} from 'ai';
import {
  buildSystemPrompt,
  getToolContracts,
  modeSchema,
  type ModeType,
  type ToolContracts,
} from '@ghostcode/shared';
import { loadProjectMemory, validateApiKeyForModel } from './config-loader';
import { resolveChatModel } from './models';
import { saveSessionMessages } from './session-store';

export type ChatMessageMetadata = {
  mode?: ModeType;
  model?: string;
  durationMs?: number;
  usage?: LanguageModelUsage;
};

export type GhostcodeUIMessage = UIMessage<
  ChatMessageMetadata,
  never,
  InferUITools<ToolContracts>
>;

type LocalChatTransportOptions = {
  cwd: string;
  sessionId: string;
};

function hasPendingToolCalls(message: GhostcodeUIMessage) {
  return message.parts.some((part) => {
    if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
      const state = (part as { state?: string }).state;
      return state !== 'output-available' && state !== 'output-error';
    }

    return false;
  });
}

function getModeAndModel(messages: GhostcodeUIMessage[]) {
  const metadata =
    messages.findLast(
      (message) => message.metadata?.mode && message.metadata?.model,
    )?.metadata ?? messages.at(-1)?.metadata;

  const modeResult = modeSchema.safeParse(metadata?.mode);
  const mode = modeResult.success ? modeResult.data : 'BUILD';
  const model = metadata?.model ?? 'claude-opus-4-6';

  return { mode, model };
}

export class LocalChatTransport implements ChatTransport<GhostcodeUIMessage> {
  private readonly cwd: string;
  private readonly sessionId: string;

  constructor({ cwd, sessionId }: LocalChatTransportOptions) {
    this.cwd = cwd;
    this.sessionId = sessionId;
  }

  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<GhostcodeUIMessage>['sendMessages']>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    const { mode, model } = getModeAndModel(messages);
    validateApiKeyForModel(model);

    const tools = getToolContracts(mode);
    const resolvedModel = resolveChatModel(model);
    const projectMemory = loadProjectMemory(this.cwd);
    const startTime = Date.now();

    const nextMessages = await validateUIMessages<GhostcodeUIMessage>({
      messages,
      tools,
    });
    const modelMessages = await convertToModelMessages(nextMessages, { tools });
    let completedUsage: LanguageModelUsage | null = null;

    const result = streamText({
      model: resolvedModel.model,
      system: buildSystemPrompt({ mode, projectMemory }),
      messages: modelMessages,
      tools,
      providerOptions: resolvedModel.providerOptions,
      abortSignal,
      onFinish(event) {
        completedUsage = event.totalUsage;
      },
    });

    const cwd = this.cwd;
    const sessionId = this.sessionId;

    return result.toUIMessageStream<GhostcodeUIMessage>({
      originalMessages: nextMessages,
      messageMetadata({ part }) {
        if (part.type === 'start') {
          return { mode, model };
        }

        if (part.type !== 'finish') return undefined;

        return {
          mode,
          model,
          durationMs: Date.now() - startTime,
          ...(completedUsage ? { usage: completedUsage } : {}),
        };
      },
      async onFinish(event) {
        if (event.isAborted) return;
        if (hasPendingToolCalls(event.responseMessage)) return;

        saveSessionMessages(cwd, sessionId, event.messages);
      },
      onError(error) {
        return error instanceof Error ? error.message : String(error);
      },
    });
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null;
  }
}
