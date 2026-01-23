import { Checkbox, Col, Row } from "@paljs/ui";
import { LabelIcon, SelectMachine, TextSpan } from "../../../components";
import { FormattedMessage } from "react-intl";
import { useTheme } from "styled-components";
import { Vessel } from "../../../components/Icons";
import { SelectMachineEnterprise, SelectSensorByAssets } from "../../../components/Select";

export default function AssetsPermissions({
  data,
  onChange,
  idEnterprise
}) {
  const theme = useTheme();
  return (
    <>
      <Row>
        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s1">
            <FormattedMessage id="permissions.machine" />
          </TextSpan>
          <div className="mt-1"></div>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <Checkbox
                className="ml-2"
                checked={data?.allMachines}
                onChange={(e) =>
                  onChange("allMachines", !data?.allMachines)
                }
              >
                <TextSpan apparence="s2">
                  <FormattedMessage id="all.machines" />
                </TextSpan>
              </Checkbox>
            </Col>
            {!data?.allMachines && (
              <Col breakPoint={{ md: 12 }}>
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
                  title={<FormattedMessage id="machines" />}
                />
                <div className="mt-1"></div>
                <SelectMachineEnterprise
                  value={data?.machines}
                  idEnterprise={idEnterprise}
                  onChange={(value) => onChange("machines", value)}
                  isMulti
                />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s1">
            <FormattedMessage id="permissions.sensors" />
          </TextSpan>
          <div className="mt-1"></div>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <Checkbox
                className="ml-2"
                checked={data?.allSensors}
                onChange={(e) =>
                  onChange("allSensors", !data?.allSensors)
                }
              >
                <TextSpan apparence="s2">
                  <FormattedMessage id="all.sensors" />
                </TextSpan>
              </Checkbox>
            </Col>
            {!data?.allSensors && (
              <Col breakPoint={{ md: 12 }}>
                <LabelIcon
                  iconName="flash-outline"
                  title={<FormattedMessage id="sensors" />}
                />
                <div className="mt-1"></div>
                <SelectSensorByAssets
                  idAssets={data?.machines?.map((x) => x.value)}
                  value={data?.idSensors}
                  isOnlyValue
                  onChange={(value) => onChange("idSensors", value?.map((x) => x.value) || [])}
                  isMulti
                />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </>
  )
}
