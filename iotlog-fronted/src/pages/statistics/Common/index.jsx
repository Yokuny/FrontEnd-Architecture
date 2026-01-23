import styled, { css } from "styled-components";

export const HeaderOrder = styled.a`
  ${({ theme }) => css`
    color: ${theme.textBasicColor};
  `}

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`;
