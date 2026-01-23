import styled, { css } from "styled-components";
import { nanoid } from "nanoid";

const Content = styled.div`
  display: flex;

  ${({ theme, checked, status, disabled, size }) => css`
    .react-switch-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      width: ${size?.widthContent ?? 38}px;
      height: ${size?.heightContent ?? 22}px;
      background: ${checked
        ? theme[`color${status}500`]
        : theme.backgroundBasicColor3};
      border-radius: 40px;
      position: relative;
      transition: background-color 0.2s;
    }

    .react-switch-label .react-switch-button {
      content: "";
      position: absolute;
      top: 1px;
      left: 1px;
      width: ${size?.widthSwitch ?? 20}px;
      height: ${size?.heightSwitch ?? 20}px;
      border-radius: 25px;
      transition: 0.2s;
      background: #fff;
      box-shadow: 0 0 2px 0
        ${disabled ? theme.backgroundBasicColor4 : theme[`color${status}500`]};
    }
  `}

  .react-switch-checkbox {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  .react-switch-checkbox:checked + .react-switch-label .react-switch-button {
    left: calc(100% - 1px);
    transform: translateX(-100%);
  }

  .react-switch-label:active .react-switch-button {
    width: 20px;
  }
`;

export default function Toggle({
  checked,
  onChange,
  className,
  disabled = false,
  size = "Medium",
  status = "Primary",
}) {
  const id = nanoid(5);

  const getSize = () => {
    switch (size) {
      case "Tiny":
        return {
          widthContent: 25,
          heightContent: 15,
          widthSwitch: 13,
          heightSwitch: 13,
        };
      default:
        return {
          widthContent: 38,
          heightContent: 22,
          widthSwitch: 20,
          heightSwitch: 20,
        };
    }
  };

  return (
    <>
      <Content
        checked={!!checked}
        size={getSize()}
        className={className}
        status={status}
        disabled={disabled}
      >
        <input
          className="react-switch-checkbox"
          checked={!!checked}
          onChange={onChange}
          disabled={disabled}
          id={id}
          type="checkbox"
        />
        <label className="react-switch-label" htmlFor={id}>
          <span className="react-switch-button" />
        </label>
      </Content>
    </>
  );
}
