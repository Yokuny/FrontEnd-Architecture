import { Row, Spinner } from "@paljs/ui";
import styled, { css } from "styled-components";

export const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

export const ContainerRowContent = styled(Row)`
  z-index: 9;
  display: flex;
  flex-direction: row;

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;

  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;
export const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;
