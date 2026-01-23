import { Button, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import { useIntl } from "react-intl";
import { DeleteConfirmation, TextSpan } from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringBrazilian } from "../../../components/Utils";

export default function PtaxTable({ data, handleEdit, handleDelete }) {
  const intl = useIntl();

  return (
    <>
      <TABLE>
        <THEAD>
          <TRH>
            <TH  textAlign="center">
              <TextSpan apparence="p2" hint>
                {intl.formatMessage({ id: "date" })}
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                {intl.formatMessage({ id: "value" })}
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                {intl.formatMessage({ id: "actions" })}
              </TextSpan>
            </TH>
          </TRH>
        </THEAD>

        <TBODY>
          {data
          ?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          ?.map((ptax, index) => (
            <TR isEvenColor={index % 2 === 0}>
              <TD key={index}  textAlign="center">
                <TextSpan apparence="s2">
                  {moment(ptax.date).format("DD MMM YYYY")}
                </TextSpan>
              </TD>
              <TD key={index} textAlign="center">
                <TextSpan apparence="s2">
                  BRL {floatToStringBrazilian(ptax?.value || 0, 4)}
                </TextSpan>
              </TD>
              <TD>
                <Row center="md" className="m-0">
                  <Button
                    size="Tiny"
                    status="Basic"
                    className="mr-3"
                    style={{ padding: 1 }}
                    onClick={() => handleEdit(ptax)}
                  >
                    <EvaIcon name="edit-outline" />
                  </Button>

                  <DeleteConfirmation
                    onConfirmation={() => handleDelete(ptax.id)}
                    message={intl.formatMessage({
                      id: "delete.message.default",
                    })}
                  >
                    <Button
                      size="Tiny"
                      status="Danger"
                      appearance="ghost"
                      style={{ padding: 1 }}
                    >
                      <EvaIcon name="trash-2-outline" />
                    </Button>
                  </DeleteConfirmation>
                </Row>
              </TD>
            </TR>
          ))}
        </TBODY>
      </TABLE>
    </>
  );
}
