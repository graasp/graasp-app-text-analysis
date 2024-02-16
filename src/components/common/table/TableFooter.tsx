import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';

import { StyledTd } from './styles';

type Props = {
  isSelectable: boolean;
  isEditable: boolean;
  totalColumns: number;
  numberFilteredSelection: number;

  handleDeleteSelection: () => void;
};

const TableFooter = ({
  isSelectable,
  isEditable,
  totalColumns,
  numberFilteredSelection,
  handleDeleteSelection,
}: Props): JSX.Element | null => {
  if (isSelectable && isEditable) {
    return (
      <tfoot>
        <tr>
          <StyledTd colSpan={totalColumns}>
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              onClick={handleDeleteSelection}
              disabled={!numberFilteredSelection}
            >
              {/* TODO: translate me */}
              Delete selection ({numberFilteredSelection})
            </Button>
          </StyledTd>
        </tr>
      </tfoot>
    );
  }
  return null;
};

export default TableFooter;
