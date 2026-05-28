import type { ReactNode } from 'react';
import { TextAttributes } from '@opentui/core';
import { GridBorder, HudLeftBorder } from './border';
import { PulseText } from './animations/pulse-text';
import { useTheme } from '../providers/theme';

type HudFrameProps = {
  children: ReactNode;
  label?: string;
  accent?: 'primary' | 'planMode' | 'error';
  variant?: 'left' | 'panel';
  width?: string | number;
};

export function HudFrame({
  children,
  label,
  accent = 'primary',
  variant = 'left',
  width = '100%',
}: HudFrameProps) {
  const { colors } = useTheme();
  const accentColor =
    accent === 'planMode'
      ? colors.planMode
      : accent === 'error'
        ? colors.error
        : colors.primary;

  if (variant === 'panel') {
    return (
      <box width={width} flexDirection="column" gap={0}>
        {label ? (
          <box flexDirection="row" gap={1} paddingBottom={0}>
            <text fg={accentColor} attributes={TextAttributes.BOLD}>
              [{label}]
            </text>
          </box>
        ) : null}
        <box
          border
          borderColor={accentColor}
          customBorderChars={GridBorder}
          width="100%"
          backgroundColor={colors.surface}
        >
          {children}
        </box>
      </box>
    );
  }

  return (
    <box width={width} flexDirection="column">
      {label ? (
        <box flexDirection="row" gap={1} paddingBottom={0}>
          <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
            ─
          </text>
          <text fg={accentColor} attributes={TextAttributes.BOLD}>
            {label}
          </text>
          <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
            ─
          </text>
        </box>
      ) : null}
      <box
        border={['left']}
        borderColor={accentColor}
        customBorderChars={HudLeftBorder}
        width="100%"
      >
        {children}
      </box>
    </box>
  );
}

type SystemLineProps = {
  status: 'ok' | 'wait' | 'active';
  label: string;
};

export function SystemLine({ status, label }: SystemLineProps) {
  const { colors } = useTheme();
  const prefix =
    status === 'ok'
      ? { text: 'OK', color: colors.success }
      : status === 'active'
        ? { text: 'ACTIVE', color: colors.primary }
        : { text: '--', color: colors.dimSeparator };

  return (
    <box flexDirection="row" gap={1}>
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        [
      </text>
      {status === 'active' ? (
        <PulseText
          activeColor={prefix.color}
          dimColor={colors.dimSeparator}
          bold
          intervalMs={600}
        >
          {prefix.text}
        </PulseText>
      ) : (
        <text fg={prefix.color} attributes={TextAttributes.BOLD}>
          {prefix.text}
        </text>
      )}
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        ]
      </text>
      <text attributes={TextAttributes.DIM}>{label}</text>
    </box>
  );
}
