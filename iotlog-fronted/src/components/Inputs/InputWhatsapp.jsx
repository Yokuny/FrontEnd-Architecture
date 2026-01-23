import PhoneInput from "react-phone-input-2";
import styled, { css } from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import "react-phone-input-2/lib/style.css";

const ContainerWhatsapp = styled(InputGroup)`
  ${({ theme }) => css`
    .react-tel-input .form-control {
      background-color: ${theme.backgroundBasicColor2};
      border-radius: 0.25rem;
      border-color: ${theme.borderBasicColor4};
      border-style: solid;
      border-width: 1px;
      width: 100%;
    }

    .react-tel-input input:focus {
      background-color: ${theme.backgroundBasicColor1};
      border-color: ${theme.colorPrimaryDefaultBorder};
    }

    .react-tel-input input:hover {
      background-color: ${theme.backgroundBasicColor4};
    }

    .react-tel-input .flag-dropdown {
      background-color: ${theme.backgroundBasicColor2};
      border: 1px solid ${theme.borderBasicColor4};
      border-radius: 0.25rem;
    }

    .react-tel-input .selected-flag {
      border-radius: 0.25rem;
    }

    .flag-dropdown:hover {
      background-color: ${theme.backgroundBasicColor4};
    }

    .selected-flag:focus {
      background-color: ${theme.backgroundBasicColor2};
      border: 1px solid ${theme.colorPrimaryDefaultBorder};
    }

    .selected-flag:hover {
      background-color: ${theme.backgroundBasicColor4};
    }

    .selected-flag:active {
      background-color: ${theme.backgroundBasicColor2};
      border: 1px solid ${theme.colorPrimaryDefaultBorder};
    }

    .react-tel-input .flag-dropdown.open .selected-flag {
      background-color: ${theme.backgroundBasicColor4};
    }

    .flag-dropdown.open {
      background-color: ${theme.backgroundBasicColor2};
    }

    .react-tel-input .country-list {
      background-color: ${theme.backgroundBasicColor1};
    }

    .react-tel-input .country-list .country:hover {
      background-color: ${theme.colorBasicHover};
      color: ${theme.colorPrimaryHover};
    }

    .country .highlight {
      background-color: ${theme.colorBasicHover};
      color: ${theme.colorPrimaryHover};
    }
  `}

  .PhoneInput {
    width: 100%;
  }

  input {
    margin-left: 5px;
  }
`;

export default function InputWhatsapp({ onChange, value, disabled = false, className = "", disableDropdown = false }) {
  return (
    <ContainerWhatsapp fullWidth className={className}>
      <PhoneInput
        masks={{ br: "(..) ..... - ....", ar: ".. . .... - ...." }}
        country={"br"}
        onChange={onChange}
        value={value}
        disabled={disabled}
        disableDropdown={disableDropdown}
      />
    </ContainerWhatsapp>
  );
}
