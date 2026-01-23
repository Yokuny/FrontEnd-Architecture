import React from "react"
import { FormattedMessage } from "react-intl"
import Col from "@paljs/ui/Col"
import Row from "@paljs/ui/Row";
import { getExpensesTotalValue } from "../../../../components/Fas/Utils/Bms";
import { LabelIcon, TextSpan } from "../../../../components"
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table"
import { floatToStringExtendDot } from "../../../../components/Utils"
import moment from "moment"

export default function OtherExpensesBMS({ data }) {
  return (<>
    {!!data.bms?.other_expenses?.length &&
      <>
        <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="fas.other.expenses" />}
          />
          <TABLE>
            <THEAD>
              <TRH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="date" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense.start.time" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense.end.time" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense.collaborator.name" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="additional.info" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense.unit" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense.value" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="fas.expense.amount" />
                  </TextSpan>
                </TH>
                <TH textAlign="center" key={`col-zW-1`}>
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="total" />
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
            <TBODY>
              {data.bms?.other_expenses?.map(({ _id, ...expense }, i) =>
                <TR key={i} isEvenColor={i % 2 === 0} >
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.date ? moment(expense?.date).format("DD MMM YYYY") : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.startTime ? moment(expense?.startTime).format("HH:mm") : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.endTime ? moment(expense?.endTime).format("HH:mm") : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.expense ? expense?.expense : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.collaborator_name ? expense?.collaborator_name : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.additional_info ? expense?.additional_info : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.unit ? expense?.unit : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.value ? `R$ ${floatToStringExtendDot(expense?.value)}` : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.amount ? expense?.amount : ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2" className="pl-1">
                      {expense?.total ? `R$ ${floatToStringExtendDot(expense?.total)}` : ""}
                    </TextSpan>
                  </TD>
                </TR>
              )}
              <TR>
                <TD
                  colspan={10}
                >
                  <Row end="xs" className="m-0 pt-3 pr-2">
                    <LabelIcon
                      title={<FormattedMessage id="fas.other.expenses.total" />}
                    />
                    <TextSpan apparence="s2" className="pl-1">
                      {`R$ ${getExpensesTotalValue(data?.bms?.other_expenses)}`}
                    </TextSpan>
                  </Row>
                </TD>
              </TR>
            </TBODY>
          </TABLE>
        </Col>
      </>}
  </>
  )
}
