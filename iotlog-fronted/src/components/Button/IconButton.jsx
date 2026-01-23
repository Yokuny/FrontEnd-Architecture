import { EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  background-color: ${props => props.theme.colorPrimary500};
  padding: 6px 12px 6px 10px;
  user-select: none;
  display: flex;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  cursor: pointer;
  gap: 2px;
  transition: background-color 0.3s;
  text-transform: uppercase;

  color: #fff;

  &:hover {
    background-color:  ${props => props.theme.colorPrimary400};
  }

  &:active {
    background-color: ${props => props.theme.colorPrimaryActive};
    transition: background-color 0.1s;
  }
`;

const TextWrapper = styled.div`margin: 1px 0px 0px 0px`

export function IconButton({
  text = "",
  iconName,
  onClick,
  callback
}) {

  const props = { onClick, callback }

  return (
    <ButtonWrapper {...props}>
      <EvaIcon name={iconName} />
      <TextWrapper>
        <FormattedMessage id={text} />
      </TextWrapper>
    </ButtonWrapper>
  );
}
