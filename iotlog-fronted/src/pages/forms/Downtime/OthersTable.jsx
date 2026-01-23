import { Button, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../../../components";
import {
  TABLE,
  TBODY,
  TD,
  TH,
  THEAD,
  TR,
  TRH,
} from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";

export function OthersTable({ data, onRemove, onEdit }) {
  return (
    <>
      <Row center="xs" className="m-0">
        <TABLE>
          {!!data?.length && (
            <THEAD>
              <TRH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="description" />
                  </TextSpan>
                </TH>
                <TH textAlign="end" className="pr-2" style={{ width: 120 }}>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="value" /> BRL
                  </TextSpan>
                </TH>
                <TH textAlign="end" className="pr-2" style={{ width: 120 }}>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="value" /> USD
                  </TextSpan>
                </TH>
                <TH textAlign="center" style={{ width: 80 }}>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="actions" />
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
          )}
          <TBODY>
            {data?.map((event, i) => (
              <TR key={`${i}-c`} isEvenColor={i % 2 === 0}>
                <TD>
                  <TextSpan apparence="p2">{event?.description}</TextSpan>
                </TD>
                <TD textAlign="end" className="pr-3">
                  <TextSpan apparence="p2">
                  <TextSpan apparence="p2">R$</TextSpan> {floatToStringExtendDot(event?.valueBRL || 0, 2)}</TextSpan>
                </TD>
                <TD textAlign="end" className="pr-3">
                  <TextSpan apparence="p2"><TextSpan apparence="p2">US$</TextSpan> {floatToStringExtendDot(event?.valueUSD || 0, 2)}</TextSpan>
                </TD>
                <TD>
                  <Row className="m-0" around="xs">
                    <Button
                      size="Tiny"
                      status="Info"
                      appearance="ghost"
                      style={{ padding: 2 }}
                      onClick={() => onEdit(i)}
                      type="button"
                    >
                      <EvaIcon name="edit-2-outline" />
                    </Button>
                    <Button
                      size="Tiny"
                      status="Danger"
                      appearance="ghost"
                      className="ml-1"
                      style={{ padding: 2 }}
                      onClick={() => onRemove(i)}
                      type="button"
                    >
                      <EvaIcon name="trash-2-outline" />
                    </Button>
                  </Row>
                </TD>
              </TR>
            ))}
            {!!data?.length && (
              <TR>
                <TD>
                  <TextSpan apparence="c2" hint>
                    <FormattedMessage id="total" />
                  </TextSpan>
                </TD>
                <TD textAlign="end" className="pr-3">
                  <TextSpan apparence="s2">
                    <TextSpan apparence="c2">R$</TextSpan> {floatToStringExtendDot(data.reduce((acc, curr) => acc + (curr.valueBRL || 0), 0), 2)}
                  </TextSpan>
                </TD>
                <TD textAlign="end" className="pr-3">
                  <TextSpan apparence="s2">
                    <TextSpan apparence="c2">US$</TextSpan> {floatToStringExtendDot(data.reduce((acc, curr) => acc + (curr.valueUSD || 0), 0), 2)}
                  </TextSpan>
                </TD>
                <TD></TD>
              </TR>
            )}
          </TBODY>
        </TABLE>
      </Row>
    </>
  );
}
