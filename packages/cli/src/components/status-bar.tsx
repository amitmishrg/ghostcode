import { TextAttributes } from '@opentui/core';
import { useTheme } from '../providers/theme';
import { usePromptConfig } from '../providers/prompt-config';
import { Mode } from '@ghostcode/shared';
import { PulseText } from './animations/pulse-text';

export function StatusBar() {
  const { mode, model } = usePromptConfig();
  const { colors } = useTheme();
  const modeLabel = mode === Mode.PLAN ? 'PLAN' : 'BUILD';
  const modeColor = mode === Mode.PLAN ? colors.planMode : colors.primary;

  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        SYS
      </text>
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        ›
      </text>
      <text fg={modeColor} attributes={TextAttributes.BOLD}>
        [{modeLabel}]
      </text>
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        ›
      </text>
      <text fg={colors.info}>{model}</text>
      <box flexGrow={1} />
      <PulseText
        activeColor={colors.success}
        dimColor={colors.dimSeparator}
        intervalMs={550}
        bold
      >
        ◆ ONLINE
      </PulseText>
    </box>
  );
}
