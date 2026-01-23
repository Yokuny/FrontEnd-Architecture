import { Card, Row } from "@paljs/ui";
import styled, { css } from "styled-components";

export const CardContainer = styled(Card)`
  width: 100%;
  min-width: 6rem;
  max-width: 12rem;
  height: 5rem;
  text-align: center;
  z-index: 999;

  &:hover {
    filter: contrast(0.9);
    cursor: pointer;
  }
`;

export const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const RowContainer = styled(Row)`
  margin: 1rem 4rem;
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  justify-content: center;
  flex-wrap: nowrap;
`;

export const ColStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
export const IconStyled = styled.div`
  margin-top: 0.8rem;
  margin-left: 0.8rem;
`;

export const CardContainerStyled = styled(Card)`
  //box-shadow: none;
  margin-bottom: 1rem;
  width: 100%;
  min-width: 6rem;
  max-width: 9rem;
  height: 5rem;
  text-align: center;
  z-index: 999;

  &:hover {
    filter: contrast(0.9);
    cursor: pointer;
  }
  ${({ theme }) => css`
  background: ${theme.backgroundBasicColor1}dd;
  border: 1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3};
  `}
`;
