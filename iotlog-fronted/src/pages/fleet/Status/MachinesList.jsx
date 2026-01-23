import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  Row,
} from "@paljs/ui";
import { TextSpan } from "../../../components";
import { getIconStatusOperation } from "./Utils";
import { getIcon } from "../Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { useTheme } from "styled-components";
import { FormattedMessage } from "react-intl";

export function MachinesList({ data, onClear, openMachine }) {
  const theme = useTheme();

  const isStatusOperation = getIconStatusOperation(data[0].value);
  const isStatusNavigation = getIcon(data[0].value, theme, true);

  return (
    <>
      <Card
        style={{
          background: `${theme.backgroundBasicColor1}dd`,
          border: `1px solid ${
            theme.borderBasicColor3 || theme.backgroundBasicColor3
          }`,
          zIndex: "999",
          position: "absolute",
          marginTop: "6rem",
          width: "20rem",
          minHeight: "2rem",
          maxHeight: "calc(100vh - 250px)",
        }}
      >
        <CardHeader style={{ padding: "0.5rem 1rem" }}>
          <Row between="xs" className="m-0" middle="xs">
            <TextSpan apparence="s2">
              {isStatusOperation ? (
                <>
                  <TextSpan apparence="s2" hint>
                    {isStatusOperation.icon} {isStatusOperation.label}
                  </TextSpan>
                </>
              ) : (
                <>
                  <TextSpan apparence="s2" className={"flex-between"}>
                    {isStatusNavigation.component}
                    <TextSpan apparence="s2" hint className="ml-1">
                    <FormattedMessage id={isStatusNavigation.text} />
                    </TextSpan>
                  </TextSpan>
                </>
              )}
            </TextSpan>
            <Button
              size="Tiny"
              status="Danger"
              appearance="ghost"
              onClick={onClear}
            >
              <EvaIcon name="close-outline" />
            </Button>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="m-0">
            {data?.map((item, index) => (
              <Col key={`${index}-${item.machine?.id}`} className="mb-1" onClick={() => openMachine(item)} style={{ cursor: 'pointer' }}>
                <TextSpan apparence="label">
                  {item.machine?.name}
                  {/* <TextSpan apparence="p2" hint>
                    {" "}
                    ({item.machine.id})
                  </TextSpan> */}
                </TextSpan>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
