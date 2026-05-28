import { useEffect, useMemo, useState } from 'react';
import { TextAttributes } from '@opentui/core';
import { Mode, type SupportedChatModelId } from '@ghostcode/shared';
import { PulseText } from './animations/pulse-text';
import { GridBorder } from './border';
import { useTheme } from '../providers/theme';
import { usePromptConfig } from '../providers/prompt-config';
import {
  getLaunchBriefing,
  type BriefingRow,
  type BriefingRowStatus,
} from '../lib/launch-briefing';

const LABEL_WIDTH = 10;
const REVEAL_INTERVAL_MS = 70;

function statusPrefix(status: BriefingRowStatus) {
  switch (status) {
    case 'ok':
      return 'OK';
    case 'warn':
      return 'WARN';
    case 'active':
      return 'LIVE';
    default:
      return '--';
  }
}

function statusColor(
  status: BriefingRowStatus,
  colors: ReturnType<typeof useTheme>['colors'],
) {
  switch (status) {
    case 'ok':
      return colors.success;
    case 'warn':
      return colors.error;
    case 'active':
      return colors.primary;
    default:
      return colors.dimSeparator;
  }
}

function BriefingLine({
  row,
  visible,
}: {
  row: BriefingRow;
  visible: boolean;
}) {
  const { colors } = useTheme();
  if (!visible) return null;

  const prefix = statusPrefix(row.status);
  const prefixColor = statusColor(row.status, colors);
  const label = row.label.padEnd(LABEL_WIDTH, ' ');

  return (
    <box flexDirection="row" gap={1} width="100%">
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        [
      </text>
      {row.status === 'active' ? (
        <PulseText
          activeColor={prefixColor}
          dimColor={colors.dimSeparator}
          bold
          intervalMs={700}
        >
          {prefix}
        </PulseText>
      ) : (
        <text fg={prefixColor} attributes={TextAttributes.BOLD}>
          {prefix}
        </text>
      )}
      <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
        ]
      </text>
      <text fg={colors.primary} attributes={TextAttributes.BOLD}>
        {label}
      </text>
      <text attributes={TextAttributes.DIM}>{row.value}</text>
    </box>
  );
}

export function LaunchBriefingPanel() {
  const { colors } = useTheme();
  const { mode, model } = usePromptConfig();
  const briefing = useMemo(
    () => getLaunchBriefing(undefined, mode, model as SupportedChatModelId),
    [mode, model],
  );
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    let count = 0;
    const id = setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= briefing.rows.length) {
        clearInterval(id);
      }
    }, REVEAL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [briefing.rows.length, mode, model]);

  const ready = visibleCount >= briefing.rows.length;

  return (
    <box flexDirection="column" gap={1} width="100%" paddingBottom={1}>
      <box flexDirection="row" gap={1} alignItems="center">
        <text fg={colors.primary} attributes={TextAttributes.BOLD}>
          [ CAPABILITIES ]
        </text>
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
          {briefing.projectName}
        </text>
      </box>

      <box
        border
        borderColor={colors.primary}
        customBorderChars={GridBorder}
        backgroundColor={colors.surface}
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        gap={0}
        width="100%"
      >
        {briefing.rows.map((row, index) => (
          <BriefingLine key={row.id} row={row} visible={index < visibleCount} />
        ))}

        {ready ? (
          <box flexDirection="row" gap={1} paddingTop={1}>
            <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
              COMMANDS
            </text>
            <text fg={colors.info}>{briefing.commandHints.join(' · ')}</text>
          </box>
        ) : null}
      </box>

      {ready ? (
        <box flexDirection="row" gap={1}>
          <PulseText
            activeColor={colors.primary}
            dimColor={colors.dimSeparator}
            bold
            intervalMs={800}
          >
            [ READY ]
          </PulseText>
          <text attributes={TextAttributes.DIM}>
            {mode === Mode.PLAN
              ? 'Plan mode — read-only tools'
              : 'Build mode — full edit + bash access'}
          </text>
        </box>
      ) : null}
    </box>
  );
}
