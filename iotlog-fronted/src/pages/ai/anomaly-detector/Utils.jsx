import styled from "styled-components"
import { TextSpan } from "../../../components"
import { FormattedMessage } from "react-intl"

const StatusAnomaly = styled.div`
    display: flex;
    align-items: center;
    margin-left: 0.9rem;
`

export const DivCircle = styled.div`
  border-radius: 50%;
  width: 15px;
  height: 15px;
`

export const getStatusColor = (status, theme) => {
  switch (status) {
    case 'ok':
      return theme.colorSuccess700
    case 'warning':
      return theme.colorWarning500
    case 'anomaly':
      return theme.colorDanger500
    default:
      return theme.colorBasic600
  }
}

export const getStatus = (status, theme) => {
  switch (status) {
    case 'ok':
      return <StatusAnomaly>
        <DivCircle
          style={{ backgroundColor: theme.colorSuccess700 }}
        />
        <TextSpan
          className="ml-2"
          style={{
            color: theme.colorSuccess700,
            fontWeight: '500',
            fontSize: '0.85rem'
          }}>
          Ok
        </TextSpan>
      </StatusAnomaly>
    case 'warning':
      return <StatusAnomaly>
        <DivCircle
          style={{ backgroundColor: theme.colorWarning500 }}
        />
        <TextSpan
          className="ml-2"
          style={{
            color: theme.colorWarning500,
            fontWeight: '500',
            fontSize: '0.85rem'
          }}>
          <FormattedMessage id="warn" />
        </TextSpan>
      </StatusAnomaly>
    case 'anomaly':
      return <StatusAnomaly>
        <DivCircle
          style={{ backgroundColor: theme.colorDanger500 }}
        />
        <TextSpan
          className="ml-2"
          style={{
            color: theme.colorDanger500,
            fontWeight: '500',
            fontSize: '0.85rem'
          }}>
          <FormattedMessage id="anamoly.detected" />
        </TextSpan>
      </StatusAnomaly>
    default:
      return <StatusAnomaly>
        <DivCircle
          style={{ backgroundColor: theme.colorBasic600 }}
        />
        <TextSpan
          className="ml-2"
          style={{
            color: theme.colorBasic600,
            fontWeight: '400',
            fontSize: '0.78rem'
          }}>
          Off-line
        </TextSpan>
      </StatusAnomaly>
  }
}
