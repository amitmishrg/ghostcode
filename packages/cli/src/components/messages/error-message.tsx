import { TextAttributes } from '@opentui/core';
import { HudLeftBorder } from '../border';
import { useTheme } from '../../providers/theme';

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  const { colors } = useTheme();

  return (
    <box width="100%" alignItems="center">
      <box
        border={['left']}
        borderColor={colors.error}
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
          <text fg={colors.error} attributes={TextAttributes.BOLD}>
            [ ERR ]
          </text>
          <text attributes={TextAttributes.DIM}>{message}</text>
        </box>
      </box>
    </box>
  );
}
