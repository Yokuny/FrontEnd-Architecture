import React from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import Col from "@paljs/ui/Col";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table"
import { LabelIcon, TextSpan } from "../../../../components";


export default function CollaboratorsList({ data }) {
  return <>
    {!!data.collaborators?.length &&
      <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
        <LabelIcon
          title={<FormattedMessage id="collaborator.info" />}
        />
        <TABLE>
          <THEAD>
            <TRH>
              <TH textAlign="center" key={`col-Zw-1`}>
                <TextSpan apparence='s2' hint>
                  <FormattedMessage id="suricata.collaborator.code" />
                </TextSpan>
              </TH>
              <TH textAlign="center" key={`col-Zw-1`}>
                <TextSpan apparence='s2' hint>
                  <FormattedMessage id="name" />
                </TextSpan>
              </TH>
              <TH textAlign="center" key={`col-Zw-1`}>
                <TextSpan apparence='s2' hint>
                  <FormattedMessage id="role" />
                </TextSpan>
              </TH>
              <TH textAlign="center" key={`col-Zw-1`}>
                <TextSpan apparence='s2' hint>
                  <FormattedMessage id="fas.aso.expiration" />
                </TextSpan>
              </TH>
              <TH textAlign="center" key={`col-Zw-1`}>
                <TextSpan apparence='s2' hint>
                  <FormattedMessage id="fas.valid" />
                </TextSpan>
              </TH>
              <TH textAlign="center" key={`col-Zw-1`}>
                <TextSpan apparence='s2' hint>
                  <FormattedMessage id="new" />
                </TextSpan>
              </TH>
            </TRH>
          </THEAD>
          <TBODY>
            {data?.collaborators?.map(({ _id, ...collaborator }, i) => <TR key={i} isEvenColor={i % 2 === 0} >
              {Object.values(collaborator).map((column, j) =>
                <TD key={`col-fWt-${collaborator}-${column}`} textAlign="center">
                  <TextSpan apparence="p2">{typeof (column) === "boolean" ?
                    column ? <FormattedMessage id="yes" /> : <FormattedMessage id="not" />
                    : column === data.collaborators[i].AsoExpirationDate ? moment(column).format('DD/MM/YYYY') : column}
                  </TextSpan>
                </TD>
              )}
            </TR>)}
          </TBODY>
        </TABLE>
      </Col>}
  </>
}
