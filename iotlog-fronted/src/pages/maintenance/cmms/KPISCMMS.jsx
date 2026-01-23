import { Card, CardBody, CardHeader, Col, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { Fetch, TextSpan } from "../../../components";
import ChartPie from "./ChartPie";
import ChartTaskOpenByVessel from "./ChartTaskOpenByVessel";
import ChartIndexConfiability from "./ChartIndexConfiability";
import ChartGroupConfiability from "./ChartGroupConfiability";
import { SkeletonThemed } from "../../../components/Skeleton";
import Filter from "../../forms/Filled/Filter";

export default function KPISCMMS() {

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  const [searchParams] = useSearchParams();
  const intl = useIntl();

  React.useEffect(() => {
    getData();
  }, [searchParams]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const query = []
      if (searchParams.get("machines")) {
        query.push(`idMachines=${searchParams.get("machines")}`);
      }
      if (searchParams.get("initialDate")) {
        query.push(`min=${searchParams.get("initialDate")}`);
      }
      if (searchParams.get("finalDate")) {
        query.push(`max=${searchParams.get("finalDate")}`);
      }
      if (searchParams.get("status")) {
        query.push(`status=${searchParams.get("status")}`);
      }
      if (searchParams.get("tipoManutencao")) {
        query.push(`tipoManutencao=${searchParams.get("tipoManutencao")}`);
      }
      if (searchParams.get("equipmentCritical")) {
        query.push(`equipmentCritical=${searchParams.get("equipmentCritical")}`);
      }
      query.push(`idEnterprise=${localStorage.getItem("id_enterprise_filter")}`);

      const responseCMMS = await Fetch.get(`/formdata/data/cad37398-1a88-4538-ae6c-2be7ce4377f8?fieldDate=dataAbertura&isNotDeletedDate=true&${query.join("&")}`)
      setData(
        (responseCMMS?.data || [])
        .map(x => ({
          ...x,
          tipoManutencao: x.tipoManutencao || intl.formatMessage({ id: "undefined" }),
        }))
      );
      setIsLoading(false);
    }
    catch (error) {
      setIsLoading(false);
    }
  }

  const osOpen = data?.filter(x => !x.dataConclusao);
  const osClosed = data?.filter(x => x.dataConclusao);

  const osExpired = data?.filter(x =>
    x.manutencaoVencida === "Sim" ||
    x.tipoManutencao === "Corretiva Oriunda de Preditiva"
  );

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            KPI`s CMMS
          </TextSpan>
          <Row className="mb-0">
            <Col breakPoint={{ xs: 12, md: 12 }} className="pb-0">
              <Filter
                isDisabled={isLoading}
              />
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          {isLoading
            ?
            <>
              <SkeletonThemed height={150} />
              <div className="mt-4" />
              <SkeletonThemed height={130} />
              <div className="mt-4" />
              <SkeletonThemed height={190} />
            </>
            :
            <>
              <Row>
                <Col breakPoint={{ xs: 12, md: 6 }}>
                  <ChartIndexConfiability
                    data={osOpen}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 6 }}>
                  <ChartGroupConfiability
                    data={osOpen}
                  />
                </Col>
                {/* <Col breakPoint={{ xs: 12, md: 8 }}>
                  <ChartOrderByMonth
                    data={data}
                  />
                </Col> */}
                <Col breakPoint={{ xs: 12, md: 4 }}>
                  <ChartPie
                    themeColors={["Warning", "Success"]}
                    descriptionValues={["Abertas", "Concluídas"]}
                    title={"Tarefas Abertas X Concluídas"}
                    series={[
                      osOpen?.length || 0,
                      osClosed?.length || 0
                    ]}
                    dataByType={{
                      "Abertas": osOpen,
                      "Concluídas": osClosed
                    }}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 8 }}>
                  <ChartTaskOpenByVessel
                    data={osOpen}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 4 }}>
                  <ChartPie
                    themeColors={["Danger", "Success"]}
                    descriptionValues={["Desvio aberto", "Desvio executado"]}
                    title={"Desvio preditivos"}
                    series={[osExpired
                      ?.filter(x => !x.dataConclusao)
                      ?.length || 0,
                    osExpired
                      ?.filter(x => x.dataConclusao)
                      ?.length || 0]}
                    dataByType={{
                      "Desvio aberto": osExpired?.filter(x => !x.dataConclusao),
                      "Desvio executado": osExpired?.filter(x => x.dataConclusao)
                    }}
                  />
                </Col>
              </Row>
            </>}
        </CardBody>
      </Card>
    </>
  );
}
