import styled, { css } from "styled-components"

const BatteryContentStyled = styled.div`
  ${({ theme, percentual, status }) => css`
  min-width: 70px;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div:first-child {
    background-color: ${theme.backgroundBasicColor4};
    width: 25%;
    height: 10px;
    margin-bottom: .2rem;
    border-radius: 0.2rem;
  }

  .base-battery {
    background-color: ${theme.backgroundBasicColor4};
    border-radius: 0.3rem;
    width: 100%;
    height: 100%;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0.4rem 0.6rem;
  }

  .fill-battery {
    height: ${percentual}% !important;
    width: 100% !important;
    background-color: ${theme[status]} !important;
    z-index: 1;
    border-radius: 0.315rem !important;
  }
  `};
`

export default function BatteryContent({
  percentual = 90
}) {

  const getSize = (percentual) => {
     const total = percentual * 0.96
     return total > 96
     ? 96
     : total < 1
      ? 1
      : total
  }

  const getColorStatus = (size) => {
    if (size > 70) {
      return "colorSuccess400"
    } else if (size > 30) {
      return "colorWarning400"
    } else if (size > 10) {
      return "colorDanger500"
    } else {
      return "colorDanger600"
    }
  }

  const size = getSize(percentual)
  const colorStatus = getColorStatus(percentual)

  return (<>
    <BatteryContentStyled
      percentual={size}
      status={colorStatus}
    >
      <div></div>
      <div className="base-battery">
        <div className="fill-battery">
        </div>
      </div>
    </BatteryContentStyled>
  </>)
}
