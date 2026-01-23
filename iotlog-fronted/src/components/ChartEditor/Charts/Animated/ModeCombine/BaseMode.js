import styled from "styled-components";

export const IconCircle = styled.div`
  ${({ backgroundColor, height, width }) => `
    width: ${width}px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${height}px;
    border-radius: 50px;
    text-align: center;
    background-color: ${backgroundColor};
  `}

  .manual-color {
    color: #913711;
    background-color: #fef1d7;
  }
`;

export const ContainerAnimated = styled.div`
  ${({ height, width }) => `
  width: 90%;
  display: flex;

  -webkit-animation: slide-right 3.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    infinite alternate both;
  animation: slide-right 3.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite
    alternate both;

  @-webkit-keyframes slide-right {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(${width});
      transform: translateX(${width});
    }
  }
  @keyframes slide-right {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(${width});
      transform: translateX(${width});
    }
  }
  `}
`;
