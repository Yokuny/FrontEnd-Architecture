import Col from "@paljs/ui/Col";
import styled, { css } from "styled-components";

export const ItemRow = styled.div`
  ${({ colorTextTheme, theme, color, onClick = undefined }) => css`
    ${colorTextTheme && `border-left: 6px solid ${theme[colorTextTheme]};`}
    ${color && `border-left: 6px solid ${color};`}
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;

    ${onClick &&
    `:hover {
      {
       cursor: pointer;
       background-color: ${theme.colorBasicHover};
       color: ${theme.colorPrimary500};
     }
   }`}
  `}
`;

export const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
