import { FC, useEffect, useState } from 'react';
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

import {
  KEYWORDS_SETTING_KEY,
  KeywordsData,
  keyword,
} from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORDS_LIST } from '../../../config/appSettings';
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
import { useAppSettingContext } from '../../context/AppSettingContext';
import GraaspButton from './GraaspButton';

type KeywordDefinition = {
  keyword: string;
  definition: string;
};

type Prop = {
  textStudents: string;
  chatbotEnabled: boolean;
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

const KeyWords: FC<Prop> = ({ textStudents, chatbotEnabled }) => {
  const defaultKeywordDef = { keyword: '', definition: '' };

  const [keywordDef, setKeywordDef] =
    useState<KeywordDefinition>(defaultKeywordDef);

  const [dictionary, setDictionary] = useState<keyword[]>([]);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const updateKeywordDefinition = (
    key: keyof KeywordDefinition,
    target: { value: string },
  ): void => {
    setKeywordDef({
      ...keywordDef,
      [key]: target.value,
    });
  };

  const isDefinitionSet = keywordDef.definition && keywordDef.definition !== '';

  // contains the keywords that are not in the text
  const keywordsNotInText = new Map(
    dictionary
      .filter(({ word }) => !textStudents.includes(word.toLowerCase()))
      .map(({ word }) => [word, true]),
  );

  const keywordsResourceSetting = appSettingArray.find(
    (s) => s.name === KEYWORDS_SETTING_KEY,
  );

  const { keywords } = (keywordsResourceSetting?.data ||
    DEFAULT_KEYWORDS_LIST) as KeywordsData;

  useEffect(() => {
    setDictionary(keywords);
  }, [keywords]);

  const saveKeywords = (newDictionary: keyword[]): void => {
    if (keywordsResourceSetting) {
      patchAppSetting({
        data: { keywords: newDictionary },
        id: keywordsResourceSetting.id,
      });
    } else {
      postAppSetting({
        data: { keywords: newDictionary },
        name: KEYWORDS_SETTING_KEY,
      });
    }
  };

  const handleClickAdd = (): void => {
    const wordToLowerCase = keywordDef.keyword.toLocaleLowerCase();
    const definition = isDefinitionSet
      ? keywordDef.definition
      : 'no definition';
    const newKeyword = { word: wordToLowerCase, def: definition };

    if (dictionary.some((k) => k.word === wordToLowerCase)) {
      toast.warning(keywordAlreadyExistsWarningMessage(wordToLowerCase));
      return;
    }

    if (wordToLowerCase !== '') {
      // use new array to apply modifications because setState is not immediate
      const newDictionary = [...dictionary, newKeyword];
      saveKeywords(newDictionary);
      setDictionary(newDictionary);
    }
    setKeywordDef(defaultKeywordDef);
  };

  const handleDelete = (id: string): void => {
    const newDictionary = dictionary.filter((k) => k.word !== id);
    saveKeywords(newDictionary);
    setDictionary(dictionary.filter((k) => k.word !== id));
  };

  const keyWordsItems = dictionary.map((k) => (
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
      {keywordsNotInText.get(k.word) && (
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
          value={keywordDef.keyword}
          onChange={(e) => updateKeywordDefinition('keyword', e.target)}
        />
        <TextField
          data-cy={ENTER_DEFINITION_FIELD_CY}
          label="Enter the keyword's definition"
          sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
          value={keywordDef.definition}
          onChange={(e) => updateKeywordDefinition('definition', e.target)}
        />
        <Box alignSelf={{ xs: 'flex-end', sm: 'auto' }}>
          <GraaspButton
            buttonDataCy={ADD_KEYWORD_BUTTON_CY}
            handleOnClick={handleClickAdd}
            disabled={!keywordDef.keyword}
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
