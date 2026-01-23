import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import App from "./App";
import { Store } from "./configureStore";
import * as serviceWorker from "./serviceWorker";

import "./assets/application.css";

if (process.env.REACT_APP_SENTRY_DSN) {
  const messagesSkip = [
    "Atividade suspeita! O que você faz por aqui?",
    "Suspicious activity! What do you do around here?",
    "Você é DEV?! Estamos contratando ... Are you DEV?! we are hiring ...",
    "Se alguém te mandou aqui desconfie! If someone sent you here, be suspicious!",
    "Sua atividade foi monitorada! Your activity has been monitored",
  ];

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    beforeSend(event) {
      if (event?.message &&
        messagesSkip?.some((message) => event?.message?.includes(message))) {
        return null;
      }
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb?.message &&
        messagesSkip?.some((message) => breadcrumb?.message?.includes(message))) {
        return null;
      }
      return breadcrumb;
    }
  });
}

const root = createRoot(document.getElementById("root"), {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
});
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (process.env.NODE_ENV === "production") {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
