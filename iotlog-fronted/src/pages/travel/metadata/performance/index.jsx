import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { TextSpan } from "../../../../components";
import { InputDecimal } from "../../../../components/Inputs/InputDecimal";
import { getIsShowBarge } from "../common";

export default function PerformanceReport(props) {
  const intl = useIntl();
  const { onChangeData, machine, dataPerformance } = props;

  const isShowBarge = getIsShowBarge(machine?.model?.description);

  return (
    <>
      <Row style={{ margin: 0 }}>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="avg.wind" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataPerformance?.avgWind}
              onChange={(e) => onChangeData("avgWind", e)}
              placeholder={intl.formatMessage({ id: "avg.wind" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="speed" /> (
            <FormattedMessage id="max.contraction" />)
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataPerformance?.maxSpeed}
              onChange={(e) => onChangeData("maxSpeed", e)}
              placeholder={`${intl.formatMessage({
                id: "speed",
              })} (${intl.formatMessage({ id: "max.contraction" })})`}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="speed" /> (
            <FormattedMessage id="avg.contraction" />)
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataPerformance?.avgSpeed}
              onChange={(e) => onChangeData("avgSpeed", e)}
              placeholder={`${intl.formatMessage({
                id: "speed",
              })} (${intl.formatMessage({ id: "avg.contraction" })})`}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="speed" /> (
            <FormattedMessage id="min.contraction" />)
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataPerformance?.minSpeed}
              onChange={(e) => onChangeData("minSpeed", e)}
              placeholder={`${intl.formatMessage({
                id: "speed",
              })} (${intl.formatMessage({ id: "min.contraction" })})`}
            />
          </InputGroup>
        </Col>

        {isShowBarge ? (
          <>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="average" /> RPM MCP BB
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <InputDecimal
                  value={dataPerformance?.avgRpmMcpBB}
                  onChange={(e) => onChangeData("avgRpmMcpBB", e)}
                  placeholder={`${intl.formatMessage({
                    id: "average",
                  })} RPM MCP BB`}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="average" /> RPM MCP BE
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <InputDecimal
                  value={dataPerformance?.avgRpmMcpBE}
                  onChange={(e) => onChangeData("avgRpmMcpBE", e)}
                  placeholder={`${intl.formatMessage({
                    id: "average",
                  })} RPM MCP BE`}
                />
              </InputGroup>
            </Col>
          </>
        ) : (
          <Col breakPoint={{ md: 3 }} className="mb-4">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="average" /> RPM MCP
            </TextSpan>
            <InputGroup fullWidth className="mt-1">
              <InputDecimal
                value={dataPerformance?.avgRpmMcp}
                onChange={(e) => onChangeData("avgRpmMcp", e)}
                placeholder={`${intl.formatMessage({
                  id: "average",
                })} RPM MCP`}
              />
            </InputGroup>
          </Col>
        )}
      </Row>
    </>
  );
}
