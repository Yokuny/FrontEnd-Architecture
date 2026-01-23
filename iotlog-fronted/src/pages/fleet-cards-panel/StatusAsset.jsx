import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { useThemeSelected } from "../../components/Hooks/Theme";
import { TextSpan } from "../../components";


const Badge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 0.001rem 0.4rem;
  border-radius: 0.2rem;
  ${({ status, theme, intensity = 500, isDark = false }) => css`
    ${isDark ? '' : `background-color: ${theme[`color${status}100`]};`}
    ${isDark ? `border: 1px solid ${theme[`color${status}${intensity}`]};` : ''}
    color: ${theme[`color${status}${intensity}`]};
    text-transform: uppercase;
  `}
`

export default function StatusAsset(props) {

  const { engines, styleText = {} } = props;

  const { isDark } = useThemeSelected();

  if (engines?.every(x => x.isRunning)) {
    return (
      <Badge status="Info" isDark={isDark} intensity={600}>
        <TextSpan apparence="s3" style={styleText}>
          <FormattedMessage id="operating" />
        </TextSpan>
      </Badge>
    )
  }

  if (engines?.find(x => x.isRunning)) {
    return (
      <Badge status="Primary" isDark={isDark} intensity={600}>
        <TextSpan apparence="s3" style={styleText}>
          1 MCP ON
        </TextSpan>
      </Badge>
    )
  }

  return <Badge status="Warning" isDark={isDark} intensity={600}>
    <TextSpan apparence="s3" style={styleText}>
      <FormattedMessage id="stopped" />
    </TextSpan>
  </Badge>
}
