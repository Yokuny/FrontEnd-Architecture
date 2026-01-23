import { Col, InputGroup, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../../components";

export default function CalculatedField({ onChange, data, allFields }) {
  const intl = useIntl();

  const onChangeProp = (prop, value) => {
    const properties = {
      ...(data?.properties || {}),
      [prop]: value,
    };
    onChange("properties", properties);
  };

  const optionsFields = allFields
    ?.filter(x => (x.datatype === "number"
    || x.datatype?.includes("date")
    || x.datatype === "calculated") && x.name !== data.name)
    ?.map(x => ({
      value: x.name,
      label: x.description
    }))

  const optionsConditions = [
    {
      value: 'sum',
      label: intl.formatMessage({ id: 'sum' })
    },
    {
      value: 'subtract',
      label: intl.formatMessage({ id: 'subtract' })
    },
    {
      value: 'differenceDate',
      label: intl.formatMessage({ id: 'difference.time' })
    },
    {
      value: 'consumptionDaily',
      label: intl.formatMessage({ id: 'consumption.daily' })
    }
  ]

  const fieldSelectIsDate = allFields?.find(x =>
    (x.name === data?.properties?.field1 ||
      x.name === data?.properties?.field2
    ) &&
    x.datatype?.includes("date")
  )

  return (
    <>
      <Col breakPoint={{ md: 4 }} className="mb-2 mt-2">
        <LabelIcon
          iconName="code-outline"
          title={`${intl.formatMessage({ id: 'condition' })}`}
        />
        <Select className="mt-1"
          options={optionsConditions?.filter(x => fieldSelectIsDate ? x.value === "differenceDate" : x.value !== "differenceDate")}
          value={optionsConditions?.find(x => x.value === data?.properties?.condition)}
          onChange={(value) => onChangeProp("condition", value?.value || null)}
          isClearable
          menuPosition="fixed"
          noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
          placeholder={`${intl.formatMessage({ id: 'condition' })}`}
        />
      </Col>
      <Col breakPoint={{ md: 4 }} className="mb-2 mt-2">
        <LabelIcon
          iconName="hash-outline"
          title={ data?.properties?.condition === "consumptionDaily"
          ? `${intl.formatMessage({ id: 'field' })} ${intl.formatMessage({ id: 'consume' })}`
          : `${intl.formatMessage({ id: 'field' })} 1`}
        />
        <Select className="mt-1"
          options={optionsFields?.filter(x => x.value !== data?.properties?.field2)}
          value={optionsFields?.find(x => x.value === data?.properties?.field1)}
          onChange={(value) => onChangeProp("field1", value?.value || null)}
          isClearable
          menuPosition="fixed"
          noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
          placeholder={`${intl.formatMessage({ id: 'field' })} 1`}
        />
      </Col>
      <Col breakPoint={{ md: 4 }} className="mb-2 mt-2">
        <LabelIcon
          iconName="hash-outline"
          title={ data?.properties?.condition === "consumptionDaily"
          ? `${intl.formatMessage({ id: 'field' })} ${intl.formatMessage({ id: 'scale.time' })}`
          : `${intl.formatMessage({ id: 'field' })} 2`}
        />
        <Select className="mt-1"
          options={optionsFields?.filter(x => x.value !== data?.properties?.field1)}
          value={optionsFields?.find(x => x.value === data?.properties?.field2)}
          onChange={(value) => onChangeProp("field2", value?.value || null)}
          isClearable
          menuPosition="fixed"
          noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
          placeholder={`${intl.formatMessage({ id: 'field' })} 2`}
        />
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-2">
        <LabelIcon
          iconName="cube-outline"
          title={<FormattedMessage id="unit" />}
        />
        <InputGroup fullWidth className="mt-1">
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: "unit",
            })}
            value={data?.properties?.unit}
            onChange={(e) => onChangeProp("unit", e.target.value)}
          />
        </InputGroup>
      </Col>
    </>
  );
}
