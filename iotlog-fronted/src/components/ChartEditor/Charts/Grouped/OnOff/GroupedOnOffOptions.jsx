import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../../actions";
import { Button, EvaIcon } from "@paljs/ui";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../../Select";
import { ContainerRow } from "../../../../Inputs";
import { LabelIcon } from "../../../../Label";

const GroupedOnOffOptions = (props) => {
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

  const onChangeItem = (index, prop, value) => {
    let machine = props.optionsData.machines[index];

    machine[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      machines: [
        ...props.optionsData.machines.slice(0, index),
        machine,
        ...props.optionsData.machines.slice(index + 1),
      ],
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
          <InputGroup fullWidth>
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }}>

          {optionsData?.machines?.map((machineItem, i) => {
            return (
              <Row key={i} className="pl-3 pr-3 mb-4">
                <Col breakPoint={{ md: 11 }}>
                  <Row>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="description" />}
                        iconName="message-circle-outline"
                      />
                      <InputGroup fullWidth>
                        <input
                          value={machineItem?.description}
                          onChange={(e) =>
                            onChangeItem(i, "description", e.target.value)
                          }
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "description",
                          })}
                        />
                      </InputGroup>
                    </Col>
                    <Col
                      breakPoint={{ md: 4 }}
                      className="mb-2"
                      id={`machine_${i}`}
                    >
                      <LabelIcon
                        title={<FormattedMessage id="machine" />}
                        iconName="wifi-outline"
                      />
                      <SelectMachine
                        value={machineItem?.machine}
                        onChange={(value) => onChangeItem(i, "machine", value)}
                        placeholder={"machine"}
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="sensor" />}
                        iconName="flash-outline"
                      />
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={machineItem?.machine?.value}
                        value={machineItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-2">
                      <LabelIcon
                        title={"Link"}
                        iconName="link-2-outline"
                      />
                      <InputGroup fullWidth>
                        <input
                          value={machineItem?.link}
                          onChange={(e) =>
                            onChangeItem(i, "link", e.target.value)
                          }
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "link.open.chart",
                          })}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col breakPoint={{ md: 1 }} className="col-flex-center">
                  <Button
                    status="Danger"
                    size="Tiny"
                    appearance="ghost"
                    onClick={() => {
                      onChange(
                        "machines",
                        optionsData?.machines.filter((x, j) => j != i)
                      );
                    }}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            );
          })}

          <Button
            size="Tiny"
            status="Info"
            className="mb-4 ml-3 flex-between"
            onClick={() => {
              if (optionsData?.machines?.length) {
                onChange("machines", [...optionsData?.machines, {}]);
                return;
              }
              onChange("machines", [{}]);
            }}
          >
            <EvaIcon name="wifi-outline" className="mr-1" />
            <FormattedMessage id="add.machine" />
          </Button>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupedOnOffOptions);
