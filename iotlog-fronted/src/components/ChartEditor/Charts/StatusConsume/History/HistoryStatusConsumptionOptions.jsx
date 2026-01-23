import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { LabelIcon } from "../../../../Label";
import { setDataChart, setDisabledSave } from "../../../../../actions";
import { Vessel } from "../../../../Icons";
import { SelectMachine } from "../../../../Select";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const HistoryStatusConsumptionOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();
  const theme = useTheme();

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    props.setDisabled(false);
  };


  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon iconName="text-outline" title={`${intl.formatMessage({ id: 'title' })} *`} />
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
            title={<FormattedMessage id="vessel" />}
          />
          <div className="mt-1"></div>
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryStatusConsumptionOptions);
