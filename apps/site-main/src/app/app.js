import { createEmotionCache } from "../utils/create-emotion-cache";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useRoutes } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import Dashboard from "../pages/dashboard";


const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // const getLayout = Component.getLayout ?? ((page) => page);

  const routes = [
    {
      path: "/",
      element: <DashboardLayout/>,
      children: [
        {path: 'dashboard', element: <Dashboard/>}
      ]
    },
  ];

  return (
    <CacheProvider value={emotionCache}>
      <head>
        <title>
          Material Kit Pro
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* {getLayout(<Component {...pageProps} />)} */}
          {useRoutes(routes)}
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;