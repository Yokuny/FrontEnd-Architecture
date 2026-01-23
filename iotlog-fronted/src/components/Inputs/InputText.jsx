import { InputGroup } from "@paljs/ui/Input";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";

const ContainerText = styled(InputGroup)`
  input {
    line-height: 1.2rem;
  }

  svg {
    margin-top: -3px;
  }
`;

const ContainerIcon = styled.a`
  position: absolute;
  right: 13px;
  top: 12px;
  cursor: pointer;
`;

export default function InputText({
  onChange,
  value,
  placeholder = "",
  className = "",
  isDisabled = false,
  isRequired = false,
  iconName = "edit-outline",
  fullWidth = true,
}) {
  return (
    <ContainerText fullWidth={fullWidth} className={className}>
      <input
        style={{ padding: "8px" }}
        type="text"
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        required={isRequired}
      />
      {iconName && (
        <ContainerIcon>
          <EvaIcon name={iconName} status="Basic" />
        </ContainerIcon>
      )}
    </ContainerText>
  );
}
