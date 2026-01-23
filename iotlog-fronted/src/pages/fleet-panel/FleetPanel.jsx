import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import {
  Fetch,
  SelectMachineEnterprise,
  SelectModelMachine,
  TextSpan,
} from "../../components";
import { connect } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import ItemVessel from "./ItemVessel";
import { SkeletonThemed } from "../../components/Skeleton";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const FleetPanel = ({ isReady, enterprises }) => {
  const navigate = useNavigate();

  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const firstLoading = useRef(true);
  const [filter, setFilter] = useState({
    idMachines: [],
    idModels: [],
  })

  useEffect(() => {
    let interval;
    if (isReady && enterprises?.length) {
      const enterpriseId = enterprises[0]?.id;
      fetchFleetData(enterpriseId);
      interval = setInterval(() => fetchFleetData(enterpriseId, filter), 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReady, enterprises]);

  const fetchFleetData = async (id, filter) => {
    if (firstLoading.current) {
      setLoading(true);
      firstLoading.current = false;
    }

    const filterQuery = []

    if (filter?.idMachines?.length) {
      filterQuery.push(`idMachines=${filter.idMachines.map(x => x.value).join(",")}`);
    }

    if (filter?.idModels?.length) {
      filterQuery.push(`idModels=${filter.idModels.map(x => x.value).join(",")}`);
    }

    try {
      const res = await Fetch.get(`/treesensors/enterprise/${id}/panel?${filterQuery.join("&")}`);
      setFleetData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  const onFilter = () => {
    fetchFleetData(idEnterprise, filter);
  }

  return (
    <Card>
      <CardHeader>
        <Row>
          <Col breakPoint={{ xs: 5, md: 6 }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="machine" />
            </TextSpan>
            <SelectMachineEnterprise
              idEnterprise={idEnterprise}
              onChange={(e) => {
                setFilter((state) => ({
                  ...state,
                  idMachines: e,
                }));
              }}
              isMulti
            />
          </Col>
          <Col breakPoint={{ xs: 5 }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="model.machine" />
            </TextSpan>
            <SelectModelMachine
              idEnterprise={idEnterprise}
              onChange={(e) => {
                setFilter((state) => ({
                  ...state,
                  idModels: e,
                }));
              }}
              isMulti
            />
          </Col>
          <Col breakPoint={{ xs: 2, md: 1 }} className="pt-2">
            <Button
              status="Info"
              size="Tiny"
              className="flex-between mt-4"
              onClick={onFilter}>
              <EvaIcon name="search-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <Col key={index} breakPoint={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                <SkeletonThemed height={400} />
              </Col>
            ))
            : fleetData?.map((fleeItem, i) => (
              <Col
                key={fleeItem.id + i}
                breakPoint={{
                  xs: 12,
                  sm: 12,
                  md: 3,
                  xl: 2.4,
                  lg: 3,
                }}
                onClick={() =>
                  navigate(`/panel-default-view?idMachine=${fleeItem.id}&name=${fleeItem.name}`)
                }
                style={{ cursor: "pointer" }}
              >
                <ItemVessel data={fleeItem} />
              </Col>
            ))}
        </Row>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps)(FleetPanel);
