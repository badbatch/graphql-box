import { Dialog, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { get } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogById } from '../../features/logs/slice.ts';
import { requestDiffModal, requestVersionDialog } from '../../features/ui/slice.ts';
import { reader } from '../../locales/reader.ts';
import { type Store } from '../../types.ts';
import { type RequestDiffSelectProps } from './types.ts';

const requestVersions = ['labels.request', 'labels.parsedRequest', 'labels.filteredRequest'];
const title = reader.scope('diffSelectDialog.title');

export const DiffSelectDialog = ({ activeRequestVersion, logId, onClose, open }: RequestDiffSelectProps) => {
  const logEntry = useSelector((state: Store) => selectLogById(state, logId));
  const dispatch = useDispatch();

  const filteredVersions = requestVersions.filter(
    version => version !== activeRequestVersion && !!get(logEntry, version)
  );

  return (
    <Dialog onClose={onClose} open={open} transitionDuration={{ exit: 0 }}>
      <DialogTitle>
        {filteredVersions.length > 0
          ? title.read('withFilters', { vars: { activeRequestVersion } })
          : title.read('withoutFilters')}
      </DialogTitle>
      {filteredVersions.length > 0 ? (
        <List sx={{ padding: 0 }}>
          {filteredVersions.map(version => (
            <ListItem
              button
              key={version}
              onClick={() => {
                dispatch(requestDiffModal([logId, activeRequestVersion, version]));
                dispatch(requestVersionDialog(''));
              }}
            >
              <ListItemText primary={version} />
            </ListItem>
          ))}
        </List>
      ) : undefined}
    </Dialog>
  );
};
