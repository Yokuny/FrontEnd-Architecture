import styled, { useTheme } from "styled-components";
import { EvaIcon } from "@paljs/ui";
import {
  TextSpan,
} from "../../../components";
import {
  TD,
} from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";

const RowSCenter = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;

const ColStart = styled.div`
  align-items: flex-start;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const POSIDON_ID = '66522106-ccb4-4508-a90b-c1486d95cb78'

export const HeaderContract = ({
  data
}) => {
  const idEnterprise = localStorage.getItem("id_enterprise_filter");
  return (<>
    {!!data?.isAdministrator &&
      data.typeForm === "RVE" &&
      idEnterprise !== POSIDON_ID &&
      (
        <>
          <TD textAlign="center">
            <TextSpan apparence="s2" hint>
              Contrato
              <br />
              <TextSpan apparence="p2" hint>
                (m³/dia)
              </TextSpan>
            </TextSpan>
          </TD>
          <TD textAlign="center">
            <TextSpan apparence="s2" hint>
              Diferença
              <br />
              <TextSpan apparence="p2" hint>
                (m³ e %)
              </TextSpan>
            </TextSpan>
          </TD>
        </>
      )}
  </>
  )
}



export const BodyContract = ({ itemData, data }) => {
  const theme = useTheme();

  const calcDealComsuption = (deal, daily) => {
    if (daily < deal) {
      return (
        <RowSCenter>
          <EvaIcon name="trending-down-outline" status="Success" />
          <ColStart className="ml-2">
            <TextSpan apparence="s2" style={{ color: theme.colorSuccess500 }}>
              {`${floatToStringExtendDot((deal - daily) * -1, 1)}`}
            </TextSpan>
            <TextSpan apparence="p3" style={{ color: theme.colorSuccess500 }}>
              {floatToStringExtendDot((daily * 100) / deal, 1)}%
            </TextSpan>
          </ColStart>
        </RowSCenter>
      );
    }
    if (daily > deal) {
      return (
        <RowSCenter>
          <EvaIcon name="trending-up-outline" status="Danger" />
          <ColStart className="ml-2">
            <TextSpan apparence="s2" style={{ color: theme.colorDanger500 }}>
              +{floatToStringExtendDot((deal - daily) * -1, 1)}
            </TextSpan>
            <TextSpan apparence="p3" style={{ color: theme.colorDanger500 }}>
              {floatToStringExtendDot((daily * 100) / deal, 1)}%
            </TextSpan>
          </ColStart>
        </RowSCenter>
      );
    }
  };

  const idEnterprise = localStorage.getItem("id_enterprise_filter");
  return (<>
    {!!data?.isAdministrator &&
      data.typeForm === "RVE" &&
      idEnterprise !== POSIDON_ID &&
      <>
        <TD textAlign="center">
          <TextSpan apparence="s2">
            {floatToStringExtendDot(
              itemData?.dealComsuption || 0,
              2
            )}
          </TextSpan>
        </TD>
        <TD textAlign="center" style={{ minWidth: 80 }}>
          {calcDealComsuption(
            itemData?.dealComsuption || 0,
            itemData.data?.consumoDiario || 0
          )}
        </TD>
      </>}
  </>
  )
}
