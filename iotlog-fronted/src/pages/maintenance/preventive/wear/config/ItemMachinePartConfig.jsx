import { Button, Col, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { withTheme } from "styled-components";
import {
  SelectTypeServiceMaintenance,
  TextSpan,
} from "../../../../../components";
import { UNITY_LIFECYCLE } from "../../../../../constants";

const ItemMachinePartConfig = (props) => {
  const { data, intl, index, onChangeItem } = props;

  const onAddAction = () => {
    if (data?.actions?.length) {
      onChangeItem("actions", [...data?.actions, {}]);
      return;
    }
    onChangeItem("actions", [{}]);
  };

  const onChangeSubItem = (index, prop, value) => {
    const actionUpdate = data?.actions[index] || {};
    actionUpdate[prop] = value;

    onChangeItem("actions", [
      ...data?.actions?.slice(0, index),
      actionUpdate,
      ...data?.actions?.slice(index + 1),
    ]);
  };

  const optionsTranslate = UNITY_LIFECYCLE.map((y) => ({
    value: y.value,
    label: intl.formatMessage({ id: y.label }),
  }));

  return (
    <>
      <Row className={index > 0 ? "mt-5" : ""}>
        <Col breakPoint={{ md: 9 }} className="mb-2">
          <TextSpan apparence="s2">
            <FormattedMessage id="part" />
          </TextSpan>
          <div className="mt-1"></div>
          <InputGroup fullWidth>
            <input
              type="text"
              value={`${data?.part?.name} (${data?.part?.sku})`}
              readOnly
            />
          </InputGroup>
        </Col>

        <Col breakPoint={{ md: 3 }} className="mb-2">
          <TextSpan apparence="s2">
            <FormattedMessage id="proportional.percentual.wear" /> (%)
          </TextSpan>
          <div className="mt-1"></div>
          <InputGroup fullWidth>
            <input
              type="number"
              placeholder={intl.formatMessage({
                id: "proportional",
              })}
              min={0}
              value={data?.proportional}
              onChange={(e) => onChangeItem("proportional", e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {data?.actions?.map((action, i) => (
        <Row key={`${index}-${i}`} className="ml-2 mb-2">
          <Col breakPoint={{ md: 5 }}>
            {/* <TextSpan apparence="s2">
              <FormattedMessage id="action" />
            </TextSpan>
            <div className="mt-1"></div> */}

            <SelectTypeServiceMaintenance
              onChange={(value) => onChangeSubItem(i, "typeService", value)}
              value={action?.typeService}
            />
          </Col>
          <Col breakPoint={{ md: 2 }}>
            {/* <TextSpan apparence="s2">
              <FormattedMessage id="time.cycle" />
            </TextSpan>
            <div className="mt-1"></div> */}
            <InputGroup fullWidth>
              <input
                type="number"
                placeholder={intl.formatMessage({ id: "time.cycle" })}
                onChange={(e) =>
                  onChangeSubItem(i, "valueCycle", parseInt(e.target.value))
                }
                value={action?.valueCycle}
                min={0}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 2 }}>
            {/* <TextSpan apparence="s2">
              <FormattedMessage id="unity.cycle" />
            </TextSpan>
            <div className="mt-1"></div> */}
            <Select
              options={optionsTranslate}
              placeholder={intl.formatMessage({ id: "unity.cycle" })}
              onChange={(value) =>
                onChangeSubItem(i, "unityCycle", value?.value)
              }
              value={
                action?.unityCycle
                  ? optionsTranslate.find((y) => y.value == action?.unityCycle)
                  : null
              }
              noOptionsMessage={() =>
                intl.formatMessage({ id: "nooptions.message" })
              }
              menuPosition="fixed"
            />
          </Col>
          <Col breakPoint={{ md: 2 }}>
            {/* <TextSpan apparence="s2">
              <FormattedMessage id="warn.alert.in" />
            </TextSpan>
            <div className="mt-1"></div> */}
            <InputGroup
              fullWidth
              status={
                action?.valueCycle && action?.warnBefore > action?.valueCycle
                  ? "Danger"
                  : "Basic"
              }
            >
              <input
                type="number"
                placeholder={intl.formatMessage({
                  id: "warn.alert.in",
                })}
                min={0}
                max={action?.valueCycle || null}
                value={action?.warnBefore}
                onChange={(e) =>
                  onChangeSubItem(i, "warnBefore", parseInt(e.target.value))
                }
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 1 }}>
            <Button
              status="Danger"
              size="Tiny"
              onClick={() => {
                onChangeItem(
                  "actions",
                  data?.actions?.filter((x, j) => j != i)
                );
              }}
            >
              <EvaIcon name="trash-2-outline" />
            </Button>
          </Col>
        </Row>
      ))}
      <Button
        size="Tiny"
        status="Info"
        className={`ml-4 mb-4 flex-between ${
          !!data?.actions?.length ? "mt-2" : ""
        }`}
        onClick={onAddAction}
      >
        <FormattedMessage id="add.action" />
      </Button>
    </>
  );
};

export default injectIntl(ItemMachinePartConfig);
