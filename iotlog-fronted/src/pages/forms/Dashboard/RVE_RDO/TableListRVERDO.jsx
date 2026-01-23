import { FormattedMessage } from "react-intl";
import moment from "moment";
import React from "react";
import { TextSpan } from "../../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";
import { calculateTimeDifference, floatToStringExtendDot } from "../../../../components/Utils";
import { EvaIcon, Row } from "@paljs/ui";

export default function TableListRVERDO(props) {
  const { data, key, unit } = props;

  return <>
    <TABLE>
      <THEAD>
        <TRH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="date" />
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ maxWidth: "100px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="consumption" /> <FormattedMessage id="estimated" /> ({unit})
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ maxWidth: "100px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="consumption.max" />
              <br />
              <FormattedMessage id="day" /> ({unit})
            </TextSpan>
          </TH>
          <TH textAlign="end">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="diff" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="operation" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="start" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="end" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="duration" />
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ width: "100px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="consumption.max" />
              <br />
              <FormattedMessage id="operation" /> ({unit})
            </TextSpan>
          </TH>
        </TRH>
      </THEAD>
      <TBODY>
        {data
          ?.sort((a, b) => b.date - a.date)
          ?.map((item, index) => {
            const maxInThisDay = item
              .operations
              .reduce((acc, operation) => acc +
                (operation?.consumptionDailyContract
                  ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
                  : 0),
                0)

            const status = maxInThisDay === 0
              ? "Basic"
              : maxInThisDay <= item.consumptionEstimated ? "Danger" : "Success"

            return item?.operations?.map((operation, indexOp) => {
              return <TR key={`${indexOp}+${index}+${key}`} isEvenColor={index % 2 === 0}>
                {indexOp === 0 &&
                  <>
                    <TD textAlign="center" rowSpan={item.operations.length} colSpan={1}>
                      <TextSpan apparence="p2">
                        {moment(item.date).format("DD MMM")}
                      </TextSpan>
                    </TD>
                    <TD textAlign="end" rowSpan={item.operations.length} colSpan={1}>
                      {item.consumptionEstimated === undefined
                        ? <>
                          <Row middle="xs" end="xs">
                            <EvaIcon
                              name="alert-circle-outline"
                              status="Warning"
                              className="mr-1"
                              options={{
                                height: "1rem"
                              }}
                            />
                            <TextSpan apparence="p3"
                              className="mr-4 mb-1"
                              status="Warning">
                              <FormattedMessage id="not.provided" />
                            </TextSpan>
                          </Row>
                        </>
                        : <TextSpan apparence="p2">
                          {floatToStringExtendDot(item.consumptionEstimated, 3)}
                        </TextSpan>}
                    </TD>
                    <TD textAlign="end" rowSpan={item.operations.length} colSpan={1}>
                      <TextSpan apparence="p2">
                        {maxInThisDay === undefined
                          ? "-"
                          : floatToStringExtendDot(maxInThisDay, 3)}
                      </TextSpan>
                    </TD>
                    <TD textAlign="end" rowSpan={item.operations.length} colSpan={1}>
                      <TextSpan apparence="s2"
                        status={!item.consumptionEstimated ? "Basic" : status}>
                        {floatToStringExtendDot(
                          100 - ((maxInThisDay / item.consumptionEstimated) * 100), 2)} %
                      </TextSpan>
                      <br />
                      <TextSpan apparence="p2"
                        status={!item.consumptionEstimated ? "Basic" : status}>
                        {floatToStringExtendDot(unit === "m³"
                          ? item.consumptionEstimated - maxInThisDay
                          : (item.consumptionEstimated - maxInThisDay) * 1000, 2)} {unit}
                      </TextSpan>
                    </TD>
                  </>}
                <TD textAlign="center">
                  <TextSpan apparence="p2">
                    {operation?.code || ""}
                  </TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="p2">
                    {moment(operation?.dateStart).format("HH:mm")}
                  </TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="p2">
                    {moment(operation?.dateEnd).format("HH:mm")}
                  </TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">
                    {calculateTimeDifference(
                      operation?.dateEnd,
                      operation?.dateStart)}
                  </TextSpan>
                </TD>
                <TD textAlign="end">
                  <TextSpan apparence="s2">
                    {floatToStringExtendDot(
                      unit === "m³"
                        ? (operation?.consumptionDailyContract / 24) * operation?.diffInHours
                        : ((operation?.consumptionDailyContract / 24) * operation?.diffInHours) * 1000,
                      2)}
                  </TextSpan>
                </TD>
              </TR>
            })
          })}
      </TBODY>
    </TABLE>
  </>
}
