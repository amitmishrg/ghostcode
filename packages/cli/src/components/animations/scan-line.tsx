import { TextAttributes } from '@opentui/core';
import { useTick } from '../../hooks/use-tick';
import { useTheme } from '../../providers/theme';

type ScanLineProps = {
  width?: number;
};

export function ScanLine({ width = 42 }: ScanLineProps) {
  const tick = useTick(70);
  const { colors } = useTheme();
  const head = tick % width;

  const line = Array.from({ length: width }, (_, index) => {
    if (index === head) return '◆';
    if (index === head - 1 || index === head + 1) return '◇';
    return '─';
  }).join('');

  return (
    <text fg={colors.primary} attributes={TextAttributes.DIM}>
      {line}
    </text>
  );
}
