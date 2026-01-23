import React from "react";
import { Store } from "../../configureStore";

export const useThemeSelected = () => {

  const theme = Store.getState()?.settings?.theme;

  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(theme === "dark" || theme === "cosmic")
  }, [theme])

  return { isDark }
}
