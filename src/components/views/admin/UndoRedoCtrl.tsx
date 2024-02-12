import { Button, Stack } from '@mui/material';

import { CommandDataType } from '@/commands/commands';
import { UseHistoryManager } from '@/commands/useHistoryManager';

type Props = {
  useHistoryManager: UseHistoryManager<CommandDataType>;
};

const UndoRedoCtrl = ({ useHistoryManager }: Props): JSX.Element => (
  <Stack direction="row">
    <Button
      onClick={() => useHistoryManager.undo()}
      disabled={!useHistoryManager.hasPrevCommand()}
    >
      {/* TODO: translate */}
      Undo
    </Button>
    <Button
      onClick={() => useHistoryManager.redo()}
      disabled={!useHistoryManager.hasNextCommand()}
    >
      {/* TODO: translate */}
      Redo
    </Button>
  </Stack>
);

export default UndoRedoCtrl;
