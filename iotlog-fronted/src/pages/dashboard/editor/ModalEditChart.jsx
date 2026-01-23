import React from "react";
import { Modal, TextSpan } from "../../../components";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import ListOptionsCharts from "../../../components/ChartEditor/ListOptionsCharts";
import { Button } from "@paljs/ui/Button";
import styled, { css } from "styled-components";
import { CardBody, Card, CardHeader, CardFooter } from "@paljs/ui/Card";
import { EvaIcon } from "@paljs/ui/Icon";
import ButtonSave from "./ButtonSave";
import ButtonExport from "./ButtonExport";
import { nanoid } from 'nanoid';

const ButtonCard = styled(Button)`
  text-transform: none;
  ${({ theme }) => css`
    color: ${theme.textBasicColor};
  `}
`;

const ModalEditChart = ({ show, onClose, data, showExports = false, idEnterprise = "" }) => {
  const [chartSelect, setChartSelect] = React.useState(undefined);

  React.useEffect(() => {
    if (show && data?.type) {
      const chartConfigured = ListOptionsCharts.map((x) => x.items)
        .flat()
        .find((x) => x.chart === data?.type);
      setChartSelect(chartConfigured);
    } else if (show && chartSelect) {
      setChartSelect(undefined);
    }
  }, [show, data]);

  let filterItems = ListOptionsCharts;
  if (chartSelect) {
    const chartPressed = ListOptionsCharts.find((x) =>
      x.items.some((y) => y.chart === chartSelect.chart)
    )
    filterItems = [{
      groupTitle: chartPressed?.groupTitle,
      items: [chartPressed?.items.find((y) => y.chart === chartSelect.chart)],
    }]
  }

  const renderFooter = () => {
    return chartSelect ? (
      <>
        <CardFooter>
          <Row className="mr-1 ml-1" between>
            {showExports && <ButtonExport
              type={chartSelect.chart}
            />}

            <ButtonSave
              idDashboard={data?.idDashboard}
              idGroup={data?.idGroup}
              id={data?.id}
              type={chartSelect.chart}
              onClose={onClose}
            />
          </Row>
        </CardFooter>
      </>
    ) : undefined;
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="ExtraLarge"
      title="chart.editor"
      renderFooter={renderFooter}
    >
      <Row style={{ maxHeight: "calc(100vh - 160px)" }}>
        <Col breakPoint={{ md: !!chartSelect ? 4 : 12 }}>
          {filterItems.filter(x => !x.noShow).map((chartGroup, i) => (
            <Col key={nanoid(4)} className="mb-4">
              <TextSpan apparence="h6">
                <FormattedMessage id={chartGroup.groupTitle} />
              </TextSpan>
              <CardBody
              style={{ flexDirection: "row", display: "flex",
                overflowY: "hidden",
               }}>
                {chartGroup?.items.map((chartItem, j) => (
                  <div key={nanoid(5)}>
                    <ButtonCard
                      status="Basic"
                      appearance="ghost"
                      onClick={() => setChartSelect(chartItem)}
                    >
                      <chartItem.componentDemo idEnterprise={idEnterprise} {...chartItem.props} />
                    </ButtonCard>
                  </div>
                ))}
              </CardBody>
            </Col>
          ))}
        </Col>
        {!!chartSelect && (
          <Col breakPoint={{ md: 8 }}>
            <Card>
              <CardHeader>
                <Row between className="ml-1 mr-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="options" />
                  </TextSpan>
                  <Button
                    status="Danger"
                    size="Tiny"
                    onClick={() => setChartSelect(undefined)}
                  >
                    <EvaIcon name="close-outline" />
                  </Button>
                </Row>
              </CardHeader>
              <CardBody >
                <chartSelect.optionsComponent />
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default ModalEditChart;
