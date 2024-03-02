import { createTheme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';

// Define the theme object
const theme = createTheme({
  palette: {
    primary: {
      light: '#5c67a3',
      main: '#3f4771',
      dark: '#2e355b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff79b0',
      main: '#ff4081',
      dark: '#c60055',
      contrastText: '#000',
    },
    type: 'light',
  },
});

// Define the type for the theme object
type CustomTheme = typeof theme;

// Extend the Theme interface and ThemeOptions interface
declare module '@material-ui/core/styles/createTheme' {
  interface ThemeOptions extends CustomTheme {}
}

// Export the custom theme
export default theme;
