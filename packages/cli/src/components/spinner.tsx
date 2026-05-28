import { useMemo } from 'react';
import 'opentui-spinner/react';
import { createWave } from 'opentui-spinner';
import { Mode, type ModeType } from '@ghostcode/shared';
import { useTheme } from '../providers/theme';

type Props = {
  mode?: ModeType;
};

export function Spinner({ mode = Mode.BUILD }: Props) {
  const { colors } = useTheme();
  const activeColor = mode === Mode.PLAN ? colors.planMode : colors.primary;
  const waveColor = useMemo(
    () => createWave([activeColor, colors.info, colors.planMode, activeColor]),
    [activeColor, colors.info, colors.planMode],
  );

  return <spinner name="line" color={waveColor} />;
}
