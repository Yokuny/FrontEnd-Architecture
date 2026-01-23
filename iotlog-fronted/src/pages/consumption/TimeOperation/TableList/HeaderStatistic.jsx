import { EvaIcon, Tooltip } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { TH, THEAD, TRH } from "../../../../components/Table";
import { TextSpan } from "../../../../components";
import { IconBorder } from "../../../../components/Icons/IconRounded";
import { ListType, getIcon } from "../../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { getDetailsInfoMode } from "../Info/InfoTimeOperation";

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

const THFirst = styled(TH)`
  position: sticky;
  left: 0;
  top: 0;
  z-index: 2;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  padding-left: 1rem;
  min-width: 200px;
`;

const THLast = styled(TH)`
  position: sticky;
  right: 0;
  top: 0;
  z-index: 2;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  min-width: 150px;
  padding-right: 1rem;
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
  z-index: 10;

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
  }
`;

export default function HeaderStatistic(props) {
  const { orderColumn, idEnterprise } = props;
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
      <TheadStyle>
        <TRH>
          <THFirst className="p-2" textAlign="center">
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="machine" />
            </TextSpan>
          </THFirst>
          {ListType?.map(x => x.value)?.map((x, i) => {
            const iconProps = getIcon(x, theme, true, { fill: theme?.colorBasic600 });
            const info = getDetailsInfoMode(idEnterprise, x);
            return (
              <TH key={`h-${i}`} textAlign="end" className="p-4" style={{ minWidth: 180 }}>
                <Tooltip
                  eventListener="#scrollPlacementId"
                  className="inline-block"
                  trigger="hint"
                  content={<>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="rules" />
                    </TextSpan>
                    <br />
                    {info?.rules?.map((y, idex) => (
                      <>
                        <br />
                        <TextSpan apparence="s2" key={idex + i}>
                        * {y}
                        </TextSpan>
                      </>
                    ))}
                    {info?.observation && <>
                      <br />
                      <br />
                      <TextSpan apparence="p2">
                        {info?.observation}
                      </TextSpan>
                    </>}
                  </>}
                  placement={"top"}
                >
                  <Row
                    className="position-col-dynamic" style={{ margin: 0 }} onClick={() => changeOrder(x)}>
                    <IconBorder
                      color="transparent"
                      style={{ padding: 3 }}
                    >
                      {iconProps.component}
                    </IconBorder>
                    <TextSpan apparence="p2" className="ml-1" hint>
                      <FormattedMessage id={iconProps.text} />
                    </TextSpan>
                    {orderColumn?.column === x && (
                      <EvaIcon
                        name={`arrow-${orderColumn?.order === "asc" ? "up" : "down"
                          }`}
                      />
                    )}
                  </Row>
                </Tooltip>
              </TH>
            );
          })}
          <THLast style={{ textAlign: "end" }}>
            <TextSpan apparence="s2" hint className="mr-1">
              <FormattedMessage id="total" />
            </TextSpan>
          </THLast>
        </TRH>
      </TheadStyle>
    </>
  );
}
