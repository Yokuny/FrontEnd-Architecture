import React from "react";
import { Col, Row } from "@paljs/ui";
import { useIntl } from "react-intl";
import ChartIndexConfiability from "../maintenance/cmms/ChartIndexConfiability";
import ChartPie from "../maintenance/cmms/ChartPie";
import ChartGroupConfiability from "../maintenance/cmms/ChartGroupConfiability";
import { SkeletonThemed } from "../../components/Skeleton";

const CMMSCharts = ({ cmmsData, loading }) => {
  const intl = useIntl();

  if (loading) return <Row className="m-0 pt-4 pb-4">
    <Col breakPoint={{ md: 3 }}>
      <SkeletonThemed height={300} />
    </Col>
    <Col breakPoint={{ md: 3 }}>
      <SkeletonThemed height={300} />
    </Col>
    <Col breakPoint={{ md: 3 }}>
      <SkeletonThemed height={300} />
    </Col>
    <Col breakPoint={{ md: 3 }}>
      <SkeletonThemed height={300} />
    </Col>
  </Row>;
  if (!cmmsData) return null;

  const osOpen = cmmsData?.filter(x => !x.dataConclusao);
  const osClosed = cmmsData?.filter(x => x.dataConclusao);
  const osExpired = cmmsData?.filter(x =>
    x.manutencaoVencida === "Sim" ||
    x.tipoManutencao === intl.formatMessage({ id: "corrective_from_predictive" })
  );

  return (
    <Row className="mb-1 mt-4">
      <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <ChartGroupConfiability data={osOpen} />
      </Col>
      <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
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
      <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <ChartIndexConfiability data={osOpen} />
      </Col>
      <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <ChartPie
          themeColors={["Danger", "Success"]}
          descriptionValues={["Desvio aberto", "Desvio executado"]}
          title={"Desvio preditivos"}
          series={[
            osExpired?.filter(x => !x.dataConclusao)?.length || 0,
            osExpired?.filter(x => x.dataConclusao)?.length || 0
          ]}
          dataByType={{
            "Desvio aberto": osExpired?.filter(x => !x.dataConclusao),
            "Desvio executado": osExpired?.filter(x => x.dataConclusao)
          }}
        />
      </Col>
    </Row>
  );
};

export default CMMSCharts;
