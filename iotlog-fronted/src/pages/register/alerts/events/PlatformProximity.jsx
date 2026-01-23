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
  SelectPlatformEnterprise,
  TextSpan,
  Toggle,
} from "../../../../components";
import { Vessel, Platform } from "../../../../components/Icons";

const PlatformProximity = (props) => {
  const { idEnterprise, onChange, onActiveEvent, event } = props;

  const theme = useTheme();

  return (
    <>
      <CardNoShadow>
        <CardHeader>
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <Row middle="xs" style={{ margin: 0 }}>
                <Platform
                  style={{
                    height: 22,
                    width: 22,
                    fill: theme.colorPrimary500,
                  }}
                />

              <TextSpan apparence="s1" className="ml-2">
                <FormattedMessage id="inside.area.platform" />
              </TextSpan>
            </Row>
            <Toggle
              checked={!!event?.startInsideInPlatformArea}
              onChange={() => onActiveEvent("startInsideInPlatformArea")}
              status="Success"
            />
          </Row>
        </CardHeader>
        {!!event?.startInsideInPlatformArea && (
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
                  checked={event?.startInsideInPlatformArea?.allMachines}
                  onChange={() =>
                    onChange(
                      "startInsideInPlatformArea",
                      "allMachines",
                      !event?.startInsideInPlatformArea?.allMachines
                    )
                  }
                  className="mt-2 pl-1"
                >
                  <FormattedMessage id="all.vessels" />
                </Checkbox>
                <div className="mt-3 pl-1">
                  {!event?.startInsideInPlatformArea?.allMachines && (
                    <SelectMachineEnterprise
                      isMulti={true}
                      idEnterprise={idEnterprise}
                      onChange={(value) =>
                        onChange("startInsideInPlatformArea", "machines", value)
                      }
                      placeholder="vessels.select.placeholder"
                      value={event?.startInsideInPlatformArea?.machines}
                    />
                  )}
                </div>
              </Col>
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon
                  renderIcon={() => (
                    <Platform
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
                  title={<FormattedMessage id="platforms" />}
                />
                <Checkbox
                  checked={event?.startInsideInPlatformArea?.allPlatforms}
                  onChange={() =>
                    onChange(
                      "startInsideInPlatformArea",
                      "allPlatforms",
                      !event?.startInsideInPlatformArea?.allPlatforms
                    )
                  }
                  className="mt-2 pl-1"
                >
                  <FormattedMessage id="all.platforms" />
                </Checkbox>
                <div className="mt-3 pl-1">
                  {!event?.startInsideInPlatformArea?.allPlatforms && (
                    <SelectPlatformEnterprise
                      isMulti={true}
                      idEnterprise={idEnterprise}
                      onChange={(value) =>
                        onChange(
                          "startInsideInPlatformArea",
                          "platforms",
                          value
                        )
                      }
                      value={event?.startInsideInPlatformArea?.platforms}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </CardBody>
        )}
      </CardNoShadow>
    </>
  );
};

export default PlatformProximity;
