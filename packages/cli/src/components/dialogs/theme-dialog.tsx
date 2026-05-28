import { useCallback, useEffect, useRef } from 'react';
import { TextAttributes } from '@opentui/core';
import { useDialog } from '../../providers/dialog';
import { useTheme } from '../../providers/theme';
import { DialogSearchList } from '../dialog-search-list';
import { THEMES } from '../../theme';
import type { Theme } from '../../theme';

export const ThemeDialogContent = () => {
  const dialog = useDialog();
  const { setTheme, currentTheme } = useTheme();
  const originalThemeRef = useRef(currentTheme);
  const confirmedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!confirmedRef.current) {
        setTheme(originalThemeRef.current);
      }
    };
  }, [setTheme]);

  const handleSelect = useCallback(
    (theme: Theme) => {
      confirmedRef.current = true;
      setTheme(theme);
      dialog.close();
    },
    [setTheme, dialog],
  );

  return (
    <DialogSearchList
      items={THEMES}
      onSelect={handleSelect}
      filterFn={(t, query) =>
        `${t.name} ${t.codename}`.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(theme, isSelected) => (
        <box flexDirection="row" gap={1} width="100%">
          <text
            selectable={false}
            fg={isSelected ? 'black' : 'white'}
            attributes={TextAttributes.BOLD}
          >
            {theme.name === originalThemeRef.current.name ? '◆' : '◇'}
          </text>
          <text selectable={false} fg={isSelected ? 'black' : 'white'}>
            {theme.name}
          </text>
          <text
            selectable={false}
            fg={isSelected ? 'black' : undefined}
            attributes={TextAttributes.DIM}
          >
            // {theme.codename}
          </text>
        </box>
      )}
      getKey={(t) => t.name}
      placeholder="Search themes"
      emptyText="No matching themes"
    />
  );
};
