import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "@paljs/ui";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { Fetch, TextSpan } from "../../../../components";
import ListAssetOperational from "./ListAssetOperational";


const OperationalDashboard = (props) => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dateLoadedRef = React.useRef(null);

  React.useEffect(() => {
    const interval = setInterval(() => fetchData(), 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  React.useEffect(() => {
    if (!props.isReady) {
      return;
    }
    fetchData();
  }, [props.enterprises, props.isReady]);

  const fetchData = () => {
    const idEnterprise = props.enterprises?.length
      ? props.enterprises[0].id
      : localStorage.getItem("id_enterprise_filter");
    if (!idEnterprise) {
      return;
    }
    if (!dateLoadedRef.current) {
      setIsLoading(true);
    }
    const finalDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
    Fetch.get(`/assetstatus/ranking/operational?idEnterprise=${idEnterprise}&date=${finalDate}`)
      .then(response => {
        setData(response.data);
        dateLoadedRef.current = new Date();
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  };


  return (
    <>
      <Card>
        <CardHeader>
          <Row className="m-0" between="xs">
            <TextSpan apparence="s1">
              <FormattedMessage id="performance.fleet.operational" />
            </TextSpan>

            {dateLoadedRef.current && <TextSpan apparence="p3" hint>
              <FormattedMessage id="last.date.acronym" />: {moment(dateLoadedRef.current).format("DD/MM/YYYY HH:mm")}
            </TextSpan>}
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 12, md: 12 }}>
              <ListAssetOperational
                data={data}
                isLoading={isLoading}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(OperationalDashboard);
