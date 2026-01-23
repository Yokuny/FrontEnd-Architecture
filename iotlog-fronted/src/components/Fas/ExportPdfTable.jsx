import {
  Table as TableSR,
  Thead as TheadSR,
  Tbody as TbodySR,
  Tr as TrSR,
  Th as ThSR,
  Td as TdSR,
} from "react-super-responsive-table";
import styled, { css } from "styled-components";

import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

export const TRH = styled(TrSR)`
  ${({ theme, textAlign = "" }) => css`
    ${textAlign && `text-align: ${textAlign};`}
    border: 1pt solid #000 !important;
  `}
`;

export const TR = styled(TrSR)`
  ${({ theme, isEvenColor = undefined }) => css`
    ${isEvenColor === false && `background-color: ${theme.backgroundBasicColor2};`}
    border: 1pt solid #000 !important;
  `}
`;

export const TH = styled(ThSR)`
  ${({ theme, textAlign = "" }) => css`
    /* background-color: ${theme.backgroundBasicColor4}; */
    padding: 5pt;
    ${textAlign && `text-align: ${textAlign};`}
    border: 1pt solid #000 !important;
  `}
`;

export const TD = styled(TdSR)`
  ${({ theme, textAlign = "" }) => css`
    padding: 5pt;
    ${textAlign && `text-align: ${textAlign};`}
    border: 1pt solid #000 !important;
  `}
`;

export const TABLE = styled(TableSR)`
  ${({ theme }) => css`
  background-color: ${theme.backgroundBasicColor1};
  border-collapse: collapse !important;
  `}
`;

export const TBODY = styled(TbodySR)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;
export const THEAD = styled(TheadSR)``;
