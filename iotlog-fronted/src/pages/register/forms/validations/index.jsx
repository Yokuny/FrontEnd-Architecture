import { Col, InputGroup, Row, Select } from "@paljs/ui";
import { useIntl } from "react-intl";
import { debounce } from "underscore";
import { LabelIcon } from "../../../../components";

export default function Validations(props) {

  const { fields, data, onChange } = props;
  const intl = useIntl()

  const optionsConditions = [
    {
      value: 'equalLast',
      label: intl.formatMessage({ id: 'equal.last' })
    }
  ]

  const optionsFields = fields
    ?.map(x => ({
      value: x.name,
      label: x.description
    }))

  const changeValueDebounced = debounce((prop, value) => {
    onChange(prop, value);
  }, 500);


  return (
    <>
      <Row>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            iconName="hash-outline"
            title={`${intl.formatMessage({ id: 'field' })} 1`}
          />
          <Select className="mt-1"
            options={optionsFields?.filter(x => x.value !== data?.field2)}
            value={optionsFields?.find(x => x.value === data?.field1)}
            onChange={(value) => onChange("field1", value?.value || null)}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
            placeholder={`${intl.formatMessage({ id: 'field' })} 1`}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            iconName="code-outline"
            title={`${intl.formatMessage({ id: 'condition' })}`}
          />
          <Select className="mt-1"
            options={optionsConditions}
            value={optionsConditions?.find(x => x.value === data?.condition)}
            onChange={(value) => onChange("condition", value?.value || null)}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            iconName="hash-outline"
            title={`${intl.formatMessage({ id: 'field' })} 2`}
          />
          <Select className="mt-1"
            options={optionsFields?.filter(x => x.value !== data?.field1)}
            value={optionsFields?.find(x => x.value === data?.field2)}
            onChange={(value) => onChange("field2", value?.value || null)}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
            placeholder={`${intl.formatMessage({ id: 'field' })} 2`}
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon
            iconName="checkmark-circle-outline"
            title={`${intl.formatMessage({ id: 'case.field.same' })}`}
          />
          <Select className="mt-1"
            options={optionsFields?.filter(x => x.value !== data?.fieldSame)}
            value={optionsFields?.find(x => x.value === data?.fieldSame)}
            onChange={(value) => onChange("fieldSame", value?.value || null)}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
            placeholder={`${intl.formatMessage({ id: 'field' })}`}
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon
            iconName="arrow-downward-outline"
            title={`${intl.formatMessage({ id: 'ordered' })}`}
          />
          <Select className="mt-1"
            options={optionsFields?.filter(x => x.value !== data?.ordered)}
            value={optionsFields?.find(x => x.value === data?.ordered)}
            onChange={(value) => onChange("ordered", value?.value || null)}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
            placeholder={`${intl.formatMessage({ id: 'ordered' })}`}
          />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            iconName="message-circle-outline"
            title={`${intl.formatMessage({ id: 'message' })}`}
          />
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              onChange={e => onChange('message', e.target.value)}
              value={data?.message}
              placeholder={intl.formatMessage({ id: "message" })}
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  )
}
