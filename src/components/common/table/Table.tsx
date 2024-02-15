import { t } from 'i18next';

import { useState } from 'react';
import { toast } from 'react-toastify';

import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
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

import ReadableTextField from './ReadableTextField';
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

const StyledBox = styled(Box)({
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dddddd',
  overflowY: 'auto',
});

const StyledTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dddddd',
  overflowY: 'auto',
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
        setEditing((currState) => {
          const newMap = new Map(currState);
          newMap.delete(keyword);
          return newMap;
        });
        onDeleteSelection(keywords.filter((k) => k.word === keyword));
        setSelected((currSelection) =>
          currSelection.filter((s) => s.word !== keyword),
        );
        break;
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
      setEditing((currState) => {
        const newMap = new Map(currState);
        filteredSelection.forEach((k) => newMap.delete(k.word));
        return newMap;
      });
      onDeleteSelection(filteredSelection);
      setSelected((currSelection) =>
        currSelection.filter((s) => !filteredSelection.includes(s)),
      );
    }
  };

  const handleKeyWordChanged = (oldKey: string, newKeyword: Keyword): void => {
    console.log('editing', oldKey, newKeyword);
    return setEditing((currState) => {
      const newMap = new Map(currState);
      newMap.set(oldKey, newKeyword);
      return newMap;
    });
  };

  const renderWarningIcon = (title: JSX.Element): JSX.Element => (
    <HtmlTooltip title={title}>
      <WarningIcon sx={{ marginLeft: '5px', color: '#FFCC00' }} />
    </HtmlTooltip>
  );

  return (
    <StyledBox>
      <StyledTable>
        <thead>
          <tr>
            <StyledTd colSpan={editing.size ? 3 : 4}>
              <TextField
                // TODO: translate me
                placeholder="Search for a keyword"
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
            </StyledTd>
            {Boolean(editing.size) && (
              <StyledTd>
                <Stack direction="row">
                  {/* TODO: translate me too */}
                  <Tooltip title="Save all the modifications">
                    <IconButton
                      aria-label="save-all-rows-icon"
                      onClick={() => {
                        editing.forEach((_keyword, key) => {
                          if (filteredKeywords.find((k) => k.word === key)) {
                            handleSaveKeyword(key);
                          }
                        });
                      }}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  {/* TODO: translate me */}
                  <Tooltip title="Discard all the modifications">
                    <IconButton
                      aria-label="cancel-all-rows-icon"
                      onClick={() => {
                        editing.forEach((_keyword, key) => {
                          if (filteredKeywords.find((k) => k.word === key)) {
                            removeEditingKeyword(key);
                          }
                        });
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </StyledTd>
            )}
          </tr>
        </thead>
        <thead>
          <tr>
            {/* TODO: add a global checkbox */}
            <StyledTh style={{ width: '10px' }}>
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
                <StyledTd style={{ width: '50%' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ReadableTextField
                      value={editing.get(k.word)?.word ?? k.word}
                      size="small"
                      onChange={(value) =>
                        handleKeyWordChanged(k.word, {
                          word: value,
                          // TODO: put in function
                          def: editing.get(k.word)?.def ?? k.def,
                        })
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
                <StyledTd style={{ width: '50%' }}>
                  <ReadableTextField
                    value={editing.get(k.word)?.def ?? k.def}
                    size="small"
                    onChange={(value) =>
                      handleKeyWordChanged(k.word, {
                        def: value,
                        // TODO: put in function
                        word: editing.get(k.word)?.word ?? k.word,
                      })
                    }
                    multiline
                    readonly={!isInEdition(k.word)}
                  />
                </StyledTd>
                <StyledTd style={{ width: '10px' }}>
                  <TableActions
                    keyword={k.word}
                    editing={isInEdition(k.word)}
                    onEvent={handleActionEvents}
                  />
                </StyledTd>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                {/* TODO: translate me */}
                <Box padding={2}>
                  <Typography>
                    {!keywords.length
                      ? 'There is no keywords for now.'
                      : `No keywords found for "${filter}".`}
                  </Typography>
                </Box>
              </td>
            </tr>
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
    </StyledBox>
  );
};

export default Table;
