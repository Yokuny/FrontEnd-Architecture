import { Checkbox, Col, Row } from "@paljs/ui";
import { LabelIcon, SelectMachineEnterprise, TextSpan } from "../../../components";
import { FormattedMessage } from "react-intl";

export default function PermissionsAssets({
  data,
  onChange,
  idEnterprise
}) {
  return (<>
    <Row>
      <Col breakPoint={{ md: 12 }}>
        <Row>
          <Col breakPoint={{ md: 12 }} className={`mt-2 ${!data?.allMachines ? 'mb-4' : ''}`}>
            <Checkbox
              checked={data?.allMachines}
              onChange={(e) =>
                onChange("allMachines", !data?.allMachines)
              }
            >
              <TextSpan apparence="s2" hint>
                <FormattedMessage id="all.machines" />
              </TextSpan>
            </Checkbox>
          </Col>
          {!data?.allMachines && (
            <Col breakPoint={{ md: 12 }}>
              <LabelIcon
                iconName="wifi-outline"
                title={<FormattedMessage id="machines" />}
              />
              <div className="mt-1"></div>
              <SelectMachineEnterprise
                idEnterprise={idEnterprise}
                value={data?.machines}
                onChange={(value) => onChange("machines", value)}
                isMulti
              />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  </>)
}
