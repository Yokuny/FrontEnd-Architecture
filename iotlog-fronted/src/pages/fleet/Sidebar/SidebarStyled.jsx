import { Sidebar } from "@paljs/ui";
import styled, { css } from "styled-components";

export const SidebarStyled = styled(Sidebar)`
  min-width: 23em;

  border-radius: 12px;
  ${({ theme}) => css`
    background-color: ${theme.backgroundBasicColor1}ee;
    border: 1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3};

    div {
      background-color: transparent;
    }
  `}

  .main-container {
    width: 100%;
    height: calc(100vh - 80px);
  }

  .scrollable {
    padding: 0;
  }

  .scrollable::-webkit-scrollbar {
    width: 0.515rem;
  }

  &.hidden-content {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    position: absolute;
    left: 0;
    z-index: 1099;
    width: 50%;

    .btn-aside-mobile {
      visibility: visible;
    }
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    left: 0;
    z-index: 1099;
    width: 100%;

    .btn-aside-mobile {
      visibility: visible;
    }
  }

  @media only screen and (min-width: 769px) {
    .btn-aside-mobile {
      visibility: hidden;
      width: 0px;
      height: 0px;
    }
  }
`;
