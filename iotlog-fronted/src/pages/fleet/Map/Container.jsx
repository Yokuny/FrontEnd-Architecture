import styled, { css } from "styled-components";

export const Container = styled.div`
width: 100%;
height: 100%;

.leaflet-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol" !important;
}

.leaflet-control-scale-line:not(:first-child) {
  border-top: none !important;
  margin-top: 3px;
  border-bottom: 2px solid #2272b3;
}

.leaflet-control-scale-line {
  border-left: 2px solid #2272b3;
  border-bottom: 2px solid #2272b3;
  border-right: 2px solid #2272b3;
  color: rgb(34, 43, 69);
}

.leaflet-control-scale {
  display: flex;
  flex-direction: column;
  align-items: end;
  bottom: 70px;
}

.leaflet-interactive:focus {
  outline: none;
}

.polyline-measure-tooltip {
  background-color: #fff !important;
  ${({ theme }) => css`
  color: ${theme.colorTextBasic} !important;
    font-size: 0.7rem !important;
   font-family: ${theme.fontFamilyPrimary} !important;
  `}

  padding: 0.4rem;
  margin-top: 0.2rem;
}

.polyline-measure-tooltip-difference {
  margin-top: 0.4rem;
  margin-bottom: 0.3rem;
  font-size: 0.65rem !important;
  ${({ theme }) => css`
    color: ${theme.colorPrimary500} !important;
   font-family: ${theme.fontFamilyPrimary} !important;
  `}
}

.polyline-measure-tooltip-total {
  ${({ theme }) => css`
  color: ${theme.colorTextBasic} !important;
    font-size: 0.8rem !important;
   font-family: ${theme.fontFamilyPrimary} !important;
  `}
  margin-bottom: 0.1rem;
}

.leaflet-popup-content-wrapper, .leaflet-popup-tip {
  box-shadow: none !important;

  //background: transparent !important;
}

.leaflet-popup-close-button {
  display: none !important;
}
`;
