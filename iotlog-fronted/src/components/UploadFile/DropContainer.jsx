import React from "react";
import styled, { css } from "styled-components";

export const DropContainer = styled.div`
  ${({ theme }) => css`
    .dropzone {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-width: 2px;
      border-radius: 2px;
      border-color: ${theme.borderBasicColor4};
      border-style: dashed;
      background-color: ${theme.backgroundBasicColor2};
      color: ${theme.textHintColor};
      outline: none;
      transition: border 0.24s ease-in-out;
    }

    .dropzone:focus {
      border-color: #2196f3;
    }

    .drop-image {
      justify-content: center;
      border-radius: 12px;
    }
  `}
`;
