import { Button, Card, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { LabelIcon, TextSpan } from "../../../components";
import InputDateTime from "../../../components/Inputs/InputDateTime";

export default function Events(props) {

  const { formData, onChange } = props;

  const onAdd = () => {
    onChange("events", [
      ...(formData?.events || []),
      {}
    ])
  }

  const onRemove = (index) => {
    onChange("events", [
      ...formData?.events?.slice(0, index),
      ...formData?.events?.slice(index + 1),
    ])
  }

  const onChangeItem = (index, prop, value) => {
    const itemToUpdate = formData?.events[index];
    itemToUpdate[prop] = value;
    onChange("events", [
      ...formData?.events?.slice(0, index),
      itemToUpdate,
      ...formData?.events?.slice(index + 1)
    ])
  }

  return (
    <>
      <Col breakPoint={{ md: 12, sm: 12, xs: 12 }}>
        {formData?.events?.map((x, i) => (
          <Card key={`e-${i}-GrF`} className="pb-2 pt-3" style={{ marginBottom: 4 }}>
            <Row className="m-0">
              {/* <Col breakPoint={{ md: 1 }}>
                <TextSpan apparence="s2">
                  #{i+1}
                </TextSpan>
              </Col> */}
              <Col breakPoint={{ md: 4 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <TextSpan apparence="s2" hint style={{ marginBottom: -5 }}>
                  #{i + 1}
                </TextSpan>
                <LabelIcon
                  title={<FormattedMessage id="datetime" />}
                />
                <InputDateTime
                  onChange={(e) => onChangeItem(i, "date", e)}
                  value={x.date}
                />
              </Col>
              <Col breakPoint={{ md: 7 }}>
                <LabelIcon
                  title={<FormattedMessage id="description" />}
                />
                <InputGroup fullWidth>
                  <textarea
                    rows={2}
                    onChange={(e) => onChangeItem(i, "description", e.target.value)}
                    value={x.description}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 1 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Button
                  size="Tiny"
                  status="Danger"
                  appearance="ghost"
                  onClick={() => onRemove(i)}
                >
                  <EvaIcon name="trash-2-outline" />
                </Button>
              </Col>
            </Row>
          </Card>))}
        <Button
          className="mt-3"
          onClick={onAdd}
          size="Tiny"
          status="Info"
        >
          <FormattedMessage id="add.event" />
        </Button>
      </Col>
    </>
  )
}
