import styled, { css } from "styled-components";

export const Divide = styled.div`
  ${({ theme, mh = "" }) => css`
    border-bottom: 1px solid ${theme.dividerColor};
    ${mh &&
    `margin-left: ${mh};
    margin-right: ${mh};`}
  `}
`;
