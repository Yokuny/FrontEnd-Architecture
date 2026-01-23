import styled, { css } from "styled-components";

export const ItemRow = styled.div`
  ${({ colorTextTheme, theme }) => css`
    border-left: 6px solid ${theme[colorTextTheme]};
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;

    &:hover {
        cursor: pointer;
        background-color: ${theme.colorBasicHover};
        color: ${theme.colorPrimary500};
      }
    }
  `}
`;