import { InputGroup } from "@paljs/ui";
import styled from "styled-components";
import { debounce } from "underscore";

export const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

export const ContainerColor = styled(InputGroup)`
  display: flex !important;
  align-items: center !important;
`;

export function InputColorControl({ onChange, value, defaultValue }) {
  const changeValueDebounced = debounce((value) => {
    onChange(value);
  }, 500);
  return (
    <InputColor
      type="color"
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => changeValueDebounced(e.target.value)}
    />
  );
}
