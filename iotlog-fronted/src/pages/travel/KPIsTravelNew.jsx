import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import VoyageByVessel from "./kpis/VoyageByVessel";
import StatusVoyage from "./kpis/StatusVoyage";
import HoursVoyage from "./kpis/HoursVoyage";
import { Fetch } from "../../components";
import { SkeletonThemed } from "../../components/Skeleton";


export default function KPIsTravelNew(props) {

  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.idEnterprise) {
      getData(props.idEnterprise)
    }
  }, [props.idEnterprise])

  const getData = (idEnterprise) => {
    setIsLoading(true)
    Fetch.get(`/travel/kpis?idEnterprise=${idEnterprise}`)
      .then(response => {
        if (response.data?.length) {
          setData(response.data)
        }
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
      })
  }

  return (
    <>
      {isLoading
        ? <>
          <Row className="m-0 p-4" style={{ minHeight: 200 }}>
            <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
              <SkeletonThemed height={200} />
            </Col>
            <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
              <SkeletonThemed height={200} />
            </Col>
            <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
              <SkeletonThemed height={200} />
            </Col>
          </Row>
        </>
        : <>

          <Row className="m-0 p-4" style={{ minHeight: 400 }}>
            <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
              <StatusVoyage data={data} />
            </Col>
            <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
              <HoursVoyage data={data} />
            </Col>
            <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
              <VoyageByVessel data={data} />
            </Col>
          </Row>
        </>
      }
    </>
  );
}
