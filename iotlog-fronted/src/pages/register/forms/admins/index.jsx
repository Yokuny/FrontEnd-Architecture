import { Col, Row, Select } from "@paljs/ui";
import { useIntl } from "react-intl";
import { LabelIcon, SelectUsers } from "../../../../components";

export default function AdminsForm(props) {

  const { data, onChange, enterprise } = props;
  const intl = useIntl()

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            iconName="person-done-outline"
            title={`${intl.formatMessage({ id: 'administration' })}`}
          />
          <SelectUsers
            className="mt-1"
            value={data?.usersAdmin}
            idEnterprise={enterprise?.value}
            onChange={(value) => onChange("usersAdmin", value)}
            isClearable
            isMulti
            placeholder={`${intl.formatMessage({ id: 'users' })}`}
          />
        </Col>
      </Row>
    </>
  )
}
