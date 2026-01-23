import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Row, Col, Badge } from '@paljs/ui';
import { TextSpan } from '../../../components';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import ConsumptionCard, { ConsumptionCardHeader } from './ConsumptionCard';
import Filter from './Filter';
import moment from 'moment';
import { connect } from 'react-redux';
import { Fetch } from '../../../components';
import { SkeletonThemed } from '../../../components/Skeleton';

const ComparativeConsumption = (props) => {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isReadyRef = React.useRef(false);

  const dateMin = searchParams.get("dateMin");
  const dateMax = searchParams.get("dateMax");
  const unit = searchParams.get("unit") || "L";
  const viewType = searchParams.get("viewType") || "stock";

  useEffect(() => {
    if (props.isReady) {
      if (!dateMin && !dateMax) {
        const defaultDateMin = moment().subtract(30, 'days').format("YYYY-MM-DDT00:00:00Z");
        const defaultDateMax = moment().format("YYYY-MM-DDT23:59:59Z");
        setSearchParams((params) => {
          params.set("dateMin", defaultDateMin);
          params.set("dateMax", defaultDateMax);
          params.set("unit", "L");
          params.set("viewType", "stock");
          return params;
        });
        isReadyRef.current = true;
      }
    }
  }, [props.isReady])

  useEffect(() => {
    if (isReadyRef.current) {
      loadData();
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      const machines = searchParams.get("machines")?.split(",");
      if (machines?.length) {
        const uniqueMachines = [...new Set(machines)].filter(Boolean);
        uniqueMachines.forEach(machine => {
          queryParams.append('idMachine[]', machine);
        });
      }

      const dateMin = searchParams.get("dateMin") || moment().subtract(30, 'days').format("YYYY-MM-DDT00:00:00Z");
      const dateMax = searchParams.get("dateMax") || moment().format("YYYY-MM-DDT23:59:59Z");
      queryParams.append('dateMin', dateMin);
      queryParams.append('dateMax', dateMax);

      const unit = searchParams.get("unit") || "L";
      queryParams.append('unit', unit);

      const viewType = searchParams.get("viewType") || "consumption";
      queryParams.append('viewType', viewType);

      const idEnterprise = props.enterprises?.length ? props.enterprises[0]?.id : undefined;
      if (idEnterprise) {
        queryParams.append('idEnterprise', idEnterprise);
      }

      const response = await Fetch.get(`/consumption/comparative?${queryParams.toString()}`);

      if (response?.data?.length) {
        setVessels(response.data);
      } else {
        setVessels([]);
      }
    } catch (error) {
      setVessels([]);
    } finally {
      setLoading(false);
    }
  };

  const idEnterprise = props.enterprises?.length ? props.enterprises[0]?.id : undefined;

  return (
    <Card>
      <CardHeader>
        <Row className="m-0" middle="xs">
          <TextSpan apparence="s1">
            <FormattedMessage id="consumption.comparative" />
          </TextSpan>
        </Row>
      </CardHeader>
      <CardBody>
        <Filter
          idEnterprise={idEnterprise}
        />
        {loading ? (
          <Row className="m-0">
            <Col breakPoint={{ xs: 12, md: 12 }} className="mb-4">
              <SkeletonThemed height={60} />
            </Col>
            <Col breakPoint={{ xs: 12, md: 12 }} className="mb-4">
              <SkeletonThemed height={60} />
            </Col>
            <Col breakPoint={{ xs: 12, md: 12 }} className="mb-4">
              <SkeletonThemed height={60} />
            </Col>
          </Row>
        ) : vessels.length > 0 ? (
          <>
            <ConsumptionCardHeader />
            {vessels.map((vessel, index) => (
              <ConsumptionCard
                key={`vessel-${index}`}
                data={vessel}
                filterQuery={{
                  dateMin: dateMin,
                  dateMax: dateMax,
                  idEnterprise,
                  unit: unit,
                  viewType: viewType,
                }}
              />
            ))}
          </>
        ) : (
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="no.data" />
          </TextSpan>
        )}
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  items: state.menu.items,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ComparativeConsumption);
