import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { TextSpan } from "../../../components";
import { useThemeSelected } from "../../../components/Hooks/Theme";


const Badge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 0.1rem 0.6rem;
  border-radius: 0.2rem;
  ${({ status, theme, intensity = 500, isDark = false }) => css`
    ${isDark ? '' : `background-color: ${theme[`color${status}100`]};`}
    ${isDark ? `border: 1px solid ${theme[`color${status}${intensity}`]};`:''}
    color: ${theme[`color${status}${intensity}`]};
    text-transform: uppercase;
  `}
`

export const getStatusVoyageProps = ({ status }) => {
  switch (status) {
    case "created": return {
      text: "in.progress",
      color: "Warning",
      intensity: 600
    }
    case "finished": return {
      text: "order.support.closed",
      color: "Info",
      intensity: 500
    }
    case "cancelled": return {
      text: "cancelled",
      color: "Basic",
      intensity: 400
    }
    default: return {
      text: "unknown",
      color: "Basic",
      intensity: 700
    }
  }
}

export default function StatusVoyage(props) {

  const { status, styleText = {} } = props;

  const { isDark } = useThemeSelected();

  switch (status) {
    case "created":
      return (
        <Badge status="Warning" isDark={isDark} intensity={600}>
          <TextSpan apparence="s3" style={styleText}>
            <FormattedMessage id="in.progress" />
          </TextSpan>
        </Badge>
      )
    case "finished":
      return (
        <Badge status="Info" isDark={isDark} intensity={500}>
          <TextSpan apparence="s3" style={styleText}>
            <FormattedMessage id="order.support.closed" />
          </TextSpan>
        </Badge>
      )
    case "cancelled":
      return (
        <Badge status="Basic" isDark={isDark} intensity={400}>
          <TextSpan apparence="s3" style={styleText}>
            <FormattedMessage id="cancelled" />
          </TextSpan>
        </Badge>
      )
    default:
      return null
  }
}
