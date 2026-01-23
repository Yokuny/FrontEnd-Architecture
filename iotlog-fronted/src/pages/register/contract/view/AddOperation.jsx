import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import Select from "@paljs/ui/Select";
import { FormattedMessage, useIntl } from "react-intl";
import { TextSpan } from "../../../../components";

export default function AddOperation(props) {
  const {
     data,
    onChange,
    listGroupConsumptions,
  } = props;
  const intl = useIntl();

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 4, xs: 12 }} className="mb-2">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="code" /> *
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={data?.idOperation}
              onChange={(e) => onChange("idOperation", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({
                id: "code",
              })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 8, xs: 12 }} className="mb-2">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="name" /> *
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={data?.name}
              onChange={(e) => onChange("name", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({
                id: "name",
              })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-2">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="group.consumption" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <Select
            onChange={(value) => onChange("idGroupConsumption", value?.value)}
            value={listGroupConsumptions?.find(x => x.value === data?.idGroupConsumption)}
            options={listGroupConsumptions}
            placeholder={intl.formatMessage({
              id: "operation.consumptiongroup.placeholder",
            })}
            noOptionsMessage={() =>
              intl.formatMessage({
                id: "nooptions.message",
              })
            }
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-2">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="description" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <textarea
              value={data?.description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={2}
              placeholder={intl.formatMessage({
                id: "description",
              })}
            />
          </InputGroup>
        </Col>

      </Row>
    </>
  );
}
