import { TextAttributes } from '@opentui/core';
import type { ReactNode } from 'react';
import { InputBar } from './input-bar';
import { Spinner } from './spinner';
import { ScanLine } from './animations/scan-line';
import { PulseText } from './animations/pulse-text';
import { usePromptConfig } from '../providers/prompt-config';
import { useTheme } from '../providers/theme';

type Props = {
  children?: ReactNode;
  onSubmit: (text: string) => void;
  inputDisabled?: boolean;
  loading?: boolean;
  interruptible?: boolean;
};

export function SessionShell({
  children,
  onSubmit,
  inputDisabled = false,
  loading = false,
  interruptible = false,
}: Props) {
  const { mode } = usePromptConfig();
  const { colors, currentTheme } = useTheme();

  return (
    <box
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height="100%"
      paddingY={1}
      paddingX={2}
      gap={1}
    >
      <box flexDirection="column" gap={0} flexShrink={0}>
        <box
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <PulseText
            activeColor={colors.primary}
            dimColor={colors.dimSeparator}
            bold
            intervalMs={700}
          >
            [ SESSION ACTIVE ]
          </PulseText>
          <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>
            {currentTheme.codename} // {currentTheme.name}
          </text>
        </box>
        <ScanLine width={52} />
      </box>

      <scrollbox flexGrow={1} width="100%" stickyScroll stickyStart="bottom">
        <box>{children}</box>
      </scrollbox>

      <box flexShrink={0}>
        <InputBar onSubmit={onSubmit} disabled={inputDisabled} />
      </box>

      <box
        flexShrink={0}
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
        height={1}
        gap={2}
        paddingLeft={1}
      >
        <box flexDirection="row" alignItems="center" gap={2}>
          {loading ? (
            <>
              <Spinner mode={mode} />
              {interruptible ? (
                <PulseText
                  activeColor={colors.error}
                  dimColor={colors.dimSeparator}
                  intervalMs={500}
                >
                  esc › interrupt signal
                </PulseText>
              ) : null}
            </>
          ) : (
            <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>
              stream idle
            </text>
          )}
        </box>

        <box flexDirection="row" gap={1} flexShrink={0} marginLeft="auto">
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
  );
}
