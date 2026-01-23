import { Sidebar } from "@paljs/ui";
import styled from "styled-components";

export const FasSidebarStyled = styled(Sidebar)`
  width: 18rem;
  ${({ width = 18 }) => `min-width: ${width}em;`}

  .main-container {
    width: 18rem;
    padding-bottom: 50px;
  }
`;
