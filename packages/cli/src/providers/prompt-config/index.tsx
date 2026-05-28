import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  type SupportedChatModelId,
  Mode,
  type ModeType,
} from '@ghostcode/shared';
import { getDefaultModel, getRuntimeSettings } from '../../lib/config-loader';

type PromptConfigContextValue = {
  mode: ModeType;
  toggleMode: () => void;
  setMode: (mode: ModeType) => void;
  model: SupportedChatModelId;
  setModel: (model: SupportedChatModelId) => void;
};

const PromptConfigContext = createContext<PromptConfigContextValue | null>(
  null,
);

export function usePromptConfig(): PromptConfigContextValue {
  const value = useContext(PromptConfigContext);
  if (!value) {
    throw new Error(
      'usePromptConfig must be used within a PromptConfigProvider',
    );
  }
  return value;
}

type PromptConfigProviderProps = {
  children: ReactNode;
};

export function PromptConfigProvider({ children }: PromptConfigProviderProps) {
  const [mode, setMode] = useState<ModeType>(Mode.BUILD);
  const [model, setModel] = useState<SupportedChatModelId>(() =>
    getDefaultModel(getRuntimeSettings()),
  );

  const toggleMode = useCallback(() => {
    setMode((m) => (m === Mode.BUILD ? Mode.PLAN : Mode.BUILD));
  }, []);

  return (
    <PromptConfigContext.Provider
      value={{
        mode,
        toggleMode,
        setMode,
        model,
        setModel,
      }}
    >
      {children}
    </PromptConfigContext.Provider>
  );
}
