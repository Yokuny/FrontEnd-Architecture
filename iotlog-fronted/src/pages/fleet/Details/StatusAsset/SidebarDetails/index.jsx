import { Sidebar } from "@paljs/ui";
import styled from "styled-components";

export const SidebarDetailsStyled = styled(Sidebar)`
  ${({ isShowList = false, width = 30 }) => `
      width: ${isShowList ? 40 : width}rem;
`}

  position: absolute;
  top: 0;
  right: 0;
  z-index: 1010;
  border-radius: 12px;
  height: 100%;

  .main-container {
    width: 100%;
    height: calc(100vh - 80px);
  }

  .scrollable {
    padding: 0;
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    left: 0;
    z-index: 1099;
    width: 100%;

    .btn-aside-mobile-details-fleet {
      visibility: visible;
    }
  }

  @media only screen and (max-width: 768px) and (min-width: 601px) {
    position: absolute;
    right: 0;
    z-index: 1099;
    width: 50%;

    .btn-aside-mobile-details-fleet {
      visibility: visible;
    }
  }

  @media only screen and (min-width: 769px) {
    .btn-aside-mobile-details-fleet {
      visibility: hidden;
      width: 0px;
    }
  }
`;
