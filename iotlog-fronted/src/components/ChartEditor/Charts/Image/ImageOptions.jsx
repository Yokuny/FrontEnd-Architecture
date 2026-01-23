import React from "react";
import { useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import {
  SelectMachine,
} from "../../../Select";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const ImageOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();
  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    if (props.disabled)
      props.setDisabled(false)
  };

  return (
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
            placeholder={"machine"}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <InputGroup fullWidth>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageOptions);
