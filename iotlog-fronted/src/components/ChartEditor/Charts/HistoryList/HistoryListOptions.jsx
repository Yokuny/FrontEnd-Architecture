import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { LabelIcon } from "../../../Label";
import { SelectMachine } from "../../../Select";
import { Checkbox } from "@paljs/ui";
import TextSpan from "../../../Text/TextSpan";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const HistoryListOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();

  const verifyDisabled = () => {
    const allDataRequired = !!optionsData?.title;
    if (allDataRequired && props.disabled) {
      props.setDisabled(false);
    } else if (!allDataRequired && !props.disabled) {
      props.setDisabled(true);
    }
  };

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    verifyDisabled();
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="title" />}
            iconName="text-outline"
          />
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }}  className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="machine" />}
            iconName="wifi-outline"
          />
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
            placeholder={"machine"}
          />
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <LabelIcon
            title={<FormattedMessage id="multiY" />}
            iconName="bar-chart-outline"
          />
          <Checkbox
            className="mt-2"
            checked={optionsData?.multiY}
            onChange={(e) => onChange("multiY", !optionsData?.multiY)}
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="multiY" />
            </TextSpan>
          </Checkbox>
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryListOptions);
