import type { ReactNode } from 'react';
import { TextAttributes } from '@opentui/core';
import { usePulse } from '../../hooks/use-tick';

type PulseTextProps = {
  activeColor: string;
  dimColor: string;
  children: ReactNode;
  enabled?: boolean;
  intervalMs?: number;
  bold?: boolean;
};

export function PulseText({
  activeColor,
  dimColor,
  children,
  enabled = true,
  intervalMs = 650,
  bold = false,
}: PulseTextProps) {
  const lit = usePulse(enabled, intervalMs);
  const attributes = bold ? TextAttributes.BOLD : undefined;

  return (
    <text fg={lit ? activeColor : dimColor} attributes={attributes}>
      {children}
    </text>
  );
}
