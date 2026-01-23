import React from 'react';
import {
  CardBody,
  CardHeader,
  Checkbox,
  Col,
  Row,
} from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useTheme } from "styled-components";
import {
  CardNoShadow,
  LabelIcon,
  SelectMachineEnterprise,
  TextSpan,
  Toggle,
} from "../../../../components";
import { Vessel, Polygon } from "../../../../components/Icons";
import { SelectFence } from "../../../../components/Select";

const InOutFence = (props) => {
  const { idEnterprise, onChange, onActiveEvent, event } = props;

  const theme = useTheme();

  return (
    <>
      <CardNoShadow>
        <CardHeader>
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <Row middle="xs" style={{ margin: 0 }}>
              <Polygon
                style={{
                  height: 22,
                  width: 22,
                  fill: '#CA28DB',
                }}
              />

              <TextSpan apparence="s1" className="ml-2">
                <FormattedMessage id="in.out.geofence" />
              </TextSpan>
            </Row>
            <Toggle
              checked={!!event?.inOutGeofence}
              onChange={() => onActiveEvent("inOutGeofence")}
              status="Success"
            />
          </Row>
        </CardHeader>
        {!!event?.inOutGeofence && (
          <CardBody>
            <Row>
              <Col breakPoint={{ md: 6 }}>
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
                  title={<FormattedMessage id="vessels" />}
                />

                <Checkbox
                  checked={event?.inOutGeofence?.allMachines}
                  onChange={() =>
                    onChange(
                      "inOutGeofence",
                      "allMachines",
                      !event?.inOutGeofence?.allMachines
                    )
                  }
                  className="mt-2 pl-1"
                >
                  <FormattedMessage id="all.vessels" />
                </Checkbox>
                <div className="mt-3 pl-1">
                  {!event?.inOutGeofence?.allMachines && (
                    <SelectMachineEnterprise
                      isMulti={true}
                      idEnterprise={idEnterprise}
                      onChange={(value) =>
                        onChange("inOutGeofence", "machines", value)
                      }
                      placeholder="vessels.select.placeholder"
                      value={event?.inOutGeofence?.machines}
                    />
                  )}
                </div>
              </Col>
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon
                  renderIcon={() => (
                    <Polygon
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
                  title={<FormattedMessage id="geofences" />}
                />
                <Checkbox
                  checked={event?.inOutGeofence?.allGeofences}
                  onChange={() =>
                    onChange(
                      "inOutGeofence",
                      "allGeofences",
                      !event?.inOutGeofence?.allGeofences
                    )
                  }
                  className="mt-2 pl-1"
                >
                  <FormattedMessage id="all.geofences" />
                </Checkbox>
                <div className="mt-3 pl-1">
                  {!event?.inOutGeofence?.allGeofences && (
                    <SelectFence
                      isMulti={true}
                      idEnterprise={idEnterprise}
                      onChange={(value) =>
                        onChange(
                          "inOutGeofence",
                          "geofences",
                          value
                        )
                      }
                      value={event?.inOutGeofence?.geofences}
                    />
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                <div className="mt-3">
                  <Checkbox
                    checked={event?.inOutGeofence?.alertEntering}
                    onChange={() =>
                      onChange(
                        "inOutGeofence",
                        "alertEntering",
                        !event?.inOutGeofence?.alertEntering
                      )
                    }
                    className="mt-2 pl-1"
                  >
                    <FormattedMessage id="alert.event.entering.checkbox" />
                  </Checkbox>
                </div>
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                <div className="mt-3">
                  <Checkbox
                    checked={event?.inOutGeofence?.alertLeaving}
                    onChange={() =>
                      onChange(
                        "inOutGeofence",
                        "alertLeaving",
                        !event?.inOutGeofence?.alertLeaving
                      )
                    }
                    className="mt-2 pl-1"
                  >
                    <FormattedMessage id="alert.event.leaving.checkbox" />
                  </Checkbox>
                </div>
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }}>
                <div className="mt-3">
                  <Checkbox
                    checked={event?.inOutGeofence?.passage}
                    onChange={() =>
                      onChange(
                        "inOutGeofence",
                        "passage",
                        !event?.inOutGeofence?.passage
                      )
                    }
                    className="mt-2 pl-1"
                  >
                    <FormattedMessage id="passage" />
                  </Checkbox>
                </div>
              </Col>
            </Row>
          </CardBody>
        )}
      </CardNoShadow>
    </>
  );
};

export default InOutFence;
