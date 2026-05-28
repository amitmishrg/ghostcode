import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { TextAttributes } from '@opentui/core';
import { Mode } from '@ghostcode/shared';
import { Header } from '../components/header';
import { InputBar } from '../components/input-bar';
import { GridBackdrop } from '../components/animations/grid-backdrop';
import { PulseText } from '../components/animations/pulse-text';
import { usePromptConfig } from '../providers/prompt-config';
import { useTheme } from '../providers/theme';

export function Home() {
  const navigate = useNavigate();
  const { mode, model } = usePromptConfig();
  const { colors } = useTheme();

  const handleSubmit = useCallback(
    (text: string) => {
      navigate('/sessions/new', { state: { message: text, mode, model } });
    },
    [navigate, mode, model],
  );

  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={2}
      position="relative"
      width="100%"
      height="100%"
    >
      <box
        flexDirection="column"
        alignItems="center"
        gap={2}
        zIndex={1}
        width="100%"
        maxWidth={78}
        paddingX={2}
      >
        <Header />

        <box width="100%" flexDirection="column" gap={1} alignItems="center">
          <InputBar onSubmit={handleSubmit} />

          <box
            flexDirection="row"
            gap={1}
            flexShrink={0}
            marginLeft="auto"
            alignItems="center"
          >
            <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
              tab
            </text>
            <text fg={colors.primary} attributes={TextAttributes.DIM}>
              ›
            </text>
            <text attributes={TextAttributes.DIM}>command matrix</text>
          </box>
        </box>
      </box>
    </box>
  );
}
