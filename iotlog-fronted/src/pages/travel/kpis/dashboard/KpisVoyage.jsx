import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, LabelIcon, SelectCustomer, SelectMachineEnterprise, SpinnerFull, TextSpan } from "../../../../components";
import VoyageEstimateVsReal from "./VoyageEstimateVsReal";
import { takeCareResponse } from "./Utils";
import VesselEstimateVsReal from "./VesselEstimateVsReal";
import { connect } from "react-redux";
import { Button, EvaIcon } from "@paljs/ui";

const KpisVoyage = (props) => {

  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [vessels, setVessels] = React.useState([])
  const [customers, setCustomers] = React.useState([])
  const intl = useIntl()

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : null

  React.useEffect(() => {
    if (idEnterprise && props.isReady)
      getData()
    else
      setData([])
  }, [idEnterprise, props.isReady])

  const getData = () => {
    const query = []
    if (vessels?.length) {
      vessels.forEach(vessel => {
        query.push(`idMachine[]=${vessel.value}`)
      })
    }
    if (customers?.length) {
      customers.forEach(customer => {
        query.push(`idCustomer[]=${customer.value}`)
      })
    }
    setIsLoading(true)
    Fetch.get(`/travel/kpis?idEnterprise=${idEnterprise}&${query.join('&')}`)
      .then(response => {
        setIsLoading(false)
        setData(response.data?.length ? takeCareResponse(response.data) : [])
      })
      .catch(() => {
        setIsLoading(false)
      });
  }

  const dataToRender = data?.filter(x => x.calculated)

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            <FormattedMessage id="kpis.travel" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <Row middle="xs">
            <Col breakPoint={{ xs: 5, md: 5 }} className="mb-4 pb-1">
              <LabelIcon
                iconName={"search-outline"}
                title={intl.formatMessage({ id: "search" })}
              />
              <SelectMachineEnterprise
                onChange={(value) => setVessels(value)}
                value={vessels}
                idEnterprise={idEnterprise}
                isMulti
              />
            </Col>
            <Col breakPoint={{ xs: 5, md: 5 }} className="mb-4 pb-1">
              <LabelIcon
                iconName={"briefcase-outline"}
                title={intl.formatMessage({ id: "customer" })}
              />
              <SelectCustomer
                onChange={(value) => setCustomers(value)}
                value={customers}
                idEnterprise={idEnterprise}
                isMulti
              />
            </Col>
            <Col breakPoint={{ xs: 2, md: 2 }}>
              <Row center="xs" middle="xs">
                <Button
                  size="Tiny"
                  status="Info"
                  className="flex-between"
                  onClick={() => getData()}
                >
                  <EvaIcon name="search-outline" className="mr-1" />
                  <FormattedMessage id="filter" />
                </Button>
              </Row>
            </Col>
            {!!dataToRender?.length &&
              <>
                <Col breakPoint={{ xs: 12, md: 12 }}>
                  <VoyageEstimateVsReal
                    data={dataToRender}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 12 }}>
                  <VesselEstimateVsReal
                    data={dataToRender}
                  />
                </Col>
              </>}
          </Row>
        </CardBody>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(KpisVoyage);
