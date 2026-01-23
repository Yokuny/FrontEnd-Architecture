import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { TextSpan } from "../../../components";

export const isInStatus = (value) => {
  return [
    "fas.closed",
    "not.approved",
    "awaiting.create.confirm",
    "bms.refused",
    "awaiting.request",
    "supplier.canceled",
    "awaiting.collaborators",
    "awaiting.bms.confirm",
    "awaiting.contract.validation",
    "awaiting.sap",
    "awaiting.buy.request",
    "awaiting.bms",
    "awaiting.payment",
    "awaiting.invoice",
    "invoice.rejected",
    "awaiting.rating",
    "not.realized",
    "cancelled",
    "true",
    "false"
  ].includes(value);
}

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
export const STATUS_COLORS = {
  "fas-closed": "#cccccc",
  "cancelled": "#aaaaaa",
  "not-approved": "#cccccc",
  "awaiting-create-confirm": "#ff9800",
  "awaiting-request": "#2e7d32",
  "supplier-canceled": "#c62828",
  "awaiting-collaborators": "#ef5350",
  "awaiting-bms-confirm": "#c62828",
  "awaiting-contract-validation": "#c62828",
  "awaiting-rating": "#c62828",
  "awaiting-buy-request": "#c62828",
  "awaiting-sap": "#c62828",
  "awaiting-bms": "#e65100",
  "bms-refused": "#e65100",
  "invoice-rejected": "#e65100",
  "not-realized": "#e65100",
  "awaiting-payment": "#2e7d32",
  "awaiting-invoice": "#0288d1",
  "false": "#008000",
  "true": "#ff0000"
};

export default function StatusFas(props) {

  const { status, end = false, styleText = {} } = props;

    switch (status) {
      case "fas.closed":
        return (
          <Content end={end}>
            <Badge status="Basic" intensity={600}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="fas.closed" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "cancelled":
        return (
          <Content end={end}>
            <Badge status="Basic" intensity={500}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="cancelled" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "not.approved":
        return (
          <Content end={end}>
            <Badge status="Basic" intensity={600}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="not.approved" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.create.confirm":
        return (
          <Content end={end}>
            <Badge status="Warning" intensity={500}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.create.confirm" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.request":
        return (
          <Content end={end}>
            <Badge status="Primary">
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.request" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "supplier.canceled":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="supplier.canceled" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.collaborators":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={500}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.collaborators" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.bms.confirm":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.bms.confirm" />
              </TextSpan>
            </Badge>
          </Content>
        )

      case "awaiting.contract.validation":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.contract.validation" />
              </TextSpan>
            </Badge>
          </Content>
        )

      case "awaiting.rating":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.rating" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.buy.request":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.buy.request" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.sap":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.sap" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.bms":
        return (
          <Content end={end}>
            <Badge status="Warning" intensity={600}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.bms" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "bms.refused":
        return (
          <Content end={end}>
            <Badge status="Warning" intensity={600}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="bms.refused" />
              </TextSpan>
            </Badge>
          </Content>
        )

      case "invoice.rejected":
        return (
          <Content end={end}>
            <Badge status="Warning" intensity={600}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="invoice.rejected" />
              </TextSpan>
            </Badge>
          </Content>
        )

      case "not.realized":
        return (
          <Content end={end}>
            <Badge status="Warning" intensity={600}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="not.realized" />
              </TextSpan>
            </Badge>
          </Content>
        )

      case "awaiting.payment":
        return (
          <Content end={end}>
            <Badge status="Success" intensity={500}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.payment" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "awaiting.invoice":
        return (
          <Content end={end}>
            <Badge status="Info" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="awaiting.invoice" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "false":
        return (
          <Content end={end}>
            <Badge status="Success" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="valid" />
              </TextSpan>
            </Badge>
          </Content>
        )
      case "true":
        return (
          <Content end={end}>
            <Badge status="Danger" intensity={700}>
              <TextSpan apparence="s3" style={styleText}>
                <FormattedMessage id="invalid" />
              </TextSpan>
            </Badge>
          </Content>
        )
      default:
        return null
    }
  }
