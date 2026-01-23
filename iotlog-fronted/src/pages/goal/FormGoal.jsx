import { Col, InputGroup, Select } from "@paljs/ui";
import { useIntl } from "react-intl";
import { LabelIcon } from "../../components";
import { useEffect, useState } from "react";

export default function FormGoal({ data: initialData, handleChange }) {
  const [data, setData] = useState({});

  const intl = useIntl();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const optionsType = [
    {
      value: "DOWNTIME",
      label: intl.formatMessage({ id: "downtime" }),
    }
  ]

  const optionsYear = [
    {
      value: 2024,
      label: "2024",
    },
    {
      value: 2025,
      label: "2025",
    },
    {
      value: 2026,
      label: "2026",
    },
    {
      value: 2027,
      label: "2027",
    }
  ]

  return (
    <>
      <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
        <LabelIcon
          iconName="text-outline"
          title={intl.formatMessage({ id: "name" })}
        />
        <InputGroup fullWidth>
          <input
            type="text"
            placeholder={intl.formatMessage({ id: "name" })}
            value={data?.name}
            onChange={(event) => handleChange("name", event.target.value)}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ xs: 12, md: 4 }} className="mb-4">
        <LabelIcon
          iconName="pricetags-outline"
          title={intl.formatMessage({ id: "type" })}
        />
        <Select
          options={optionsType}
          placeholder={intl.formatMessage({ id: "type" })}
          value={optionsType?.find(x => x.value === data?.type) || null}
          onChange={({ value }) => handleChange("type", value)}
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 2 }} className="mb-4">
        <LabelIcon
          iconName="calendar-outline"
          title={intl.formatMessage({ id: "year" })}
        />
        <Select
          options={optionsYear}
          placeholder={intl.formatMessage({ id: "year" })}
          value={optionsYear?.find(x => x.value === data?.year) || null}
          onChange={({ value }) => handleChange("year", value)}
        />
      </Col>
    </>
  );
}
