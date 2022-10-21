import { FC } from 'react';

import { Box, Button, Typography } from '@mui/material';

type Prop = { text: string };
const BOX_DEFAULT = {
  height: '70px',
  backgroundColor: '#BABABA',
  padding: '2px',
  minWidth: '600px',
};

// eslint-disable-next-line arrow-body-style
const TextDisplay: FC<Prop> = ({ text }) => {
  return (
    <div>
      <Box
        component="span"
        justifyContent="space-between"
        display="flex"
        alignItems="center"
        sx={BOX_DEFAULT}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#5050d2',
            marginLeft: '25px',
            fontWeight: '500',
          }}
        >
          Lesson Title
        </Typography>
        <Button
          variant="contained"
          color="success"
          sx={{ marginRight: '25px' }}
        >
          Summon
        </Button>
      </Box>

      <Typography
        variant="body1"
        sx={{
          margin: '25px',
          border: '2px solid #5050d2',
          borderRadius: '25px',
          padding: '25px',
        }} // la couleur ne s'affiche pas avec --graasp-primary
      >
        {text}
      </Typography>
    </div>
  );
};

export default TextDisplay;
