import styled, { css } from 'styled-components'

export const BadgeEstimated = styled.span`
  ${({ theme, status, isBg = false }) => css`
  color: ${isBg ? `#fff` : theme[`color${status}500`]};
  background-color: ${isBg ? theme[`color${status}500`] : "transparent"};
  `}

  padding: .05rem .3rem;
  border-radius: .25rem;
  font-size: .65rem;
  font-weight: 700;
  cursor: pointer;
`
