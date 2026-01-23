import styled, { css } from "styled-components";

export const IconRounded = styled.div`
  ${({ theme, colorTextTheme = "", color = "" }) => css`
    ${colorTextTheme && `background-color: ${theme[colorTextTheme]};`}
    ${color && `background-color: ${color};`}
    padding: 8px;
    padding-bottom: 13px;
    padding-right: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  `}
`;

export const IconBorder = styled.div`
  ${({ theme, colorTextTheme = "", color = "", borderColor = "" }) => css`
    ${colorTextTheme && `background-color: ${theme[colorTextTheme]};`}
    ${color && `background-color: ${color} !important;`}
    ${borderColor && `border: 1px solid ${borderColor};`}
    padding: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  `}
`;
