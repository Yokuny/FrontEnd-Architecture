import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { TextSpan } from "../../../../components";

export default function AddEvent(props) {
  const { data, onChange } = props;
  const intl = useIntl();

  return (
    <>
      <Row >
        <Col breakPoint={{ md: 8 }} className="mb-2">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="event" /> *
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              value={data?.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder={intl.formatMessage({
                id: "event.description",
              })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-2">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="fine.factor" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={data?.factor}
              onChange={(e) => onChange("factor", e.target.value)}
              type="number"
              min={0}
              max={100}
              placeholder={
                intl.formatMessage({
                  id: "fine.factor",
                }) + " (0 - 100)%"
              }
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  );
}
