import { Card, CardBody, CardHeader, Col, Row } from "@paljs/ui";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Fetch, TextSpan } from "../../../components";
import ListRVESounding from "./RVE_Sounding/ListRVESounding";
import FilterRVE_Sounding from "./RVE_Sounding/FilterRVE_Sounding";


function RVESoundingDashboard(props) {

  const [data, setData] = useState({
    sounding: [],
    assets: [],
    operations: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (props.isReady) {
      isReadyRef.current = true;
    }
  }, [props.isReady, props.enterprises])

  useEffect(() => {
    if (!isReadyRef.current) {
      isReadyRef.current = true;
    }
    if (isReadyRef.current) {
      const idEnterprise = props.enterprises?.length
        ? props.enterprises[0].id
        : localStorage.getItem("id_enterprise_filter");
      getDashboard(idEnterprise)
    }
  }, [searchParams])

  const getDashboard = async (idEnterprise) => {
    setIsLoading(true)

    const filter = [`idEnterprise=${idEnterprise}`];

    const machines = searchParams.get("machines");
    const initialDate = searchParams.get("dateStart");
    const finalDate = searchParams.get("dateEnd");

    if (machines) {
      filter.push(`machines=${machines}`);
    }

    if (initialDate) {
      filter.push(`dateStart=${initialDate}`);
    }

    if (finalDate) {
      filter.push(`dateEnd=${finalDate}`);
    }

    try {
      const response = await Fetch.get(`/formdata/dashboardrvesounding?${filter.join('&')}`)
      if (response.data.operations?.length) {
        setData({
          operations: response.data?.operations?.map(item => ({
            code: item[0],
            idAsset: item[1],
            dateStart: new Date(item[2] * 1000),
            dateEnd: new Date(item[3] * 1000),
            consumptionDailyContract: item[0]?.slice(0, 2) === "IN" ? 0 : item[4]
          })) || [],
          assets: response.data?.assets?.map(item => ({
            id: item[0],
            name: item[1],
            image: { url: item[2] },
          })) || [],
          sounding: (response.data?.sounding?.map(item => ({
            idAsset: item[0],
            date: new Date(item[1] * 1000),
            volume: item[2],
          })) || []).sort((a, b) => a.date - b.date),
          rdo: response.data?.rdo?.map(item => ({
            idAsset: item[0],
            date: new Date(item[1] * 1000),
            received: item[2] || 0,
            supply: item[3] || 0,
          })) || [],
        })
      }
    }
    catch {
      setData({
        operations: [],
        assets: [],
        sounding: [],
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Row className="m-0" between="xs">
            <TextSpan apparence="s1">
              Dashboard <FormattedMessage id="polling" /> vs RVE
            </TextSpan>
          </Row>
          <div className="mt-4"></div>
          <FilterRVE_Sounding />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 12, md: 12 }}>
              <ListRVESounding
                data={data}
                isLoading={isLoading}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps)(RVESoundingDashboard)
