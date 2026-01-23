import { Button, Card, CardBody, CardFooter, Col, EvaIcon, InputGroup, Popover, Row, Select } from "@paljs/ui";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { LabelIcon, SelectMachineEnterprise } from "../../components";
import { Vessel } from "../../components/Icons";
import { Label } from "./Label";
import { OnOff } from "./OnOff";
import { SelectSensorByMachine } from "../../components/Select";
import SelectCMMSEquipment from "../../components/Select/SelectCMMSEquipment";
import { Maintenance } from "./Maintenance";

export const Marker = ({ marker, onChange, onRemove, handleClick, isEditing }) => {
  const intl = useIntl();
  const theme = useTheme();

  const [data, setData] = useState(marker);

  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  const handleChange = (key, value) => {
    if (key === "equipment" && !data.description) {
      setData({
        ...data,
        description: value,
        [key]: value,
      });
    } else {
      setData({
        ...data,
        [key]: value,
      });
    }
  };

  const handleSave = () => {
    onChange(data);
  };

  const options = [
    {
      value: "label",
      label: intl.formatMessage({ id: "label" }),
    },
    { value: "on-off", label: "ON / OFF" },
    { value: "maintenance", label: intl.formatMessage({ id: "maintenance" }) },
  ];

  return (
    <Popover
      trigger={isEditing ? "click" : "none"}
      placement="bottom"
      overlay={
        <Card
          style={{
            width: "20rem",
            padding: "0",
            margin: "0",
          }}>
          <CardBody>
            <Col>
              <LabelIcon iconName={"text-outline"} title={intl.formatMessage({ id: "description" })} />
              <InputGroup fullWidth>
                <input
                  type="text"
                  onChange={(e) => handleChange("description", e.target.value)}
                  value={data.description}
                />
              </InputGroup>
            </Col>
            <Col className="mt-2">
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
                title={intl.formatMessage({ id: "machine" })}
              />
              <SelectMachineEnterprise
                idEnterprise={idEnterprise}
                onChange={(e) => handleChange("machine", e.value)}
                value={data.machine}
                menuPosition="relative"
                isOnlyValue
              />
            </Col>
            <Col className="mt-2">
              <LabelIcon iconName={"info-outline"} title={intl.formatMessage({ id: "type" })} />
              <Select
                options={options}
                onChange={(e) => handleChange("type", e.value)}
                value={options.find((option) => option.value === data.type)}
              />
            </Col>
            {data.type === "maintenance" ? (
              <Col className="mt-2">
                <LabelIcon iconName={"hash-outline"} title={intl.formatMessage({ id: "equipment" })} />
                <SelectCMMSEquipment
                  onChange={(e) => handleChange("equipment", e?.value)}
                  value={data.equipment}
                  menuPosition="relative"
                  isOnlyValue
                  idEnterprise={idEnterprise}
                />
              </Col>
            ) : (
              <Col className="mt-2">
                <LabelIcon iconName={"hash-outline"} title={intl.formatMessage({ id: "sensor" })} />
                <SelectSensorByMachine
                  idMachine={data?.machine}
                  onChange={(e) => handleChange("sensor", e?.value)}
                  value={data.sensor}
                  menuPosition="relative"
                  isOnlyValue
                />
              </Col>
            )}
            {data.type === "label" && (
              <Col className="mt-2">
                <LabelIcon iconName={"at-outline"} title={intl.formatMessage({ id: "unit" })} />
                <InputGroup fullWidth>
                  <input type="text" onChange={(e) => handleChange("unit", e.target.value)} value={data.unit} />
                </InputGroup>
              </Col>
            )}
          </CardBody>
          <CardFooter>
            <Row between="xs" className="pl-2 pr-2">
              <Button appearance="ghost" size="Small" status="Danger" onClick={() => onRemove(data.id)}>
                <FormattedMessage id="delete" />
              </Button>
              <Button size="Small" status="Primary" onClick={handleSave}>
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        </Card>
      }>

      {isEditing ? <>
        <EvaIcon
          status="Danger"
          name="edit-2-outline" style={{ cursor: "pointer", width: 20, height: 20 }} />
      </> : <>
        {data.type === "label" && (
          <Label handleClick={handleClick} label={data.description} state={data.state} unit={data.unit} />
        )}
        {data.type === "on-off" && (
          <OnOff handleClick={handleClick} isEditting={isEditing} label={data.description} state={!!data.state} />
        )}
        {data.type === "maintenance" && (
          <Maintenance
            handleClick={handleClick}
            isEditting={isEditing}
            label={data.description}
            state={data.state}
            useTooltip={true}
            machineId={data.machine}
            equipment={data.equipment}
          />
        )}
      </>}
    </Popover>
  );
};
