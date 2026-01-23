import { EvaIcon } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import TextSpan from "../Text/TextSpan";

const ColRoundend = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor3};
  `}
  border-radius: 2px;
`;
const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export default function ItemInfoView({ title, description, footer, noShowIcon = false }) {
  const theme = useTheme();

  return (
    <>
      <ColRoundend className="col-flex-center">
        <RowRead className="pl-1 pr-1 pt-1">
          {!noShowIcon && <EvaIcon
            name="trending-up-outline"
            className="mt-2"
            options={{
              height: 15,
              width: 15,
              fill: theme.colorBasic600,
            }}
          />}
          <TextSpan
            apparence="p3"
            className={noShowIcon && "mt-1 mb-1"}
            hint
            style={{ lineHeight: "13px", textAlign: 'center' }}
          >
            {title}
          </TextSpan>
        </RowRead>
        <TextSpan
          style={{ fontWeight: 700 }}
          apparence="s1"
          className="text-center"
        >
          {description}
          <TextSpan
            apparence="c3"
            className="text-center mb-2 ml-1"
            style={{ lineHeight: "13px" }}
          >
            {footer}
          </TextSpan>
        </TextSpan>
         <div style={{ height: 10 }}></div>
      </ColRoundend>
    </>
  );
}
