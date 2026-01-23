import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import DashboardTab from "./DashboardTab";
import NotificationStatsCards from "./NotificationStatsCards";
import { LEVEL_NOTIFICATION } from "../../../constants";
import { Fetch } from "../../../components";
import { Col, Row } from "@paljs/ui";
import { SkeletonThemed } from "../../../components/Skeleton";

export default function DataCard() {

  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState();


  const dateMin = searchParams.get("dateMin");
  const dateMax = searchParams.get("dateMax");

  useEffect(() => {
    getData();
  }, [searchParams]);

  const getData = () => {
    setIsLoading(true);
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    let url = `/notification/dashboard`;

    const params = [];

    if (dateMin) {
      params.push(`dateMin=${moment(dateMin).format('YYYY-MM-DDTHH:mm:ssZ')}`);
    }
    if (dateMax) {
      params.push(`dateMax=${moment(dateMax).format('YYYY-MM-DDTHH:mm:ssZ')}`);
    }
    if (idEnterpriseFilter) {
      params.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    const finalUrl = `${url}?${params.join("&")}`;

    Fetch.get(finalUrl)
      .then(response => {
        setData(response.data || []);
      })
      .catch(error => {

      }).finally(() => {
        setIsLoading(false);
      }
      );
  }

  const stats = {
    critical: data?.levels?.find(item => item.level === LEVEL_NOTIFICATION.CRITICAL)?.total || 0,
    warning: data?.levels?.find(item => item.level === LEVEL_NOTIFICATION.WARNING)?.total || 0,
    info: data?.levels?.find(item => item.level === LEVEL_NOTIFICATION.INFO)?.total || 0,
    total: data?.total || 0,
    unread: (data?.total || 0) - (data?.readed || 0)
  }

  if (isLoading) {
    return <>
      <Row>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <SkeletonThemed height={120} />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <SkeletonThemed height={120} />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <SkeletonThemed height={120} />
        </Col>
      </Row>
      <Row>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <SkeletonThemed height={100} />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <SkeletonThemed height={100} />
        </Col>
      </Row>
      <Row>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <SkeletonThemed height={320} />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <SkeletonThemed height={320} />
        </Col>
      </Row>
    </>
  }

  return (
    <>
      <NotificationStatsCards stats={stats} />
      <DashboardTab
        readStatus={{
          series: [
            data?.readed || 0,
            (data?.total || 0) - (data?.readed || 0)
          ]
        }}
        newStatus={{
          series: [
            data?.status?.find(n => !n.status || n.status === null || n.status === 'undefined' || n.status === 'pending')?.total || 0,
            data?.status?.find(n => n.status === 'in_progress')?.total || 0,
            data?.status?.find(n => n.status === 'not_done')?.total || 0,
            data?.status?.find(n => n.status === 'done')?.total || 0
          ]
        }}
      />
    </>
  )
}
