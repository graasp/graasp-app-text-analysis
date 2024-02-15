import { t } from 'i18next';

import { useState } from 'react';
import { toast } from 'react-toastify';

import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';

import { Keyword } from '@/config/appSettingTypes';
import { TEXT_ANALYSIS } from '@/langs/constants';
import { isKeywordPresent } from '@/utils/keywords';

import DebouncedTextField from './DebouncedTextField';
import TableActions, { TableActionEvent } from './TableActions';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const StyledTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dddddd',
});

const StyledTh = styled('th')({
  border: '1px solid #dddddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
});

const StyledTd = styled('td')({
  border: '1px solid #dddddd',
  padding: '8px',
  textAlign: 'left',
});

const includes = (text: string, search: string): boolean =>
  text.toLowerCase().includes(search.toLowerCase());

type Props = {
  keywords: Keyword[];
  text: string;
  onUpdate: (oldKey: string, newKeyword: Keyword) => void;
  onDeleteSelection: (selectedKeywords: Keyword[]) => void;
};

const Table = ({
  keywords,
  text,
  onUpdate,
  onDeleteSelection,
}: Props): JSX.Element => {
  const [filter, setFilter] = useState<string>('');

  const filterKeywords = (k: Keyword): boolean =>
    includes(k.word, filter) || includes(k.def, filter);

  const filteredKeywords = keywords.filter(filterKeywords);
  const [selected, setSelected] = useState<Keyword[]>([]);
  const filteredSelection = selected.filter(filterKeywords);
  const keywordsDuplication = keywords.reduce<
    Map<string, { firstIdx: number; number: number }>
  >((acc, keyword, idx) => {
    acc.set(keyword.word, {
      firstIdx: acc.get(keyword.word)?.firstIdx ?? idx,
      number: (acc.get(keyword.word)?.number ?? 0) + 1,
    });
    return acc;
  }, new Map());

  const [editing, setEditing] = useState<Map<string, Keyword>>(new Map());

  const isInEdition = (keyword: string): boolean => editing.has(keyword);

  const getKeyword = (word: string): Keyword | undefined =>
    keywords.find((k) => k.word === word);

  const addInEdition = (keyWord: Keyword): void =>
    setEditing((currState) => new Map([...currState, [keyWord.word, keyWord]]));

  const handleEdit = (word: string): void => {
    if (isInEdition(word)) {
      console.warn(`Keyword ${word} is already been editing...`);
      return;
    }

    const keyword = getKeyword(word);
    if (keyword) {
      addInEdition(keyword);
    } else {
      console.warn(`Keyword ${word} is not found !`);
    }
  };

  const removeEditingKeyword = (word: string): void =>
    setEditing((currState) => {
      const newMap = new Map(currState);
      newMap.delete(word);
      return newMap;
    });

  const handleSaveKeyword = (word: string): void => {
    const newKeyword = editing.get(word);

    if (
      word.toLowerCase() !== newKeyword?.word.toLowerCase() &&
      keywords.find(
        (k) => k.word.toLowerCase() === newKeyword?.word.toLowerCase(),
      )
    ) {
      toast.warning(
        t(TEXT_ANALYSIS.KEYWORD_ALREADY_EXIST_WARNING_MESSAGE, {
          keyword: newKeyword?.word?.toLowerCase(),
        }),
      );
      return;
    }

    if (newKeyword) {
      onUpdate(word, newKeyword);
      removeEditingKeyword(word);
    }
  };

  const handleActionEvents = (
    keyword: string,
    event: TableActionEvent,
  ): void => {
    switch (event) {
      case TableActionEvent.EDIT:
        handleEdit(keyword);
        break;
      case TableActionEvent.DISCARD:
        removeEditingKeyword(keyword);
        break;
      case TableActionEvent.SAVE:
        handleSaveKeyword(keyword);
        break;
      case TableActionEvent.DELETE:
      default:
        console.error(`TableActionEvent "${event}" unknown.`);
    }
  };

  const handleCheckBoxChanged = (
    isChecked: boolean,
    keyword: Keyword,
  ): void => {
    if (isChecked && !selected.includes(keyword)) {
      setSelected((currState) => [...currState, keyword]);
    } else if (!isChecked && selected.includes(keyword)) {
      setSelected((currState) =>
        currState.filter((k) => k.word.localeCompare(keyword.word)),
      );
    }
  };

  const handleDeleteSelection = (): void => {
    if (selected.length) {
      onDeleteSelection(filteredSelection);
      setSelected((currSelection) =>
        currSelection.filter((s) => !filteredSelection.includes(s)),
      );
    }
  };

  const handleKeyWordChanged = (oldKey: string, newKeyword: Keyword): void =>
    setEditing((currState) => {
      const newMap = new Map(currState);
      newMap.set(oldKey, newKeyword);
      return newMap;
    });

  const renderWarningIcon = (title: JSX.Element): JSX.Element => (
    <HtmlTooltip title={title}>
      <WarningIcon sx={{ marginLeft: '5px', color: '#FFCC00' }} />
    </HtmlTooltip>
  );

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" padding={1}>
        <TextField
          // TODO: translate me
          placeholder="Filter out by keyword or definition"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
          onChange={(event) => setFilter(event.target.value)}
        />
      </Stack>
      <StyledTable>
        <thead>
          <tr>
            {/* TODO: add a global checkbox */}
            <StyledTh>
              <Checkbox
                checked={Boolean(
                  filteredSelection.length &&
                    filteredSelection.length === filteredKeywords.length,
                )}
                indeterminate={Boolean(
                  filteredSelection.length &&
                    filteredSelection.length !== filteredKeywords.length,
                )}
                onChange={(_e, isChecked) => {
                  const newSelection = selected.filter(
                    (s) => !filteredSelection.includes(s),
                  );

                  if (isChecked) {
                    filteredKeywords.forEach((k) => newSelection.push(k));
                  }
                  setSelected(newSelection);
                }}
              />
            </StyledTh>
            <StyledTh>Keyword</StyledTh>
            <StyledTh>Definition</StyledTh>
            <StyledTh>Actions</StyledTh>
          </tr>
        </thead>
        <tbody>
          {filteredKeywords.length ? (
            filteredKeywords.map((k, idx) => (
              <tr key={k.word}>
                <StyledTd style={{ maxWidth: '10px' }}>
                  <Checkbox
                    onChange={(_e, isChecked) =>
                      handleCheckBoxChanged(isChecked, k)
                    }
                    checked={selected.includes(k)}
                  />
                </StyledTd>
                <StyledTd>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DebouncedTextField
                      value={editing.get(k.word)?.word ?? k.word}
                      size="small"
                      onChange={(value) =>
                        handleKeyWordChanged(k.word, { ...k, word: value })
                      }
                      readonly={!isInEdition(k.word)}
                    />
                    {!isKeywordPresent(text, k.word) &&
                      renderWarningIcon(
                        <>
                          <Typography color="inherit">
                            {t(
                              TEXT_ANALYSIS.KEYWORDS_NOT_IN_TEXT_TOOLTIP_TITLE,
                            )}
                          </Typography>
                          {t(TEXT_ANALYSIS.KEYWORDS_NOT_IN_TEXT_TOOLTIP_MSG, {
                            keyword: k.word,
                          })}
                        </>,
                      )}
                    {(keywordsDuplication.get(k.word)?.number ?? 0) > 1 &&
                      (keywordsDuplication.get(k.word)?.firstIdx ?? -1) !==
                        idx &&
                      // TODO: translate
                      renderWarningIcon(
                        <Typography>
                          The keyword {k.word} is already set. Only the first
                          one will be used in the player.
                        </Typography>,
                      )}
                  </Stack>
                </StyledTd>
                <StyledTd>
                  <DebouncedTextField
                    value={editing.get(k.word)?.def ?? k.def}
                    size="small"
                    onChange={(value) =>
                      handleKeyWordChanged(k.word, { ...k, def: value })
                    }
                    multiline
                    readonly={!isInEdition(k.word)}
                  />
                </StyledTd>
                <StyledTd>
                  <TableActions
                    keyword={k.word}
                    editing={isInEdition(k.word)}
                    onEvent={handleActionEvents}
                  />
                </StyledTd>
              </tr>
            ))
          ) : (
            // TODO: translate me
            <Box padding={2}>
              <Typography>No keywords found for {filter}.</Typography>
            </Box>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <Box padding={1}>
                <Button
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  onClick={handleDeleteSelection}
                  disabled={!filteredSelection.length}
                >
                  {/* TODO: translate me */}
                  Delete selection ({filteredSelection.length})
                </Button>
              </Box>
            </td>
          </tr>
        </tfoot>
      </StyledTable>
    </Stack>
  );
};

export default Table;
