import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import {
  Fetch,
  SelectMachineEnterprise,
  SelectModelMachine,
  TextSpan,
} from "../../components";
import ItemCardVessel from "./ItemCardVessel";
import { SkeletonThemed } from "../../components/Skeleton";

const FleetPanel = ({ isReady, enterprises }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const firstLoading = useRef(true);

  const idEnterprise = enterprises[0]?.id || localStorage.getItem("id_enterprise_filter");

  const idMachinesParam = searchParams.get('idMachines');
  const idModelsParam = searchParams.get('idModels');
  const [filter, setFilter] = useState({
    idMachines: idMachinesParam ? idMachinesParam.split(',') : [],
    idModels: idModelsParam ? idModelsParam.split(',') : [],
  })

  useEffect(() => {
    let interval;
    if (isReady && enterprises?.length) {

      fetchFleetData();
      if (!firstLoading.current && interval) {
        clearInterval(interval);
      }

      interval = setInterval(() => fetchFleetData(), 60000);
    } else if (interval) {

      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReady, searchParams, enterprises]);


  const fetchFleetData = async () => {
    if (firstLoading.current) {
      setLoading(true);
      firstLoading.current = false;
    }

    const filterQuery = []

    const idMachines = searchParams.get('idMachines');
    const idModels = searchParams.get('idModels');

    if (idMachines) {
      filterQuery.push(`idMachines=${idMachines}`);
    }

    if (idModels) {
      filterQuery.push(`idModels=${idModels}`);
    }

    try {
      const res = await Fetch.get(`/treesensors/enterprise/${idEnterprise}/cards?${filterQuery.join("&")}`);
      setFleetData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const onFilter = () => {
    // fetchFleetData(idEnterprise);
    updateQueryParam([
      filter.idMachines.length ? ["idMachines", filter.idMachines.join(",")] : [],
      filter.idModels.length ? ["idModels", filter.idModels.join(",")] : [],
    ], [
      [
        ...[!filter.idMachines.length ? "idMachines" : ""],
        ...[!filter.idModels.length ? "idModels" : ""],
      ].filter(Boolean),
    ]);
  }

  const updateQueryParam = (listValues, listDelete = []) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const item of listValues || []) {
      if (item?.length) {
        newSearchParams.set(item[0], item[1]);
      }
    }
    for (const item of listDelete || []) {
      newSearchParams.delete(item);
    }
    if (listValues.length || listDelete.length) {
      setSearchParams(newSearchParams);
    }
  };

  const hasConsumption = fleetData?.some(x => x.tree?.engines?.some(engine => engine.consumption !== undefined && engine.consumption !== null));
  const hasEngines = fleetData?.some(x => x.tree?.engines?.length > 0);

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
                  idMachines: e?.map(x => x.value),
                }));
              }}
              isOnlyValue
              value={filter.idMachines}
              isMulti
            />
          </Col>
          <Col breakPoint={{ xs: 5, md: 4 }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="model.machine" />
            </TextSpan>
            <SelectModelMachine
              idEnterprise={idEnterprise}
              onChange={(e) => {
                setFilter((state) => ({
                  ...state,
                  idModels: e?.map(x => x.value),
                }));
              }}
              value={filter.idModels}
              isMulti
            />
          </Col>
          <Col breakPoint={{ xs: 2, md: 2 }}
            style={{
              display: 'flex', justifyContent: 'center',
              flexDirection: 'column',
              alignContent: 'center'
            }}
            className="pt-1">
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100%' }}>
              <Button
                status={idMachinesParam?.length || idModelsParam?.length ? "Info" : "Basic"}
                size="Tiny"
                className="flex-between mt-4"
                onClick={onFilter}>
                <EvaIcon name="search-outline" className="mr-1" />
                <FormattedMessage id="filter" />
              </Button>
            </div>
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
                  md: 4,
                  xl: 4,
                  lg: 4,
                  xxl: 3,
                  xxxl: 3,
                }}
                onClick={() =>
                  navigate(`/panel-default-view?idMachine=${fleeItem.id}&name=${fleeItem.name}${fleeItem.idDashboard ? `&id=${fleeItem.idDashboard}` : ''}`)
                }
                style={{ cursor: "pointer" }}
              >
                <ItemCardVessel
                  hasConsumption={hasConsumption}
                  hasEngines={hasEngines}
                  data={fleeItem} />
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
