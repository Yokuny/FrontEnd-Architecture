import { Card } from "@paljs/ui/Card";
import styled, { css } from "styled-components";

export const CardNoShadow = styled(Card)`
box-shadow: none;
margin-bottom: 1rem;

${({ theme }) => css`
  border: 1px solid ${theme.borderBasicColor3};
  `}
`
