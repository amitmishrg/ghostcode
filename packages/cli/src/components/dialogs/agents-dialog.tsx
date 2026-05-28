import { useCallback } from 'react';
import { TextAttributes } from '@opentui/core';
import { useDialog } from '../../providers/dialog';
import { useTheme } from '../../providers/theme';
import { DialogSearchList } from '../dialog-search-list';
import { Mode, type ModeType } from '@ghostcode/shared';

const AVAILABLE_MODES: ModeType[] = [Mode.BUILD, Mode.PLAN];

type AgentsDialogContentProps = {
  currentMode: ModeType;
  onSelectMode: (mode: ModeType) => void;
};

function getModeLabel(mode: ModeType) {
  return mode === Mode.PLAN ? 'PLAN' : 'BUILD';
}

export const AgentsDialogContent = ({
  currentMode,
  onSelectMode,
}: AgentsDialogContentProps) => {
  const dialog = useDialog();
  const { colors } = useTheme();

  const handleSelect = useCallback(
    (nextMode: ModeType) => {
      onSelectMode(nextMode);
      dialog.close();
    },
    [onSelectMode, dialog],
  );

  return (
    <DialogSearchList
      items={AVAILABLE_MODES}
      onSelect={handleSelect}
      filterFn={(item, query) =>
        getModeLabel(item).toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(item, isSelected) => (
        <box flexDirection="row" gap={1}>
          <text
            selectable={false}
            fg={isSelected ? 'black' : colors.primary}
            attributes={TextAttributes.BOLD}
          >
            {item === currentMode ? '◆' : '◇'}
          </text>
          <text selectable={false} fg={isSelected ? 'black' : 'white'}>
            [{getModeLabel(item)}]
          </text>
        </box>
      )}
      getKey={(item) => item}
      placeholder="Select operating mode"
      emptyText="No matching agents"
    />
  );
};
