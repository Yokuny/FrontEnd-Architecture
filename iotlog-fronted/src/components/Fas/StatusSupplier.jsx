import styled, { css } from "styled-components";
import TextSpan from "../Text/TextSpan";

const Badge = styled.div`
  display: flex;
  padding: 0.05rem 0.6rem;
  border-radius: 0.2rem;
  ${({ status, theme, intensity = 500 }) => css`
    background-color: ${theme[`color${status}${intensity}`]}10;
    color: ${theme[`color${status}${intensity}`]};
    text-transform: uppercase;
  `}
`

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ end }) => end ? "flex-end" : "center"};
`

export default function StatusSupplier(props) {

  const { status, end = false, styleText = {} } = props;

  switch (status?.toUpperCase()) {
    case "APROVADO":
      return (
        <Content end={end}>
          <Badge status="Success" intensity={700}>
            <TextSpan apparence="s3" style={styleText}>
              {status}
            </TextSpan>
          </Badge>
        </Content>
      )
      case "APROVADO COM RESSALVAS":
      return (
        <Content end={end}>
          <Badge status="Warning" intensity={700}>
            <TextSpan apparence="s3" style={styleText}>
              {status}
            </TextSpan>
          </Badge>
        </Content>
      )
      case "EM QUALIFICAÇÃO":
        return (
          <Content end={end}>
            <Badge status="Info" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                {status}
              </TextSpan>
            </Badge>
          </Content>
        )
    case "INATIVO":
      return (
        <Content end={end}>
          <Badge status="Basic" intensity={700}>
            <TextSpan apparence="s3" style={styleText}>
              {status}
            </TextSpan>
          </Badge>
        </Content>
      )
    case "SUPENSO":
      return (
        <Content end={end}>
          <Badge status="Danger" intensity={700}>
            <TextSpan apparence="s3" style={styleText}>
              {status}
            </TextSpan>
          </Badge>
        </Content>
      )
    default:
      return (
        <Content end={end}>
          <Badge status="Danger" intensity={700}>
            <TextSpan apparence="s3" style={styleText}>
              {status}
            </TextSpan>
          </Badge>
        </Content>
      )
  }
}
