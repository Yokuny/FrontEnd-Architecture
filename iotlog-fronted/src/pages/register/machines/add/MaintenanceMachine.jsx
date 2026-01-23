import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { LabelIcon, SelectMaintenancePlan, SelectPart } from "../../../../components";

export default function MaintenanceMachine(props) {

  const { isShowPartList, enterprise, isShowMaintenance, onChange, data } = props;

  return (<>
    <Row className='pt-4 pl-2 pr-2' style={{ margin: 0 }}>
      {isShowPartList && (
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="parts" />}
            iconName={"settings-outline"}
          />
          <div className="mt-1"></div>
          <SelectPart
            onChange={(value) => onChange("parts", value)}
            value={data?.parts}
            isMulti
            idEnterprise={enterprise?.value}
          />
        </Col>
      )}
      {isShowMaintenance && (
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="maintenance.plan" />}
            iconName={"file-add-outline"}
          />
          <div className="mt-1"></div>
          <SelectMaintenancePlan
            onChange={(value) =>
              onChange("maintenancePlans", value)
            }
            idEnterprise={enterprise?.value}
            value={data?.maintenancePlans}
            isMulti
          />
        </Col>
      )}
    </Row>
  </>)
}
