import { FC, useState } from 'react';
import { toast } from 'react-toastify';

import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Box,
  IconButton,
  List,
  ListItem,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';

import { isKeywordPresent } from '@/utils/keywords';

import { Keyword } from '../../../config/appSettingTypes';
import { keywordAlreadyExistsWarningMessage } from '../../../config/messages';
import {
  ADD_KEYWORD_BUTTON_CY,
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_DEFINITION_FIELD_CY,
  ENTER_KEYWORD_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
} from '../../../config/selectors';
import {
  DEFAULT_MARGIN,
  FULL_WIDTH,
  ICON_MARGIN,
} from '../../../config/stylingConstants';
import GraaspButton from './GraaspButton';

type Prop = {
  textStudents: string;
  chatbotEnabled: boolean;
  keywords: Keyword[];
  onChange: (keywords: Keyword[]) => void;
};

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

const KeyWords: FC<Prop> = ({
  keywords,
  textStudents,
  chatbotEnabled,
  onChange,
}) => {
  const defaultKeywordDef = { word: '', def: '' };
  const [keywordDef, setKeywordDef] = useState<Keyword>(defaultKeywordDef);

  const updateKeywordDefinition = (
    key: keyof Keyword,
    target: { value: string },
  ): void => {
    setKeywordDef({
      ...keywordDef,
      [key]: target.value,
    });
  };

  const isDefinitionSet = keywordDef.def && keywordDef.def !== '';

  const handleOnChanges = (newDictionary: Keyword[]): void =>
    onChange(newDictionary);

  const handleClickAdd = (): void => {
    const wordToLowerCase = keywordDef.word.toLocaleLowerCase();
    const definition = isDefinitionSet ? keywordDef.def : 'no definition';
    const newKeyword = { word: wordToLowerCase, def: definition };

    if (keywords.some((k) => k.word === wordToLowerCase)) {
      toast.warning(keywordAlreadyExistsWarningMessage(wordToLowerCase));
      return;
    }

    if (wordToLowerCase !== '') {
      handleOnChanges([...keywords, newKeyword]);
    }
    setKeywordDef(defaultKeywordDef);
  };

  const handleDelete = (id: string): void => {
    handleOnChanges(keywords.filter((k) => k.word !== id));
  };

  const keyWordsItems = keywords.map((k) => (
    <ListItem
      data-cy={KEYWORD_LIST_ITEM_CY}
      key={k.word}
      sx={{ padding: '0px' }}
    >
      <IconButton
        data-cy={DELETE_KEYWORD_BUTTON_CY}
        aria-label="delete"
        sx={{ marginRight: ICON_MARGIN }}
        onClick={() => handleDelete(k.word)}
      >
        <DeleteIcon />
      </IconButton>
      {`${k.word} : ${k.def}`}
      {!isKeywordPresent(textStudents, k.word) && (
        <HtmlTooltip
          title={
            <>
              <Typography color="inherit">Keyword not in the text</Typography>
              The keyword &quot;{k.word}&quot; is not in the saved version of
              the text students.
              <br />
              <br />
              The keyword will not be displayed in the player.
            </>
          }
        >
          <WarningIcon sx={{ marginLeft: '5px', color: '#FFCC00' }} />
        </HtmlTooltip>
      )}
    </ListItem>
  ));

  return (
    <Box sx={{ margin: DEFAULT_MARGIN }}>
      {chatbotEnabled && (
        <Alert severity="info" sx={{ mb: 4 }}>
          When the chatbot is enabled, all the definitions of keywords are
          ignored. This is because the chatbot is displayed instead of the
          definition.
        </Alert>
      )}
      <Box
        component="span"
        justifyContent="space-between"
        display="flex"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        rowGap={2}
      >
        <TextField
          data-cy={ENTER_KEYWORD_FIELD_CY}
          label="Enter the keyword"
          sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
          value={keywordDef.word}
          onChange={(e) => updateKeywordDefinition('word', e.target)}
        />
        <TextField
          data-cy={ENTER_DEFINITION_FIELD_CY}
          label="Enter the keyword's definition"
          sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
          value={keywordDef.def}
          onChange={(e) => updateKeywordDefinition('def', e.target)}
        />
        <Box alignSelf={{ xs: 'flex-end', sm: 'auto' }}>
          <GraaspButton
            buttonDataCy={ADD_KEYWORD_BUTTON_CY}
            handleOnClick={handleClickAdd}
            disabled={!keywordDef.word}
            sx={{ xs: { margin: '0px' }, sm: { margin: DEFAULT_MARGIN } }}
            minHeight="55px"
            text="Add"
          />
        </Box>
      </Box>
      <List>{keyWordsItems}</List>
    </Box>
  );
};

export default KeyWords;
