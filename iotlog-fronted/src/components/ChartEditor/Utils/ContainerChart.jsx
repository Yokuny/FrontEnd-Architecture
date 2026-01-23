import styled, { css } from "styled-components";

export const ContentChart = styled.div`
  ${({ theme, noBorder = false, onClick = undefined, noShowMarker }) => css`
  ${!noBorder && `border: 1px solid ${theme.borderBasicColor3};`}
  border-radius: 0.225rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;

  .react-resizable-handle-se {
    ${noShowMarker && `display: none;`}
  }

  cursor: ${onClick ? "pointer" : "default"};
`}
`;

export const ContainerChart = styled.div`
  ${({ height, width }) => `
  min-width: ${width}px;
  min-height: ${height}px;
  max-width: ${width}px;
  max-height: ${height}px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
`}
`;

export const ContainerChartThemed = styled.div`
  ${({ theme, between }) => css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: ${between ? "space-between" : "center"};
    align-items: center;
    text-align: center;

    .apexcharts-menu {
      background: ${theme.backgroundBasicColor1} !important;
    }

    .apexcharts-menu-item {
      font-family: ${theme.fontFamilyPrimary};
      font-weigth: 400;
    }

    .apexcharts-theme-light .apexcharts-menu-item:hover {
      background: ${theme.colorBasicHover} !important;
      color: ${theme.textPrimaryColor} !important;
    }
  `}
`;

export const ChartWrapper = styled.div`
  ${({ theme, height, width }) => css`
    height: ${height || "100%"};
    width: ${width || "100%"};
  `}
`;

export const ContentChartWrapped = ({ children, noShadow = false, noBorder = false, className = "" }) => {
  return (
    <>
      <ContentChart className={noShadow ? "" : ""} noBorder={noBorder}>
        <ChartWrapper className="p-4">{children}</ChartWrapper>
      </ContentChart>
    </>
  );
};
