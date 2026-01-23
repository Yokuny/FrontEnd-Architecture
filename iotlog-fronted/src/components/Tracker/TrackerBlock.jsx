import styled, { css } from "styled-components";

const TrackerBlock = styled.div`
  max-width: 16px;
  width: 16px;
  height: 100%;
  border-radius: 4px;

  ${({ theme, status, onlyBorder, isPointer = false }) => css`
    ${status && !onlyBorder && `background-color: ${status === "Control" ?  theme[`colorBasic600`] : theme[`color${status}500`]};`}
    ${onlyBorder && `border: 2px solid ${theme[`color${status}500`]};`}
    ${isPointer && `cursor: pointer;`}
  `}
`;

export default TrackerBlock;
