import styled, { css } from "styled-components";
import TextSpan from '../../../../../components/Text/TextSpan';

export const Container = styled.div`
  position: absolute;
  right: 8px;
  bottom: 240px;
  z-index: 1020;
  display: flex;
  align-items: end;
`;

export const DivContent = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
  bottom: 120px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 4px;

  i {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    border-radius: 0.2rem;
  }
`;

export const InputColor = styled.input`
  width: 1.8rem;
  height: 1.8rem;
  margin: -3px;
  margin-right: 0.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch {
    border-radius: 0.2rem;
    border: none;
  }

  &::-moz-color-swatch {
    border-radius: 0.2rem;
    border: none;
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ColStyled = styled.div`
   display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
export const RowSpaceBetween = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1.5px;
  margin-bottom: 1.5px;
  align-items: center;
`;

export const ContentDiv = styled.div`
  ${({ theme, x, y }) => css`
    background: ${theme.backgroundBasicColor1};
    padding: 1rem 2rem;
    position: absolute;
    z-index: 999;
    top: ${y + 20}px;
    left: ${x + 20}px;
    border-radius: 4px;
  `}
`;

export const ClickableTextSpan = styled(TextSpan)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
