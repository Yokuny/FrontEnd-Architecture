import { EvaIcon } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import TextSpan from "../Text/TextSpan";
const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export default function LabelIcon({
  iconName,
  title,
  renderIcon = undefined,
  renderTitle = undefined,
  titleApparence = "p2",
  className = "",
  mandatory = false,
  styleText = {},
}) {
  const theme = useTheme();

  return (
    <>
      <RowRead className={className}>
        {renderIcon ? (
          renderIcon()
        ) : iconName ? (
          <EvaIcon
            name={iconName}
            className="mt-1"
            options={{
              height: 17,
              width: 16,
              fill: theme.colorBasic600,
            }}
          />
        ) : (
          <></>
        )}
        {renderTitle ? (
          renderTitle()
        ) : (
          <TextSpan
            apparence={titleApparence}
            style={{ color: theme.colorBasic600, marginTop: 0.5, ...styleText }}
          >
            {title}
          </TextSpan>
        )}

        {mandatory && (
          <TextSpan style={{ marginLeft: 0.6 }} hint>*</TextSpan>
        )}
      </RowRead>
    </>
  );
}
