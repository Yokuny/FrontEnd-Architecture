import { TextSpan, LabelIcon } from "../../";
import { FormattedMessage } from "react-intl";
import Col from "@paljs/ui/Col"
import { EvaIcon, Row } from "@paljs/ui";
export default function AllowedUsers({ data }) {
  if (!data) return null;
  return (
    <>
      <Col breakPoint={{ lg: 12, md: 12 }}

        className="mb-2"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <LabelIcon
          title={<FormattedMessage id="allowed.users" />}
        />
        {data
        ?.sort((a, b) => a.name?.localeCompare(b.name))
        ?.map(
          (user) => (
            <>
              <Row className="m-0 pb-1" bottom="xs">
                <EvaIcon name="person" status="Basic" />
                <TextSpan apparence="c2" hint className="pl-1">
                  {user.name}
                </TextSpan>
              </Row>
            </>
          )
        )}
      </Col>
    </>
  )
}
