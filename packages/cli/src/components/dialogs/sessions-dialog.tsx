import { useCallback } from 'react';
import { TextAttributes } from '@opentui/core';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { useDialog } from '../../providers/dialog';
import { useTheme } from '../../providers/theme';
import { DialogSearchList } from '../dialog-search-list';
import { listSessions, loadSession, type SessionMeta } from '../../lib/session-store';

export const SessionsDialogContent = () => {
  const sessions = listSessions(process.cwd());
  const { close } = useDialog();
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleSelect = useCallback(
    (session: SessionMeta) => {
      const record = loadSession(process.cwd(), session.id);
      if (!record) return;

      close();
      navigate(`/sessions/${session.id}`, { state: { session: record } });
    },
    [close, navigate],
  );

  return (
    <DialogSearchList
      items={sessions}
      onSelect={handleSelect}
      filterFn={(s, query) =>
        s.title.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(session, isSelected) => (
        <>
          <text
            selectable={false}
            fg={isSelected ? 'black' : colors.primary}
            attributes={TextAttributes.BOLD}
          >
            ◇
          </text>
          <text selectable={false} fg={isSelected ? 'black' : 'white'}>
            {session.title}
          </text>
          <box flexGrow={1} />
          <text
            selectable={false}
            fg={isSelected ? 'black' : undefined}
            attributes={TextAttributes.DIM}
          >
            {format(new Date(session.updatedAt), 'hh:mm a')}
          </text>
        </>
      )}
      getKey={(s) => s.id}
      placeholder="Scan session archive"
      emptyText="No matching sessions"
    />
  );
};
