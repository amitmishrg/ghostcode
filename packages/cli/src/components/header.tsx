import { useMemo } from 'react';
import { basename, resolve } from 'node:path';
import { TextAttributes } from '@opentui/core';
import { ScanLine } from './animations/scan-line';
import { PulseText } from './animations/pulse-text';
import { useTheme } from '../providers/theme';
import { getRuntimeCwd } from '../lib/config-loader';

export function Header() {
  const { colors, currentTheme } = useTheme();
  const projectName = useMemo(
    () => basename(resolve(getRuntimeCwd())),
    [],
  );

  return (
    <box
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
      width="100%"
    >
      <box
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        gap={0.5}
      >
        <ascii-font font="tiny" text="Ghost" color={colors.dimSeparator} />
        <ascii-font font="tiny" text="Code" color={colors.primary} />
      </box>

      <ScanLine width={52} />

      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        terminal coding harness
      </text>

      <box flexDirection="row" gap={1} alignItems="center">
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
          {projectName}
        </text>
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
          //
        </text>
        <PulseText
          activeColor={colors.primary}
          dimColor={colors.dimSeparator}
          intervalMs={900}
        >
          {currentTheme.name}
        </PulseText>
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
          //
        </text>
        <text fg={colors.planMode}>{currentTheme.codename}</text>
      </box>
    </box>
  );
}
