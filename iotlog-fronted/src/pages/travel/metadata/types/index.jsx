import { Accordion, AccordionItem, Col, EvaIcon } from "@paljs/ui";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { TextSpan } from "../../../../components";
import ConsumeTypeReport from "./consume";
import Arrival from "./arrival";
import Departure from "./departure";

export default function ReportTypes() {
  const intl = useIntl();
  const theme = useTheme();
  return (
    <>
      <Col breakPoint={{ md: 12 }} className="mt-2 mb-4">
        <Accordion style={{ padding: 0 }}>
          <AccordionItem
            key="departure"
            uniqueKey="departure"
            style={{ padding: 0 }}
            title={
              <>
                <EvaIcon
                  name="file-text-outline"
                  options={{ fill: theme.colorDanger500 }}
                />

                <TextSpan className="ml-2" apparence="s1">
                  {intl.formatMessage({ id: "departure.report" })}
                </TextSpan>
              </>
            }
          >
            <Departure />
          </AccordionItem>
          <AccordionItem
            key="arrival"
            uniqueKey="arrival"
            style={{ padding: 0 }}
            title={
              <>
                <EvaIcon
                  name="file-text-outline"
                  options={{ fill: theme.colorSuccess500 }}
                />

                <TextSpan className="ml-2" apparence="s1">
                  {intl.formatMessage({ id: "arrival.report" })}
                </TextSpan>
              </>
            }
          >
            <Arrival />
          </AccordionItem>

          <ConsumeTypeReport />

        </Accordion>
      </Col>
    </>
  );
}
