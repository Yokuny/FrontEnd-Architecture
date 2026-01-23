import React from "react";
import { useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import styled from "styled-components";
import { LabelIcon } from "../../../../Label";
import { setDataChart, setDisabledSave } from "../../../../../actions";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const EngineConsumeDetailOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();

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

export default connect(mapStateToProps, mapDispatchToProps)(EngineConsumeDetailOptions);
