import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, TextSpan } from "../../../components";
import { TABLE, TBODY, TD, THEAD, TR, TRH } from "../../../components/Table";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import { Badge } from "@paljs/ui";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../components/Utils";
import styled from "styled-components";
import { Countries } from "../../../components/Select/country/Countries";

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  width: 100% !important;
  max-height: 800px;
  overflow-y: auto;
`;

export function VesselComing(props) {
  const { data, typeFilter } = props;
  const intl = useIntl();

  const dataFiltered = data?.filter((x) =>
    typeFilter?.length
      ? typeFilter?.map((y) => y?.value).includes(x.vessel?.segment?.label)
      : true
  );

  return (
    <>
      <div className="mt-4"></div>
      <LabelIcon
        title={`${intl.formatMessage({ id: "port.vessels.coming" })} = ${dataFiltered.length}`}
        iconName="arrow-circle-down-outline"
      />
      <RowFlex className="pb-4">
        <TABLE style={{ height: dataFiltered?.length <= 2 ? "100px" : "200px", overflow: "scroll" }}>
          <THEAD>
            <TRH>
              <TD>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="vessel" />
                </TextSpan>
              </TD>
              <TD>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="type" />
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="p2" hint>
                  ETA
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="p2" hint>
                  Status
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="distance" /> (nm)
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2" hint>
                  SOG (knots)
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2" hint>
                  TEU
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2" hint>
                  Deadweight
                </TextSpan>
              </TD>
            </TRH>
          </THEAD>
          <TBODY>
            {dataFiltered
              ?.sort((a, b) => a.vessel?.distance - b.vessel?.distance)
              ?.map((x, i) => {
                const codeFlag = Countries?.find(
                  (c) => c.name?.toLowerCase() === x.vessel?.flag?.toLowerCase()
                )?.code;
                const delayed =
                  x.vessel.aisReport?.eta &&
                  moment(x.vessel.aisReport?.eta).isBefore(moment()) &&
                  x.vessel.distance > 50;
                const near = !delayed && x.vessel.distance < 50;
                return (
                  <TR isEvenColor={i % 2 === 0} key={i}>
                    <TD>
                      <ReactCountryFlag
                        countryCode={codeFlag}
                        svg
                        style={{ marginTop: -3, fontSize: "1.2em" }}
                      />
                      <TextSpan apparence="s2" className="ml-2">
                        {x.vessel.name}
                      </TextSpan>
                    </TD>
                    <TD>
                      <TextSpan apparence="p2" className="ml-2">
                        {x.vessel.segment?.label}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan
                        apparence="s2"
                        status={delayed ? "Danger" : ""}
                        className="ml-2"
                      >
                        {x.vessel.aisReport?.eta
                          ? moment(x.vessel.aisReport?.eta).format(
                              "DD MMM, HH:mm"
                            )
                          : "-"}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <Badge
                        style={{ position: "relative" }}
                        status={delayed ? "Danger" : near ? "Primary" : "Basic"}
                      >
                        {intl.formatMessage({
                          id: delayed ? "late" : near ? "next" : "scheduled",
                        })}
                      </Badge>
                    </TD>
                    <TD textAlign="end">
                      <TextSpan apparence="s2">
                        {floatToStringExtendDot(x.vessel.distance, 1)}
                      </TextSpan>
                    </TD>
                    <TD textAlign="end">
                      <TextSpan apparence="p2">
                        {floatToStringExtendDot(x.vessel.ais?.sog, 1)}
                      </TextSpan>
                    </TD>
                    <TD textAlign="end">
                      <TextSpan apparence="p2">
                        {x.vessel.teu ? x.vessel.teu : ""}
                      </TextSpan>
                    </TD>
                    <TD textAlign="end">
                      <TextSpan apparence="p2">
                        {floatToStringBrazilian(x.vessel.dwtSummer, 1)}
                      </TextSpan>
                    </TD>
                  </TR>
                );
              })}
            {!dataFiltered.length && (
              <TR>
                <TD colSpan="8">
                  <TextSpan apparence="p2" className="ml-2">
                    <FormattedMessage id="nooptions.message" />
                  </TextSpan>
                </TD>
              </TR>
            )}
          </TBODY>
        </TABLE>
      </RowFlex>
    </>
  );
}
