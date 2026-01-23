import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import Filter from "./Filter";
import Availability from "./charts/Availability";
import Quality from "./charts/Quality";
import Performance from "./charts/Performance";
import OEEChart from "./charts/OEE";
import { TextSpan } from "../../components";
import { Fetch } from "../../components";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { normalizeRVEDataByMonth } from "./utils/OEEUtils";
import { brokenByDay, brokenList } from "../statistics/inoperability/services/UtilsService";
import { SkeletonThemed } from "../../components/Skeleton";

export default function OEE() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [oeeData, setOEEData] = useState({ statusList: [] });
  const [rveData, setRveData] = useState({ monthlyData: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const machines = searchParams.get("machines");
    let initialDate = searchParams.get("initialDate");
    let finalDate = searchParams.get("finalDate");
    const idEnterprise = localStorage.getItem("id_enterprise_filter");

    // Se não houver datas definidas, define período de 6 meses
    if (!initialDate || !finalDate) {
      finalDate = moment().subtract(1, 'day').format('YYYY-MM-DDT23:59:59Z');
      initialDate = moment().subtract(6, 'months').format('YYYY-MM-DDT00:00:00Z');

      // Atualiza os parâmetros de busca com as novas datas
      const currentParams = Object.fromEntries(searchParams.entries());
      setSearchParams({
        ...currentParams,
        initialDate,
        finalDate
      });
      return; // Retorna aqui pois o setSearchParams vai triggar outro useEffect
    }

    // Buscar dados se houver idEnterprise
    if (idEnterprise && machines?.length) {
      getData(idEnterprise, machines, initialDate, finalDate);
    }
  }, [searchParams]);

  const getData = async (idEnterprise, machines, initialDate, finalDate) => {
    setIsLoading(true);
    await fetchOEEData(idEnterprise, machines, initialDate, finalDate);
    await fetchRVEData(idEnterprise, machines, initialDate, finalDate);
    setIsLoading(false);
  }

  const fetchOEEData = async (idEnterprise, machines, initialDate, finalDate) => {
    let requestQuery = [];

    try {
      if (!idEnterprise) {
        return;
      }

      requestQuery = [`idEnterprise=${idEnterprise}`, 'view=simple'];

      if (machines) {
        requestQuery.push(`idMachine=${machines}`);
      }

      if (initialDate && finalDate) {
        requestQuery.push(`initialDate=${moment(initialDate).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')}`);
        requestQuery.push(`finalDate=${moment(finalDate).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')}`);
      }

      requestQuery.push(`timezone=${moment().format("Z")}`);

      const url = `/assetstatus/chartdata?${requestQuery.join("&")}`;
      const response = await Fetch.get(url);
      const data = brokenByDay(response.data, moment(finalDate).format("YYYY-MM-DD"));
      setOEEData(data);
    } catch (error) {
      setOEEData({
        statusList: []
      });
    } finally {
    }
  };

  const fetchRVEData = async (idEnterprise, machines, initialDate, finalDate) => {
    try {

      const formattedInitialDate = moment(initialDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
      const formattedFinalDate = moment(finalDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');

      const chartQuery = new URLSearchParams({
        initialDate: formattedInitialDate,
        finalDate: formattedFinalDate
      });

      chartQuery.set('idEnterprise', idEnterprise);

      if (machines) {
        chartQuery.set('machines', machines);
      }

      const chartUrl = `/formdata/chartdata?${chartQuery.toString()}`;

      const rveResponse = await Fetch.get(chartUrl);

      if (Array.isArray(rveResponse.data)) {
        const normalizedRVEData = normalizeRVEDataByMonth(
          rveResponse.data?.map(item => ({
            data: {
              embarcacao: item[0],
              codigoOperacional: {
                value: item[1],
              },
              dataHoraInicio: new Date(item[2] * 1000),
              dataHoraFim: new Date(item[3] * 1000),
            }
          })),
          finalDate);
        setRveData(normalizedRVEData);
      } else {
        setRveData({ monthlyData: [] })
      }
    } catch (error) {
      setRveData({ monthlyData: [] });
    }
  };


  return (
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="oee" />
        </TextSpan>
      </CardHeader>
      <CardBody>
        {isLoading
          ? <>
            <Row>
              <Col breakPoint={{ xs: 12 }} className="mb-4">
                <SkeletonThemed height={250} />
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                <SkeletonThemed height={250} />
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                <SkeletonThemed height={250} />
              </Col>
              <Col breakPoint={{ xs: 12 }}>
                <SkeletonThemed height={250} />
              </Col>
            </Row>
          </>
          : <>
            <Filter />
            {(!!oeeData?.statusList?.length || !!rveData?.monthlyData?.length) && <Row>
              <Col breakPoint={{ xs: 12 }} className="mb-4">
                <Availability
                  data={oeeData?.statusList}
                />
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                <Quality data={oeeData?.statusList} />
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                <Performance
                  rveData={rveData}
                  rawData={oeeData?.statusList} />
              </Col>
              <Col breakPoint={{ xs: 12 }}>
                <OEEChart rawData={oeeData?.statusList}
                  rveData={rveData} />
              </Col>
            </Row>}
          </>
        }
      </CardBody>
    </Card>
  );
}
