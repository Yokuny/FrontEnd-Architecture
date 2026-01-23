import React from "react";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import moment from "moment";
import styled from "styled-components";
import { Button, Card, Col, EvaIcon, Popover, Row } from "@paljs/ui";
import DateTime from "../../../DateTime";
import TextSpan from "../../../Text/TextSpan";
import { FormattedMessage } from "react-intl";

const ContainerRow = styled(Row)`
  z-index: 9;
  display: flex;
  flex-direction: row;

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;

  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;

const DataTableWrapper = (props) => {
  const { data, height, width } = props;

  const [dataTable, setDataTable] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [dateInit, setDateInit] = React.useState(moment().format("YYYY-MM-DD"));
  const [dateEnd, setDateEnd] = React.useState(moment().format("YYYY-MM-DD"));

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/chart/datatable?idChart=${props.id}&min=${moment(dateInit)
        .utc()
        .format("YYYY-MM-DD")}&max=${moment(dateEnd)
        .utc()
        .format("YYYY-MM-DD")}`
    )
      .then((response) => {
        if (response.data?.length) {
          setDataTable(response.data);
        } else {
          setDataTable([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <LoadingCard isLoading={isLoading}>
      <div
        style={{ height: "100%", width: "100%" }}
        className="card-shadow pt-1"
      >
        <Row middle="xs" center="xs" style={{ height: "20%" }}>
          {!props.activeEdit && (
            <Popover
              className="inline-block"
              trigger="click"
              placement="top"
              overlay={
                <ContainerRow className="card-show" style={{ minWidth: 100 }}>
                  <Col breakPoint={{ md: 5 }} className="mb-4">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="date.start" />
                    </TextSpan>
                    <div className="mt-1" />
                    <DateTime
                      onChangeDate={(value) => setDateInit(value)}
                      date={dateInit}
                      max={dateEnd}
                      onlyDate
                    />
                  </Col>
                  <Col breakPoint={{ md: 5 }} className="mb-4">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="date.end" />
                    </TextSpan>
                    <div className="mt-1" />
                    <DateTime
                      onChangeDate={(value) => setDateEnd(value)}
                      date={dateEnd}
                      min={dateInit}
                      onlyDate
                    />
                  </Col>
                  <Col breakPoint={{ md: 2 }} className="pt-2 col-flex-center">
                    <Button
                      size="Tiny"
                      status="Info"
                      disabled={!dateInit || !dateEnd}
                      onClick={() => getData()}
                    >
                      <EvaIcon name="search-outline" />
                    </Button>
                  </Col>
                </ContainerRow>
              }
            >
              <Button
                size="Tiny"
                style={{
                  padding: 3,
                  zIndex: 999,
                  position: "absolute",
                  left: 12,
                  top: 8,
                }}
                status="Basic"
              >
                <EvaIcon name="funnel-outline" />
              </Button>
            </Popover>
          )}
          <TextSpan apparence="s1">{data.title}</TextSpan>
        </Row>
        <div style={{ height: "80%" }}>
          <props.component
            dataTable={dataTable}
            itemsColumn={[
              {
                header: "Data",
                col: "dateServer",
              },
              {
                header: "Falha",
                col: "sensorId",
              },
              {
                header: "Máquina",
                col: "idMachine",
              },
            ]}
            title={data?.title}
            data={data}
            id={props.id}
            activeEdit={props.activeEdit}
            isMobile={props.isMobile}
          />
        </div>
      </div>
    </LoadingCard>
  );
};

export default DataTableWrapper;
