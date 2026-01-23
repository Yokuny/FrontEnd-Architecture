import { CardBody, CardHeader, Checkbox, Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { CardNoShadow, LabelIcon, SelectMachineEnterprise, TextSpan, Toggle } from "../../../../components";
import { RouteDestiny, Vessel } from "../../../../components/Icons";
import { useTheme } from "styled-components";
import { getIcon, ListType } from "../../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";

const StatusDistancePort = (props) => {
  const { idEnterprise, onChange, onActiveEvent, event } = props;

  const intl = useIntl();
  const theme = useTheme();

  const optionsStatus = ListType.map((item) => ({
    value: item.value,
    label: intl.formatMessage({ id: getIcon(item.value)?.text })
  }))
    ?.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <CardNoShadow>
        <CardHeader>
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <Row middle="xs" style={{ margin: 0 }}>
              <RouteDestiny
                style={{
                  height: 21,
                  width: 21,
                  fill: theme.colorWarning500,
                }}
              />

              <TextSpan apparence="s1" className="ml-2">
                <FormattedMessage id="status.distance.port" />
              </TextSpan>
            </Row>
            <Toggle
              checked={!!event?.statusDistancePort}
              onChange={() => onActiveEvent("statusDistancePort")}
              status="Success"
            />
          </Row>
        </CardHeader>
        {!!event?.statusDistancePort && (
          <CardBody>
            <Row middle="xs">
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
                  title={<FormattedMessage id="vessels" />}
                />

                <Checkbox
                  checked={event?.statusDistancePort?.allMachines}
                  onChange={() =>
                    onChange(
                      "statusDistancePort",
                      "allMachines",
                      !event?.statusDistancePort?.allMachines
                    )
                  }
                  className="mt-2 pl-1"
                >
                  <FormattedMessage id="all.vessels" />
                </Checkbox>
                <div className="mt-3 pl-1">
                  {!event?.statusDistancePort?.allMachines && (
                    <SelectMachineEnterprise
                      isMulti={true}
                      idEnterprise={idEnterprise}
                      onChange={(value) =>
                        onChange("statusDistancePort", "machines", value)
                      }
                      placeholder="vessels.select.placeholder"
                      value={event?.statusDistancePort?.machines}
                    />
                  )}
                </div>
              </Col>
              <Col breakPoint={{ md: 8 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="status" />}
                  iconName="loader-outline"
                />
                <div className="mt-1"></div>
                <Select
                  options={optionsStatus}
                  onChange={(value) =>
                    onChange("statusDistancePort", "status", value?.value || null)
                  }
                  placeholder="Status"
                  value={optionsStatus?.find(x => x.value === event?.statusDistancePort?.status) || null}
                  menuPosition="fixed"
                />
              </Col>
              <Col breakPoint={{ md: 4 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="distance.more.than" />}
                  iconName="clock-outline"
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    value={event?.statusDistancePort?.distance}
                    onChange={(e) =>
                      onChange(
                        "statusDistancePort",
                        "distance",
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    type="number"
                    placeholder={intl.formatMessage({
                      id: "distance",
                    })}
                  />
                </InputGroup>
              </Col>
            </Row>
          </CardBody>
        )}
      </CardNoShadow>
    </>
  )
}

export default StatusDistancePort;
