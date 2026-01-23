import { Select } from "@paljs/ui";
import ReactCountryFlag from "react-country-flag";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import TextSpan from "../../Text/TextSpan";
import { Countries } from "./Countries";

const Label = styled.div`

`;

export const optionsContries = Countries?.map(x => {
  return {
    value: x.code,
    name: x.name,
    label: (
      <Label>
        <ReactCountryFlag
          countryCode={x.code}
          svg
          style={{ marginTop: -3, fontSize: "1.5em", }}
        />
        <TextSpan className="ml-2" apparence="s1">
          {x.name}
        </TextSpan>
      </Label>
    )
  }
}
)

export default function SelectCountry(props) {

  const { onChange, value, placeholderID, className } = props;

  return <>
    <Select
      className={className}
      options={optionsContries}
      menuPosition="fixed"
      placeholder={<FormattedMessage id={placeholderID || "country"} />}
      onChange={onChange}
      value={optionsContries.find(x => x.value === value)}
    />
  </>
}
