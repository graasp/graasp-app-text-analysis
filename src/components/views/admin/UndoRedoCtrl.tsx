import { Button, Stack } from '@mui/material';

import { CommandDataType, HistoryManager } from '@/commands/commands';

type Props = {
  history: HistoryManager<CommandDataType>;
};

const UndoRedoCtrl = ({ history }: Props): JSX.Element => (
  <Stack direction="row">
    <Button
      onClick={() => history.undo()}
      disabled={!history.formattedBackHistory().length}
    >
      {/* TODO: translate */}
      Undo
    </Button>
    <Button
      onClick={() => history.redo()}
      disabled={!history.formattedForwardHistory().length}
    >
      {/* TODO: translate */}
      Redo
    </Button>
  </Stack>
);

export default UndoRedoCtrl;
