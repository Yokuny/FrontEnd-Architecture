import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../../Select";
import TextSpan from "../../../../Text/TextSpan";
import Select from "@paljs/ui/Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../../actions";
import styled from "styled-components";
import { TYPE_VALUE } from "./constants";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const NumericOptions = (props) => {
  const { intl, optionsData } = props;

  const optionsDescription = [
    {
      value: "text",
      label: intl.formatMessage({ id: "fixed.text" }),
    },
    {
      value: "integration",
      label: intl.formatMessage({ id: "field.integration" }),
    },
  ];

  const optionsValueSearch = [
    {
      value: TYPE_VALUE.VALUE,
      label: intl.formatMessage({ id: "current.value" }),
    },
    {
      value: TYPE_VALUE.COUNT,
      label: intl.formatMessage({ id: "count" }),
    },
    {
      value: TYPE_VALUE.SUM,
      label: intl.formatMessage({ id: "sum" }),
    },
  ];

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });

    const allDataRequired =
      !!optionsData?.sensor?.value &&
      !!optionsData?.machine?.value &&
      !!optionsData?.title;
    if (allDataRequired && props.disabled) {
      props.setDisabled(false);
    } else if (!allDataRequired && !props.disabled) {
      props.setDisabled(true);
    }
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="title" /> *
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="machine" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <Row>
            <Col breakPoint={{ md: 6 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="type.description" />
              </TextSpan>
              <Select
                className="mt-1"
                isClearable
                options={optionsDescription}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "type.description" })}
                onChange={(value) => onChange("optionDescription", value)}
                value={optionsData?.optionDescription}
              />
            </Col>
            {!!optionsData?.optionDescription?.value && (
              <Col breakPoint={{ md: 6 }}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="description" />
                </TextSpan>
                <InputGroup fullWidth className="mt-1">
                  <input
                    placeholder={intl.formatMessage({
                      id:
                        optionsData?.optionDescription?.value == "text"
                          ? "text.placeholder"
                          : "field.integration.placeholder",
                    })}
                    type="text"
                    onChange={(e) => onChange("description", e.target.value)}
                    value={optionsData?.description}
                  />
                </InputGroup>
                {optionsData?.optionDescription?.value == "integration" && (
                  <TextSpan apparence="c1">
                    <FormattedMessage id="field.integration.observation" />
                  </TextSpan>
                )}
              </Col>
            )}
          </Row>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="size.decimals" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              placeholder={intl.formatMessage({
                id: "size.decimals",
              })}
              type="number"
              min={0}
              onChange={(e) =>
                onChange("sizeDecimal", parseInt(e.target.value))
              }
              value={optionsData?.sizeDecimal}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="type.value" />
          </TextSpan>
          <Select
            className="mt-1"
            isClearable
            options={optionsValueSearch}
            menuPosition="fixed"
            placeholder={intl.formatMessage({ id: "type.value" })}
            onChange={(value) => onChange("typeValue", value)}
            value={optionsData?.typeValue}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="link.open.chart" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.link}
              onChange={(e) => onChange("link", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({
                id: "link.open.chart",
              })}
            />
          </InputGroup>
        </Col>
      </ContainerRow>
    </>
  );
};

const mapStateToProps = (state) => ({
  disabled: state.dashboard.disabledButtonSave,
  optionsData: state.dashboard.data,
});

const mapDispatchToProps = (dispatch) => ({
  setDisabled: (disabled) => {
    dispatch(setDisabledSave(disabled));
  },
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
});

const NumericOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(NumericOptions);

export default injectIntl(NumericOptionsRedux);
