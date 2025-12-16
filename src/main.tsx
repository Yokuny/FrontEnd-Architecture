import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";

// Import translations
import enText from "../translations/en.json";
import esText from "../translations/es.json";
import ptText from "../translations/pt.json";
import reportWebVitals from "./reportWebVitals.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Available messages by locale
const messages: Record<string, Record<string, string>> = {
  en: enText,
  es: esText,
  pt: ptText,
};

// Get browser language or default to 'en'
const getBrowserLanguage = (): string => {
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage && messages[savedLanguage]) {
    return savedLanguage;
  }

  const browserLang = navigator.language.split("-")[0];
  return messages[browserLang] ? browserLang : "en";
};

// App component with IntlProvider
function App() {
  const [locale, setLocale] = useState<string>(getBrowserLanguage());

  useEffect(() => {
    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "language" && e.newValue && messages[e.newValue]) {
        setLocale(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
      <RouterProvider router={router} />
    </IntlProvider>
  );
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
