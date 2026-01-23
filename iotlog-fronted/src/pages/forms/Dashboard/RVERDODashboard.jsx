import { Card, CardBody, CardFooter, CardHeader, Col, Row } from "@paljs/ui";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { Fetch, TextSpan } from "../../../components";
import ListRVERDO from "./RVE_RDO/ListRVERDO";
import FilterRVE_RDO from "./RVE_RDO/FilterRVE_RDO";
import DownloadCSV_RVERDO from "./RVE_RDO/DownloadCSV_RVERDO";


function RVERDODashboard(props) {

  const [data, setData] = useState({
    rdo: [],
    assets: [],
  })
  const [unit, setUnit] = useState("m³");
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const isReadyRef = useRef(false);

  const initialDate = searchParams.get("initialDate");
  const finalDate = searchParams.get("finalDate");
  const showInoperabilities = !!(searchParams.get("showInoperabilities") === "true");

  useEffect(() => {
    if (props.isReady) {
      if (!initialDate && !finalDate) {
        setSearchParams((searchParams) => {
          searchParams.set("initialDate", moment().subtract(30, 'days').format("YYYY-MM-DDT00:00:00Z"));
          searchParams.set("finalDate", moment().subtract(1, 'day').format("YYYY-MM-DDT23:59:59Z"));
          searchParams.set("showInoperabilities", "true");
          return searchParams;
        });
      } else {
        isReadyRef.current = true;
      }
    }
  }, [props.isReady, props.enterprises])

  useEffect(() => {
    if (!isReadyRef.current && initialDate && finalDate) {
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
      const response = await Fetch.get(`/formdata/dashboardrverdo?${filter.join('&')}`)
      if (response.data.operations?.length) {
        setData({
          operations: response.data?.operations?.map(item => ({
            code: item[0],
            idAsset: item[1],
            dateStart: new Date(item[2] * 1000),
            dateEnd: new Date(item[3] * 1000),
            consumptionDailyContract: !showInoperabilities && item[0]?.slice(0, 2) === "IN" ? 0 : item[4]
          })) || [],
          assets: response.data?.assets?.map(item => ({
            id: item[0],
            name: item[1],
            image: { url: item[2] },
          })) || [],
          rdo: response.data?.rdo?.map(item => ({
            idAsset: item[0],
            date: new Date(item[1] * 1000),
            consumptionEstimated: item[2],
          })) || [],
        })
      } else {
        setData({
          operations: [],
          assets: [],
          rdo: [],
        })
      }
    }
    catch {
      setData({
        operations: [],
        assets: [],
        rdo: [],
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
              Dashboard RDO vs RVE
            </TextSpan>
          </Row>
          <div className="mt-4"></div>
          <FilterRVE_RDO unit={unit} setUnit={setUnit} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 12, md: 12 }}>
              <ListRVERDO
                data={data}
                showInoperabilities={showInoperabilities}
                isLoading={isLoading}
                filterStartDate={initialDate}
                filterEndDate={finalDate}
                unit={unit}
              />
            </Col>
          </Row>
        </CardBody>
        {!isLoading &&
          !!data?.operations?.length &&
          <>
            <CardFooter>
              <DownloadCSV_RVERDO
                data={data}
              />
            </CardFooter>
          </>}
      </Card>
    </>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps)(RVERDODashboard)
