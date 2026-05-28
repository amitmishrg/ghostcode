import { Mode, type ModeType } from '@ghostcode/shared';
import { TextAttributes } from '@opentui/core';
import { HudLeftBorder } from '../border';
import { useTheme } from '../../providers/theme';

type Props = {
  message: string;
  mode: ModeType;
};

export function UserMessage({ message, mode }: Props) {
  const { colors } = useTheme();
  const accent = mode === Mode.PLAN ? colors.planMode : colors.primary;

  return (
    <box width="100%" alignItems="center" paddingY={0}>
      <box
        border={['left']}
        borderColor={accent}
        width="100%"
        customBorderChars={HudLeftBorder}
      >
        <box
          flexDirection="row"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width="100%"
          gap={1}
        >
          <text fg={accent} attributes={TextAttributes.BOLD}>
            ›
          </text>
          <text>{message}</text>
        </box>
      </box>
    </box>
  );
}
