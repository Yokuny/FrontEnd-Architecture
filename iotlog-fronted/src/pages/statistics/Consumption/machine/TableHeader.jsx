import { EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import { Route } from "../../../../components/Icons";
import { TH, THEAD, TR, TRH } from "../../../../components/Table";
import { HeaderOrder } from "../../Common";

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
}`

export default function TableHeader(props) {
  const { orderColumn, typeFuels, unit } = props;
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
          <TH style={{ textAlign: "center", width: 80 }} className="p-2"></TH>
          <TH className="p-2">
            <TextSpan apparence="s1">
              <FormattedMessage id="name" />
            </TextSpan>
          </TH>
          <TH className="p-2 pr-4">
            <HeaderOrder onClick={() => changeOrder("distance")} style={{ justifyContent: 'end' }}>
              <LabelIcon
                renderIcon={() => (
                  <Route
                    style={{
                      height: 14,
                      width: 14,
                      fill: theme?.colorSuccess500,
                    }}
                  />
                )}
                renderTitle={() => (
                  <TextSpan apparence="s1" className="ml-1">
                    <FormattedMessage id="distance" />
                    <TextSpan apparence="p3" className="ml-1">
                      nm
                    </TextSpan>
                  </TextSpan>
                )}
              />
              {orderColumn?.column === "distance" && (
                <EvaIcon
                  name={`arrow-${orderColumn?.order === "asc" ? "up" : "down"}`}
                />
              )}
            </HeaderOrder>
          </TH>
          <TH className="p-2 pr-4">
            <HeaderOrder onClick={() => changeOrder("hours")} style={{ justifyContent: 'end' }}>
              <LabelIcon
                renderIcon={() => (
                  <EvaIcon
                    name={"clock-outline"}
                    className="mt-1"
                    status="Warning"
                    options={{
                      height: 17,
                      width: 16,
                    }}
                  />
                )}
                renderTitle={() => (
                  <TextSpan apparence="s1">
                    <FormattedMessage id="hour.unity" />
                  </TextSpan>
                )}
              />
              {orderColumn?.column === "hours" && (
                <EvaIcon
                  name={`arrow-${orderColumn?.order === "asc" ? "up" : "down"}`}
                />
              )}
            </HeaderOrder>
          </TH>
          {typeFuels?.map((x, i) => <TH key={`he-${i}`} textAlign="end" className="p-2 pr-3">
            <HeaderOrder onClick={() => changeOrder(`consumption.${x.code}`)} style={{ justifyContent: 'end' }}>
              <LabelIcon
                renderIcon={() => (
                  <EvaIcon
                    name={"droplet"}
                    className="mt-1"
                    options={{
                      height: 17,
                      width: 16,
                      fill: x.color
                    }}
                  />
                )}
                renderTitle={() =>
                  <TextSpan apparence="s1">
                    {x.code}
                    <TextSpan apparence="p3"> {unit}</TextSpan>
                  </TextSpan>}
              />
              {orderColumn?.column === `consumption.${x.code}` && (
                <EvaIcon
                  name={`arrow-${orderColumn?.order === "asc" ? "up" : "down"}`}
                />
              )}
            </HeaderOrder>
          </TH>)}
        </TRH>
      </TheadStyle>
    </>
  );
}
