import { useMemo } from 'react';
import { useChat as useAiChat } from '@ai-sdk/react';
import {
  lastAssistantMessageIsCompleteWithToolCalls,
  type InferUITools,
  type UIMessage,
} from 'ai';
import {
  type ModeType,
  type SupportedChatModelId,
  type ToolContracts,
} from '@ghostcode/shared';
import { executeLocalTool } from '../lib/local-tools';
import { getRuntimeCwd } from '../lib/config-loader';
import {
  LocalChatTransport,
  type ChatMessageMetadata,
  type GhostcodeUIMessage,
} from '../lib/local-chat-transport';

export type { ChatMessageMetadata };

type ChatTools = {
  [Name in keyof InferUITools<ToolContracts>]: {
    input: InferUITools<ToolContracts>[Name]['input'];
    output: unknown;
  };
};

export type Message = UIMessage<ChatMessageMetadata, never, ChatTools>;

export function useChat(sessionId: string, initialMessages: Message[]) {
  const transport = useMemo(() => {
    return new LocalChatTransport({
      cwd: getRuntimeCwd(),
      sessionId,
    });
  }, [sessionId]);

  const chat = useAiChat<Message>({
    id: sessionId,
    messages: initialMessages,
    transport,
    onToolCall({ toolCall }) {
      const mode = chat.messages.at(-1)?.metadata?.mode ?? 'BUILD';

      void executeLocalTool(toolCall.toolName, toolCall.input, mode)
        .then((output) =>
          chat.addToolOutput({
            tool: toolCall.toolName as keyof ChatTools,
            toolCallId: toolCall.toolCallId,
            output,
          }),
        )
        .catch((error) =>
          chat.addToolOutput({
            tool: toolCall.toolName as keyof ChatTools,
            toolCallId: toolCall.toolCallId,
            state: 'output-error',
            errorText: error instanceof Error ? error.message : String(error),
          }),
        );
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return {
    messages: chat.messages,
    status: chat.status,
    error: chat.error,
    submit: (params: {
      userText: string;
      mode: ModeType;
      model: SupportedChatModelId;
    }) => {
      return chat.sendMessage({
        text: params.userText,
        metadata: {
          mode: params.mode,
          model: params.model,
        },
      });
    },
    abort: chat.stop,
    interrupt: chat.stop,
  };
}
