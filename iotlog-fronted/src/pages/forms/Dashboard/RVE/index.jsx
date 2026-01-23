import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Fetch, TextSpan } from "../../../../components";
import Filter from "./Filter";
import OperationalCodeChart from "./Charts/OperationalCodeChart";
import ScaleChart from "./Charts/ScaleChart";
import { SkeletonThemed } from "../../../../components/Skeleton";
import TotalHoursCards from "./Charts/TotalHoursCards";
import GroupConsumptionCodeChart from "./Charts/GroupConsumptionCodeChart";


const RVEDashboard = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  const initialDate = searchParams.get("initialDate");
  const finalDate = searchParams.get("finalDate");
  const idAsset = searchParams.get("idAsset");

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : localStorage.getItem("id_enterprise_filter");


  useEffect(() => {
    if (!props.isReady) {
      return
    }
    setIsReady(true);
  }, [props.enterprises, props.isReady]);

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (!initialDate || !finalDate) {
      const today = new Date();
      const oneMonthsAgo = new Date();
      oneMonthsAgo.setMonth(today.getMonth() - 1);

      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("initialDate", oneMonthsAgo.toISOString().split('T')[0]);
        newParams.set("finalDate", today.toISOString().split('T')[0]);
        return newParams;
      });
    } else {
      handleSearch();
    }
  }, [searchParams, isReady]);

  function handleSearch() {
    const filter = [];

    if (!idAsset) {
      return
    }

    if (!idEnterprise) {
      return
    }

    if (initialDate) {
      filter.push(`dateStart=${new Date(initialDate).toISOString()}`);
    }

    if (finalDate) {
      filter.push(`dateEnd=${new Date(finalDate).toISOString()}`);
    }

    const queryString = filter.join("&");

    setIsLoading(true);
    Fetch.get(`/formdata/rvedashboard/${idEnterprise}/${idAsset}?${queryString}`)
      .then((response) => {
        setData(response.data ? response.data : undefined);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  return (
    <Row>
      <Col breakPoint={{ xs: 12, md: 12 }}>
        <Card>
          <CardHeader>
            <Row className="m-0" between="xs">
              <TextSpan apparence="s1">
                <FormattedMessage id="rve.indicators" />
              </TextSpan>
            </Row>
            {isReady && <Filter
              idEnterprise={idEnterprise}
            />}
          </CardHeader>
          <CardBody className="m-0">
            {!isLoading
              ? !idAsset
                ? <Row>
                  <Col breakPoint={{ xs: 12, md: 12 }}>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="select.first.machine" />
                    </TextSpan>
                  </Col>
                </Row>
                : <Row>
                  <Col breakPoint={{ xs: 12, md: 12 }}>
                    <TotalHoursCards data={data?.codigosOperacionais || []} />
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 12 }}>
                    <GroupConsumptionCodeChart
                      idAsset={idAsset}
                      idEnterprise={idEnterprise}
                      initialDate={initialDate}
                      finalDate={finalDate}
                      data={data?.codigosOperacionais || []} />
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 12 }}>
                    <OperationalCodeChart
                      data={data?.codigosOperacionais || []}
                      initialDate={initialDate}
                      finalDate={finalDate}
                      idAsset={idAsset}
                      idEnterprise={idEnterprise}
                    />
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 12 }}>
                    <ScaleChart data={data?.escalas || []} />
                  </Col>
                </Row>
              : <Row>
                <Col breakPoint={{ xs: 12, md: 6 }}>
                  <SkeletonThemed height={350} />
                </Col>
                <Col breakPoint={{ xs: 12, md: 6 }}>
                  <SkeletonThemed height={350} />
                </Col>
              </Row>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps)(RVEDashboard)
