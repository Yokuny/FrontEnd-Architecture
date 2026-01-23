import { EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { IconBorder } from "../../../components/Icons/IconRounded";
import { TH, THEAD, TR, TRH } from "../../../components/Table";
import { getIcon } from "../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";

const Row = styled.a`
  ${({ theme }) => css`
    color: ${theme.textBasicColor};
  `}

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`;

const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  .position-col-dynamic {
    justify-content: flex-end;
  }

  position: sticky;
  top: 0;

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
  }
`;

export default function HeaderStatistic(props) {
  const { listStatusAllow, orderColumn } = props;
  const theme = useTheme();

  const changeOrder = (newColumn) => {
    if (orderColumn?.column !== newColumn)
      props.setOrderColumn({ column: newColumn, order: "desc" });
    else if (orderColumn?.column === newColumn && orderColumn?.order === "desc")
      props.setOrderColumn({ column: newColumn, order: "asc" });
    else props.setOrderColumn(undefined);
  };

  return (
    <>
      {!!listStatusAllow.length && (
        <TheadStyle>
          <TRH>
            <TH className="p-2" textAlign="center">
              <TextSpan apparence="s1" hint>
                <FormattedMessage id="machine" />
              </TextSpan>
            </TH>
            {listStatusAllow?.map((x, i) => {
              const iconProps = getIcon(x, theme, true);
              return (
                  <TH key={`h-${i}`} className="p-4">
                    <Row className="position-col-dynamic" style={{ margin: 0 }} onClick={() => changeOrder(x)}>
                      <IconBorder
                        color="transparent"
                        style={{ padding: 3, fill: iconProps.bgColor }}
                      >
                        {iconProps.component}
                      </IconBorder>
                      <TextSpan apparence="s1" className="ml-2" hint>
                        <FormattedMessage id={iconProps.text} />
                      </TextSpan>
                      {orderColumn?.column === x && (
                        <EvaIcon
                          name={`arrow-${
                            orderColumn?.order === "asc" ? "up" : "down"
                          }`}
                        />
                      )}
                    </Row>
                  </TH>
              );
            })}
            <TH style={{ textAlign: "center" }} className="p-2">
              <TextSpan apparence="s1" hint>
                <FormattedMessage id="total" />
              </TextSpan>
            </TH>
          </TRH>
        </TheadStyle>
      )}
    </>
  );
}
