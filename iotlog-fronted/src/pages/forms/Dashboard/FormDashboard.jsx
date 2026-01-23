import { Card, CardBody, CardHeader, Col, Row } from "@paljs/ui";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Fetch, TextSpan } from "../../../components";
import TableListRVE from "./TableListRVE";
import MostHours from "./MostHours";
import MostConsumption from "./MostConsumption";
import Filter from "../Filled/Filter";
import { useSearchParams } from "react-router-dom";


function FormDashboard(props) {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (props.isReady) {
      const idEnterpriseFilter = props.enterprises?.length
        ? props.enterprises[0].id
        : "";
      getDashboard(idEnterpriseFilter)
    }
  }, [props.isReady, props.enterprises])

  const getDashboard = async (idEnterprise) => {
    setIsLoading(true)

    const filter = [
      `idForm=1`,
      `idEnterprise=${idEnterprise}`];

    const machines = searchParams.get("machines");
    const initialDate = searchParams.get("initialDate");
    const finalDate = searchParams.get("finalDate");

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
      const response = await Fetch.get(`/formdata/dashboardrve?${filter.join('&')}`)
      setData(response.data)
    }
    catch {
      setData([])
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
              Dashboard RVE
            </TextSpan>
          </Row>
          <div className="mt-4"></div>
          <Filter handleSearch={() => getDashboard(localStorage.getItem("id_enterprise_filter"))} />
        </CardHeader>
        <CardBody>
          <Row>
            {!isLoading && !!data?.length &&
              <>
                <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                  <MostHours data={data} />
                </Col>
                <Col breakPoint={{ xs: 12, md: 6 }} className="mb-4">
                  <MostConsumption data={data} />
                </Col>
              </>}
            <Col breakPoint={{ xs: 12, md: 12 }}>
              <TableListRVE data={data} isLoading={isLoading} />
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


export default connect(mapStateToProps)(FormDashboard)
