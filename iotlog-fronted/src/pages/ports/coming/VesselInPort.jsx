import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import styled, { useTheme } from "styled-components";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../components/Utils"
import { Crane } from "../../../components/Icons";
import { Countries } from "../../../components/Select/country/Countries";
import { LabelIcon, TextSpan } from "../../../components";
import { TABLE, TBODY, TD, THEAD, TR, TRH } from "../../../components/Table";

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  width: 100% !important;
  max-height: 800px;
  overflow-y: auto;
`;

export function VesselInPort(props) {
  const { data, typeFilter } = props;
  const intl = useIntl();
  const theme = useTheme();

  const dataFiltered = data?.filter((x) =>
    typeFilter?.length
      ? typeFilter?.map((y) => y?.value).includes(x.vessel?.segment?.label)
      : true
  );

  return (
    <>
      <div className="mt-4"></div>
      <LabelIcon
        title={`${intl.formatMessage({ id: "port.vessels.in_port" })} = ${dataFiltered.length}`}
        renderIcon={() => (
          <Crane
            style={{
              height: 13,
              width: 13,
              fill: theme.textHintColor,
              marginRight: 5,
              marginTop: 2,
              marginBottom: 2,
            }}
          />
        )}
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
              ?.sort((a, b) => a.vessel?.name?.localeCompare(b.vessel?.name))
              ?.map((x, i) => {
                const codeFlag = Countries?.find(
                  (c) => c.name?.toLowerCase() === x.vessel?.flag?.toLowerCase()
                )?.code;

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
              {!dataFiltered.length && <TR>
                <TD colSpan={4}>
                  <TextSpan apparence="p2" className="text-center">
                    <FormattedMessage id="no_data" />
                  </TextSpan>
                </TD>
              </TR>}
          </TBODY>
        </TABLE>
      </RowFlex>
    </>
  );
}
