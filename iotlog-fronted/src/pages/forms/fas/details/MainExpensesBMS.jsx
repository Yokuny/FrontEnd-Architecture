import React from "react";
import { FormattedMessage } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { LabelIcon, TextSpan } from "../../../../components";
import { getExpensesTotalValue } from "../../../../components/Fas/Utils/Bms";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";
import moment from "moment";

export default function MainExpensesBMS({ data }) {
  return (<>
    {!!data.bms?.main_expenses?.length &&
      <>
        <TextSpan apparence="s2" hint className="ml-3">
          BMS
        </TextSpan>

        <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="fas.expenses" />}
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
                    <FormattedMessage id="role" />
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
              {data.bms?.main_expenses?.map(({ _id, ...expense }, i) =>
                <>
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
                        {expense?.role ? expense?.role : ""}
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
                        {expense?.value && expense?.amount ? `R$ ${floatToStringExtendDot(expense?.value * expense?.amount)}` : ""}
                      </TextSpan>
                    </TD>
                  </TR>
                </>
              )}
              <TR>
                <TD
                  colspan={10}
                >
                  <Row end="xs" className="m-0 pt-3 pr-2">
                    <LabelIcon
                      title={<FormattedMessage id="fas.expenses.total" />}
                    />
                    <TextSpan apparence="s2" className="pl-1">
                      {`R$ ${getExpensesTotalValue(data?.bms?.main_expenses)}`}
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
