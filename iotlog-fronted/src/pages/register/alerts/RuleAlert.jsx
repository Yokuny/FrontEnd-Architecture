import { Button, CardBody, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  CardNoShadow,
  InputDecimal,
  LabelIcon,
  TextSpan,
} from "../../../components";
import { SelectLevel } from "../../../components/Select";
import OrCondition from "./conditions/OrCondition";

const RuleAlert = (props) => {
  const intl = useIntl();
  const {
    rule,
    onChange,
    idEnterprise,
    onAddAnd,
    onAddOr,
    onRemoveAnd,
    onRemoveOr,
    onChangeOr,
  } = props;
  return (
    <>
      <Row className="mt-4" style={{ marginBottom: -16 }}>
        {rule?.and?.map((andCondition, i) => (
          <Col breakPoint={{ md: 4 }} key={`ca-i-${i}`}>
            <CardNoShadow>
              {andCondition?.or?.map((orCondition, j) => (
                <>
                  <OrCondition
                    key={`ca-${i}-${j}`}
                    idEnterprise={idEnterprise}
                    data={orCondition}
                    onChange={(prop, value) => onChangeOr(i, j, prop, value)}
                    onRemove={() =>
                      j === 0 ? onRemoveAnd(i) : onRemoveOr(i, j)
                    }
                  />
                  {andCondition?.or.length > 1 &&
                    j < andCondition?.or.length - 1 && (
                      <Row className="mt-4 mb-3" center>
                        <TextSpan
                          apparence="s1"
                          style={{ textTransform: "uppercase" }}
                        >
                          <FormattedMessage id="condition.or" />
                        </TextSpan>
                      </Row>
                    )}
                </>
              ))}
              <Row center className="mt-3 mb-4">
                <Button
                  status="Info"
                  size="Tiny"
                  className="flex-between"
                  appearance="ghost"
                  onClick={() => onAddOr(i)}
                >
                  <EvaIcon name="plus-circle-outline" className="mr-1" />
                  <FormattedMessage id="new.condition.or" />
                </Button>
              </Row>
            </CardNoShadow>
          </Col>
        ))}
        <Col breakPoint={{ md: 2 }} className="col-flex-center pb-4">
          <Button
            status="Info"
            className="flex-between"
            appearance="ghost"
            size="Tiny"
            onClick={onAddAnd}
          >
            <EvaIcon name="plus-circle-outline" className="mr-1" />
            <FormattedMessage id="new.condition.and" />
          </Button>
        </Col>

        <Col breakPoint={{ md: 12 }} className="col-flex">
          <CardNoShadow>
            <CardBody>
              <Row className="pt-1">
                <Col
                  breakPoint={{
                    md: 12,
                  }}
                  className="mb-4"
                >
                  <LabelIcon
                    iconName="clock-outline"
                    title={`${intl.formatMessage({
                      id: "condition.how.long",
                    })} (${intl.formatMessage({ id: "optional" })})`}
                  />
                  <div className="mt-1"></div>
                  <InputGroup fullWidth className="mt-1">
                    <InputDecimal
                      sizeDecimals={0}
                      onChange={(e) => onChange("inMinutes", e)}
                      style={{
                        lineHeight: "0.5rem",
                        textTransform: "capitalize",
                      }}
                      value={rule?.inMinutes}
                      placeholder={intl.formatMessage({
                        id: "minutes",
                      })}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </CardBody>
          </CardNoShadow>
        </Col>

        <Col breakPoint={{ md: 12 }} className="col-flex">
          <CardNoShadow>
            <CardBody>
              <Row className="pt-1">
                <Col
                  breakPoint={{
                    xs: 12,
                    sm: 4,
                    md: 4,
                    lg: 2,
                  }}
                  className="mb-4"
                >
                  <LabelIcon
                    iconName="alert-circle-outline"
                    title={`${intl.formatMessage({ id: "scale.level" })} *`}
                  />
                  <div className="mt-1"></div>
                  <SelectLevel
                    value={rule?.then?.level}
                    onChange={(value) => onChange("then.level", value?.value)}
                  />
                </Col>
                <Col
                  breakPoint={{
                    xs: 12,
                    sm: 8,
                    md: 8,
                    lg: 10,
                  }}
                  className="mb-4"
                >
                  <LabelIcon
                    iconName="message-circle-outline"
                    title={`${intl.formatMessage({ id: "message" })} *`}
                  />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      onChange={(e) => onChange("then.message", e.target.value)}
                      style={{
                        lineHeight: "0.5rem",
                      }}
                      value={rule?.then?.message}
                      placeholder={intl.formatMessage({
                        id: "message",
                      })}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </CardBody>
          </CardNoShadow>
        </Col>
      </Row>
    </>
  );
};

export default RuleAlert;
