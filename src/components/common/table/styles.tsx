import { Box, SxProps, styled } from '@mui/material';

type StyledThProps = SxProps & {
  padding?: number;
};
const BORDER_COLOR = '#dddddd';
const BORDER_STYLE = `1px solid ${BORDER_COLOR}`;
const HEADER_BG_COLOR = '#f2f2f2';

export const StyledBox = styled(Box)({
  width: '100%',
  border: BORDER_STYLE,
  overflowY: 'auto',
});

export const StyledTable = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  border: BORDER_STYLE,
});

export const StyledTh = styled('th')(({ theme }) => ({
  border: BORDER_STYLE,
  padding: theme.spacing(1),
  textAlign: 'left',
  backgroundColor: HEADER_BG_COLOR,
}));

export const StyledTd = styled('td')<StyledThProps>(
  ({ width, padding, theme }) => ({
    border: BORDER_STYLE,
    padding: theme.spacing(padding ?? 1),
    width: width ?? 'auto',
  }),
);
