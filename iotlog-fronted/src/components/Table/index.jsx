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
  `}
`;

export const TR = styled(TrSR)`
  ${({ theme, isEvenColor = undefined, isEvenBorder = undefined }) => css`
    ${isEvenColor === false && `background-color: ${theme.backgroundBasicColor2};`}
    ${isEvenBorder === false && `
    border-bottom: 2px solid ${theme.backgroundBasicColor3};
    `}
  `}
`;

export const TH = styled(ThSR)`
  ${({ theme, textAlign = "" }) => css`
    /* background-color: ${theme.backgroundBasicColor4}; */
    padding: 5px;
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

export const TD = styled(TdSR)`
  ${({ theme, textAlign = "", top = false }) => css`
    padding: 5px;
    ${textAlign && `text-align: ${textAlign};`}
    ${top && `vertical-align: top; padding-top: 10px;`}
  `}
`;

export const TABLE = styled(TableSR)`
  ${({ theme }) => css`
  background-color: ${theme.backgroundBasicColor1};
  `}
  @media screen and (max-width: 40em) {
      tbody tr {
        border: none !important;
      }
  }
`;

export const TBODY = styled(TbodySR)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;
export const THEAD = styled(TheadSR)``;
