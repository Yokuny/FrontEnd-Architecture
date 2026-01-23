import { Select } from "@paljs/ui";
import { useIntl } from "react-intl";

export const OPERATIONAL = "operational";
export const FINANCIAL = "financial";

const OPTIONS_VIEW = [
  OPERATIONAL,
  FINANCIAL
]

export default function SelectView({
  value,
  onChange
}) {

  const intl = useIntl();

  const options = OPTIONS_VIEW?.map((item) => ({ label: intl.formatMessage({ id: item }), value: item }))

  return (
    <>
      <Select
        options={options}
        onChange={(value) => onChange(value?.value)}
        value={options.find((opt) => opt.value === value)}
        menuPosition="fixed"
      />
    </>
  )
}
