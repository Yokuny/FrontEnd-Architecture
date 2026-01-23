import React from "react";
import { Checkbox, Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { TYPE_GEOFENCE } from "./Constants";
import { LabelIcon, SelectEnterprise, TextSpan } from "../../../components";
import { SelectFence, SelectFenceType } from "../../../components/Select";
import { Polygon as PolygonIcon } from "../../../components/Icons";
import { ContainerColor, InputColorControl } from "../../../components/Inputs";

export default function FieldsFence(props) {
  const [data, setData] = React.useState({ color: "#3366FF" });

  React.useEffect(() => {
    if (props.dataInitial) {
      setData(props.dataInitial);
    }
  }, [props.dataInitial]);

  const { onChangeRef, idGeofence } = props;

  const onChange = (prop, value) => {
    if (prop === "type") {
      setData((prevState) => ({
        ...prevState,
        type: value,
        color: value?.color,
      }));
      onChangeRef(prop, value);
      onChangeRef("color", value?.color);

      if (value?.value !== TYPE_GEOFENCE.PORT) {
        setData((prevState) => ({
          ...prevState,
          nearestPort: false,
        }));
        onChangeRef("nearestPort", false);
      }

      return;
    }

    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
    onChangeRef(prop, value);
  };

  const intl = useIntl();
  const theme = useTheme();

  const timeZones = [
    -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
  ];

  const optionsTimeZones = timeZones.map((offset) => ({
    value: offset,
    label: `GMT ${offset >= 0 ? "+" : ""}${offset}`,
  }));

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            iconName="home-outline"
            title={`${intl.formatMessage({ id: "enterprise" })} *`}
          />
          <SelectEnterprise
            onChange={(value) => onChange("enterprise", value)}
            value={data?.enterprise}
            oneBlocked
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            iconName={"flag-outline"}
            title={`${intl.formatMessage({ id: "type" })} *`}
          />
          <SelectFenceType
            onChange={(value) => onChange("type", value)}
            value={data?.type}
            placeholder={intl.formatMessage({
              id: "type",
            })}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            iconName="text-outline"
            title={`${intl.formatMessage({ id: "description" })} *`}
          />

          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "description",
              })}
              onChange={(text) => onChange("description", text.target.value)}
              value={data?.description}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="code" />}
            iconName="hash-outline"
          />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "code",
              })}
              onChange={(text) => onChange("code", text.target.value)}
              value={data?.code}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 5 }} className="mb-4">
          <LabelIcon title={"Timezone"} iconName="globe-outline" />
          <Select
            options={optionsTimeZones}
            placeholder="Time"
            onChange={(target) => onChange("timezone", target?.value)}
            value={
              optionsTimeZones?.find((x) => x.value === data?.timezone) || null
            }
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="color" />}
            iconName="color-palette-outline"
          />
          <ContainerColor>
            <InputColorControl
              defaultValue="#3366FF"
              onChange={(value) => onChange("color", value)}
              value={data?.color}
            />
          </ContainerColor>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="city" />}
            iconName="pin-outline"
          />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "city.label",
              })}
              onChange={(text) => onChange("city", text.target.value)}
              value={data?.city}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="state.label" />}
            iconName="map-outline"
          />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "state.label",
              })}
              onChange={(text) => onChange("state", text.target.value)}
              value={data?.state}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="country.label" />}
            iconName="map-outline"
          />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "country.label",
              })}
              onChange={(text) => onChange("country", text.target.value)}
              value={data?.country}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            renderIcon={() => (
              <PolygonIcon
                style={{
                  height: 13,
                  width: 13,
                  fill: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
            title={<FormattedMessage id="geofence.mother" />}
          />
          <SelectFence
            value={data?.fenceReference}
            onChange={(e) => onChange("fenceReference", e)}
            placeholder="geofences"
            idEnterprise={data?.enterprise?.value}
            notId={[idGeofence]}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="link.label" />}
            iconName="link-outline"
          />
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "link.label",
              })}
              onChange={(text) => onChange("link", text.target.value)}
              value={data?.link}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <Checkbox
            checked={data?.initializeTravel}
            onChange={(e) =>
              onChange("initializeTravel", !data?.initializeTravel)
            }
          >
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="initialize.travel" />
            </TextSpan>
          </Checkbox>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <Checkbox
            checked={data?.finalizeTravel}
            onChange={(e) => onChange("finalizeTravel", !data?.finalizeTravel)}
          >
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="finalize.travel" />
            </TextSpan>
          </Checkbox>
        </Col>
        {data?.type?.value === TYPE_GEOFENCE.PORT && (
          <Col breakPoint={{ md: 12 }} className="mb-4">
            <Checkbox
              checked={data?.nearestPort}
              onChange={(e) => onChange("nearestPort", !data?.nearestPort)}
            >
              <TextSpan apparence="s2" hint>
                <FormattedMessage id="nearest.port" />
              </TextSpan>
            </Checkbox>
          </Col>
        )}
        {/* {data?.finalizeTravel && (
                  <Col breakPoint={{ md: 12 }} className="ml-2 mr-2">
                    {data?.finalizeTravelConditions?.map(
                      (finalizeTravelCondition, i) => (
                        <Row key={`${i}-finalize-travel`} className="mb-4">
                          <Col breakPoint={{ md: 11 }}>
                            <Row>
                              <Col breakPoint={{ md: 6 }} className="mb-2">
                                <TextSpan apparence="s2">
                                  <FormattedMessage id="sensor" />
                                </TextSpan>
                                <SelectSensorByEnterprise
                                  className="mt-1"
                                  onChange={(value) =>
                                    onChangeTravelConditionItem(
                                      i,
                                      "sensor",
                                      value
                                    )
                                  }
                                  value={finalizeTravelCondition?.sensor}
                                  idEnterprise={data?.enterprise?.value}
                                />
                              </Col>
                              <Col breakPoint={{ md: 6 }} className="mb-2">
                                <TextSpan apparence="s2">
                                  <FormattedMessage id="condition" />
                                </TextSpan>
                                <SelectCondition
                                  className="mt-1"
                                  placeholderID="condition"
                                  onChange={(value) =>
                                    onChangeTravelConditionItem(
                                      i,
                                      "condition",
                                      value
                                    )
                                  }
                                  value={finalizeTravelCondition?.condition}
                                />
                              </Col>

                              <Col breakPoint={{ md: 6 }} className="mb-2">
                                <TextSpan apparence="s2">
                                  <FormattedMessage id="value" />
                                </TextSpan>
                                <InputGroup fullWidth className="mt-1">
                                  <input
                                    value={finalizeTravelCondition?.value}
                                    onChange={(e) =>
                                      onChangeTravelConditionItem(
                                        i,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    type="text"
                                    placeholder={intl.formatMessage({
                                      id: "machine.alarm.value.label",
                                    })}
                                  />
                                </InputGroup>
                              </Col>
                              <Col breakPoint={{ md: 6 }} className="mb-2">
                                <TextSpan apparence="s2">
                                  <FormattedMessage id="time.keeped.seconds" />
                                </TextSpan>
                                <InputGroup fullWidth className="mt-1">
                                  <input
                                    value={finalizeTravelCondition?.timeKeeped}
                                    onChange={(e) =>
                                      onChangeTravelConditionItem(
                                        i,
                                        "timeKeeped",
                                        e.target.value !== "0" &&
                                          !e.target.value
                                          ? e.target.value
                                          : parseInt(e.target.value)
                                      )
                                    }
                                    type="number"
                                    placeholder={intl.formatMessage({
                                      id: "time.keeped.seconds",
                                    })}
                                  />
                                </InputGroup>
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            breakPoint={{ md: 1 }}
                            className="col-flex-center mb-2"
                          >
                            <Button
                              status="Danger"
                              size="Tiny"
                              onClick={() => {
                                onChange(
                                  "finalizeTravelConditions",
                                  data?.finalizeTravelConditions?.filter(
                                    (x, z) => z !== i
                                  )
                                );
                              }}
                            >
                              <EvaIcon name="trash-2-outline" />
                            </Button>
                          </Col>
                        </Row>
                      )
                    )}
                    <div className="col-flex-center mb-4">
                      <Button
                        size="Tiny"
                        status="Info"
                        className="mb-2 flex-between"
                        disabled={getIsDisabledCondition()}
                        onClick={() => {
                          if (data?.finalizeTravelConditions?.length) {
                            onChange("finalizeTravelConditions", [
                              ...data?.finalizeTravelConditions,
                              {},
                            ]);
                            return;
                          }
                          onChange("finalizeTravelConditions", [{}]);
                        }}
                      >
                        <EvaIcon name="plus-circle-outline" className="mr-1" />
                        <FormattedMessage id="add.condition" />
                      </Button>
                    </div>
                  </Col>
                )} */}
      </Row>
    </>
  );
}
