import styled from "styled-components"
import BatteryContent from "./BatteryContent"
import TextSpan from "../../../Text/TextSpan"

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  height: 60%;
`

const ColData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export default function CardData({
  percentual,
  modeState
}) {

  const getStatus = (modeState) => {
    switch (modeState) {
      case 1:
        return 'Charge'
      case 2:
        return 'Discharge'
      case 4:
        return 'Maintain'
      default:
        return ''
    }
  }

  const status = getStatus(modeState)

  return (<>
    <Row>
      <BatteryContent percentual={percentual} />
      <Col>
        <ColData className="mt-1">
          <TextSpan apparence="h5">
            {percentual}%
          </TextSpan>
          <TextSpan apparence="p2" hint style={{ marginLeft: '0.07rem' }}>
            available
          </TextSpan>
        </ColData>

        {!!status && <ColData>
          <TextSpan apparence="s2">
            {status}
          </TextSpan>
          <TextSpan apparence="p2" hint style={{ marginTop: -4, marginLeft: '0.07rem' }}>
            state
          </TextSpan>
        </ColData>}
      </Col>
    </Row>
  </>)
}
