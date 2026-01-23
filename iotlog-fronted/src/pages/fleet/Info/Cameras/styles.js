import { Button, Col } from "@paljs/ui";
import styled, { css } from "styled-components";

export const Content = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}

  position: relative;

  height: 60vh;
  width: 100%;
  padding: 10px;

  .rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

export const ButtonClosed = styled(Button)`
  top: 20px;
  right: 5px;
  position: absolute;
  padding: 2px;
`

export const ColFlex = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  height: 40vh;
  gap: 1rem;
`;

export const Video = styled.video`
  margin: 0 auto;
  border-radius: 4px;
`;
