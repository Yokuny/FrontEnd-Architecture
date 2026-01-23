import React from "react";
import { ThemeProvider } from "styled-components";
import { Layout } from "@paljs/ui/Layout";
import icons from "@paljs/icons";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import * as Sentry from "@sentry/react";
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType } from '@azure/msal-browser';

import { getTokenDecoded } from "./components/Utils";
import GoogleTracking from "./components/Tracking";
import { msalConfig } from './authConfig';

import GlobalStyles from "./layouts/GlobalStyles";
import themes from "./themes";
import RouteMap from "./routes";

import messages_pt from "./translations/pt.json";
import messages_en from "./translations/en.json";
import messages_es from "./translations/es.json";

import "react-toastify/dist/ReactToastify.css";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { SocketProvider } from "./components/Contexts/SocketContext";

const messages = {
  pt: messages_pt,
  en: messages_en,
  es: messages_es,
};

if (process.env.NODE_ENV === "production" && process.env.REACT_APP_SENTRY_DSN) {
  Sentry.setUser({
    username: getTokenDecoded()?.name,
    segment: localStorage.getItem('id_enterprise_filter')
  });
}

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const App = (props) => {
  const { locale } = props;

  return (
    <>
      <MsalProvider instance={msalInstance}>
        <IntlProvider
          locale={locale === "pt" ? "pt-BR" : locale}
          messages={messages[locale]}
        >
          <SocketProvider>
            <ThemeProvider theme={themes(props.theme, "ltr")}>
                <QueryClientProvider client={new QueryClient()}>
                  <GlobalStyles />
                  <Layout evaIcons={icons} dir="ltr">
                    <BrowserRouter basename={process.env.REACT_APP_BASENAME || ""}>
                      <RouteMap />
                      <GoogleTracking />
                    </BrowserRouter>
                    <ToastContainer />
                  </Layout>
                </QueryClientProvider>
            </ThemeProvider>
          </SocketProvider>
        </IntlProvider>
      </MsalProvider>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
  locale: state.settings.locale,
});

export default connect(mapStateToProps, undefined)(App);
