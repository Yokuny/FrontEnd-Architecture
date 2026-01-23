import React from "react";
import { useIntl } from "react-intl";
import { formatDateDiff } from "../Utils";

export const DateDiff = ({ dateInitial, idReplaceText = "" }) => {
  const intl = useIntl();

  return <>{formatDateDiff(dateInitial, intl, idReplaceText)}</>;
};
