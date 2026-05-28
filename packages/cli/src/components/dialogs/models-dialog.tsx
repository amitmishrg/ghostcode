import { useCallback } from 'react';
import { TextAttributes } from '@opentui/core';
import { useDialog } from '../../providers/dialog';
import { useTheme } from '../../providers/theme';
import { DialogSearchList } from '../dialog-search-list';
import type { SupportedChatModelId } from '@ghostcode/shared';

type ModelsDialogContentProps = {
  models: SupportedChatModelId[];
  onSelectModel: (modelId: SupportedChatModelId) => void;
};

export const ModelsDialogContent = ({
  models,
  onSelectModel,
}: ModelsDialogContentProps) => {
  const dialog = useDialog();
  const { colors } = useTheme();

  const handleSelect = useCallback(
    (modelId: SupportedChatModelId) => {
      onSelectModel(modelId);
      dialog.close();
    },
    [dialog, onSelectModel],
  );

  return (
    <DialogSearchList
      items={models}
      onSelect={handleSelect}
      filterFn={(modelId, query) =>
        modelId.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(modelId, isSelected) => (
        <box flexDirection="row" gap={1}>
          <text
            selectable={false}
            fg={isSelected ? 'black' : colors.info}
            attributes={TextAttributes.BOLD}
          >
            ◇
          </text>
          <text selectable={false} fg={isSelected ? 'black' : 'white'}>
            {modelId}
          </text>
        </box>
      )}
      getKey={(modelId) => modelId}
      placeholder="Select neural model"
      emptyText="No matching models"
    />
  );
};
