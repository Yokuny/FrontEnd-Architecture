import React from "react";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";
import { TextSpan, ItemRow } from "../../../../components";
import { isEmpty } from "../../services";
import styled from "styled-components";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import Badge from "@paljs/ui/Badge";
import moment from "moment";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  word-break: break-word;
`;

const ItemScaleOrder = (props) => {
  const { scale, intl } = props;

  const joinResponsibles = () => {
    if (isEmail()) {
      return scale.email.to.join('; ');
    }

    if (isPush()) {
      return scale.users.map((x) => { return x.name }).join('; ');
    }
  }

  const returnBadge = (color, message) => {
    return <Badge
      style={{
        backgroundColor: color,
        position: "relative",
      }}
    >
      <FormattedMessage id={message} />
    </Badge>
  }

  const isSend = () => {
    return (isEmail() && scale.email.send) || (isPush() && scale.push.send);
  }

  const isEmail = () => {
    return !isEmpty(scale.email);
  }

  const isPush = () => {
    return !isEmpty(scale.push);
  }

  const isAttendance = () => {
    return scale.sla.attendance;
  }

  return (
    <>
      <ItemRow
        colorTextTheme={"colorPrimary600"}
      >
        <Col breakPoint={{ md: 12 }}>
          <Row>
            <ColFlex breakPoint={{ md: 2, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="send.scale.date" />
              </TextSpan>
              <TextSpan apparence="s1">{moment(scale.createAt).format(
                intl.formatMessage({ id: "format.datetime" })
              )}</TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 3, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="description" />
              </TextSpan>
              <TextSpan apparence="s1">{scale.scale.description}</TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 2, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="scale.level" />
              </TextSpan>
              <TextSpan apparence="s1">{scale.level}</TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 2, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="scale.alert.type" />
              </TextSpan>
              <TextSpan apparence="s1">{scale.alertType.description}</TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 1, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="send.scale.status" />
              </TextSpan>
              { isSend() ?
                returnBadge("#6DD332", "send.scale.true")
                :
                returnBadge("#FFB649", "send.scale.false")
              }
            </ColFlex>
            <ColFlex breakPoint={{ md: 2, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="send.scale.sla" />
              </TextSpan>
              { isAttendance() ?
                returnBadge("#Warning", "sla.attendance")
                :
                returnBadge("#Primary", "sla.solution")
              }
            </ColFlex>
          </Row>
          <Row>
            <ColFlex breakPoint={{ md: 12, sm: 12 }} className="mb-2">
              <TextSpan apparence="p2">
                <FormattedMessage id="send.scale.to" />
              </TextSpan>
              <TextSpan apparence="s1">{joinResponsibles()}</TextSpan>
            </ColFlex>
          </Row>
        </Col>
      </ItemRow>
    </>
  );
};

export default injectIntl(ItemScaleOrder);
