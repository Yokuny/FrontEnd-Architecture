import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button, CardFooter, Select } from "@paljs/ui";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage } from "react-intl";
import InputText from "../../components/Inputs/InputText";
import { SpinnerFull, LabelIcon } from "../../components";
import { Fetch } from "../../components/Fetch";
import SelectMachineFiltered from "../../pages/remote-ihm/bravante/SelectMachineFiltered";

import { SkeletonThemed } from "../../components/Skeleton";
import TableItens from "./TableItens";
import ButtonDaysFilter from "./ButtonDaysFilter";
import { useSearchParams } from "react-router-dom";
import SelectTypeSensor from "../../components/Select/SelectTypeSensor";

const SensorMinMax = (props) => {

  const [fullData, setFullData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMinMax, setIsLoadingMinMax] = useState(false);
  const [filter, setFilter] = useState({
    searchText: '',
    unitFilter: '',
    typeFilter: '',
  });

  const dataMinMaxRef = React.useRef(null);
  const [sensorsMinMax, setSensorsMinMax] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const intl = useIntl();

  const daysFilter = searchParams.get("days");
  const idAsset = searchParams.get("idAsset");

  const idEnterprise =
    props.enterprises?.length > 0
      ? props.enterprises[0].id
      : localStorage.getItem("id_enterprise_filter");

  const availableUnits = useMemo(() => {
    const units = new Set(fullData.map(sensor => sensor.unit).filter(Boolean));
    const unitsArray = Array.from(units);
    return unitsArray;
  }, [fullData]);

  const resetFilters = () => {
    setFilter({
      searchText: '',
      unitFilter: '',
      typeFilter: '',
    });
  };

  useEffect(() => {
    if (!daysFilter) {
      updateQueryParam([
        ["days", 1],
      ]);
    }
  }, []);

  useEffect(() => {
    if (idAsset && props.enterprises?.length) {
      dataMinMaxRef.current = null;
      setSensorsMinMax({});
      findData(idAsset);
      resetFilters();
    } else {
      setFullData([]);
      dataMinMaxRef.current = null;
      setSensorsMinMax({});
    }

    return () => {
      setFullData([]);
      dataMinMaxRef.current = null;
      setSensorsMinMax({});
    }
  }, [props.enterprises]);

  useEffect(() => {
    if (idAsset) {
      setFullData([]);
      dataMinMaxRef.current = null;
      setSensorsMinMax({});
      resetFilters();
    }
  }, [idAsset]);

  const findData = (idAsset) => {
    getData(idAsset);
    getMinMaxParams(idAsset);
  }

  const getData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(`/sensordata/lastdays/${idMachine}?days=${daysFilter}&idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (response?.data?.length) {
          setFullData(response.data);
        } else {
          setFullData([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setFullData([]);
        setIsLoading(false);
      });
  }

  const getMinMaxParams = (idMachine) => {
    setIsLoadingMinMax(true);
    Fetch.get(`/sensorminmax?idAsset=${idMachine}&idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (response?.data) {
          dataMinMaxRef.current = response.data;
          const sensors = {};
          response.data.sensors.forEach((sensor) => {
            sensors[sensor.idSensor] = {
              min: sensor.min,
              max: sensor.max,
              isAlert: sensor.isAlert,
              booleanNotify: sensor.booleanNotify,
            };
          });
          setSensorsMinMax(sensors);
        } else {
          dataMinMaxRef.current = null;
          setSensorsMinMax({});
        }
        setIsLoadingMinMax(false);
      })
      .catch((error) => {
        setIsLoadingMinMax(false);
      });
  }

  const onAfterDataSensorSave = (sensor) => {
    setFullData((prevData) => {
      const findIndex = prevData.findIndex((s) => s.id === sensor.id);
      return [
        ...prevData.slice(0, findIndex),
        {
          ...prevData[findIndex],
          unit: sensor.unit,
          type: sensor.type,
          label: sensor.label,
        },
        ...prevData.slice(findIndex + 1),
      ]
    })
  }

  const updateQueryParam = (listValues, listDelete = []) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const item of listValues || []) {
      newSearchParams.set(item[0], item[1]);
    }
    for (const item of listDelete || []) {
      newSearchParams.delete(item);
    }
    if (listValues.length || listDelete.length) {
      setSearchParams(newSearchParams);
    }
  };

  const handleSaveAll = () => {

    const dataToSave = Object.keys(sensorsMinMax).map((idSensor) => {
      const sensorData = sensorsMinMax[idSensor];
      return {
        idSensor,
        min: sensorData.min,
        max: sensorData.max,
        isAlert: sensorData.isAlert,
        booleanNotify: sensorData.booleanNotify,
      };
    });
    const hasMaxMinusMin = dataToSave.find(sensor =>
      sensor.max !== null && sensor.min !== null &&
      sensor.max < sensor.min);
    if (hasMaxMinusMin) {
      const sensorLabel = fullData.find(sensor => sensor.idSensor === hasMaxMinusMin.idSensor)?.label || hasMaxMinusMin.idSensor;
      toast.warn(intl.formatMessage({ id: "sensor.min.more.max" }).replace("{0}", `"${sensorLabel}"`));
      return;
    }

    setIsLoadingMinMax(true);
    Fetch.post("/sensorminmax", {
      id: dataMinMaxRef.current?.id || null,
      idAsset: idAsset,
      idEnterprise,
      sensors: dataToSave,
    })
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        dataMinMaxRef.current = {
          id: dataMinMaxRef.current?.id || response.data?.id,
          idAsset: idAsset,
          idEnterprise,
          sensors: dataToSave,
        };
        setIsLoadingMinMax(false);
      })
      .catch((error) => {
        setIsLoadingMinMax(false);
      });

  }

  const onHandleChangeMinMax = useCallback((idSensor, field, value) => {
    setSensorsMinMax((prev) => ({
      ...prev,
      [idSensor]: {
        ...prev[idSensor],
        [field]: value,
      },
    }));
  }, []);

  const onChangeFilter = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  const getItensFiltered = () => {
    return fullData.filter(sensor => {
      const isFilterText = filter.searchText?.trim() && (
        !sensor.label?.toLowerCase()?.includes(filter.searchText?.toLowerCase())
        && !sensor.idSensor?.toLowerCase()?.includes(filter.searchText?.toLowerCase())
      );
      const isFilterUnit = filter.unitFilter && sensor.unit !== filter.unitFilter;
      const isFilterType = filter.typeFilter && sensor.type !== filter.typeFilter;
      return !isFilterText && !isFilterUnit && !isFilterType;
    });
  }

  const filteredData = getItensFiltered();

  return (
    <>
      <SpinnerFull isLoading={isLoading} />

      <Card>
        <CardHeader>
          <Row middle="xs" style={{ zIndex: 11 }}>
            <Col breakPoint={{ md: 8 }}>
              <LabelIcon
                title={<FormattedMessage id="machine" />}
              />
              <SelectMachineFiltered
                idEnterprise={idEnterprise}
                onChange={(value) => updateQueryParam([
                  ["idAsset", value?.value],
                ])}
                placeholder="machine.placeholder"
                value={idAsset || null}
                renderLastActivity
                onlyValue
              />
            </Col>
            <Col breakPoint={{ md: 2 }}>
              <LabelIcon
                title={
                  `${intl.formatMessage({ id: "filter" })} ${intl.formatMessage({ id: "days" })}`
                }
              />
              <ButtonDaysFilter
                onChange={(days) => updateQueryParam([
                  ["days", days],
                ])}
                value={Number(daysFilter)}
              />
            </Col>
            <Col breakPoint={{ md: 2 }}>
              <Row className="m-0 pt-4" middle="xs" center="xs">
                <Button
                  size="Tiny"
                  status="Basic"
                  className="flex-between"
                  disabled={!idAsset || isLoading || isLoadingMinMax || !daysFilter}
                  onClick={() => findData(idAsset)}
                >
                  <EvaIcon name="search-outline" className="mr-1" />
                  <FormattedMessage id="search" />
                </Button>
              </Row>
            </Col>
          </Row>
        </CardHeader>

        <CardBody
          style={{
            maxHeight: "calc(100vh - 365px)",
            overflowY: "auto",
            padding: "0px 10px",
          }}
        >
          {isLoading ?
            <>
              <CardBody>
                <SkeletonThemed height={60} />
                <div className="mt-2"></div>
                <SkeletonThemed height={60} />
                <div className="mt-2"></div>
                <SkeletonThemed height={60} />
                <div className="mt-2"></div>
                <SkeletonThemed height={60} />
                <div className="mt-2"></div>
                <SkeletonThemed height={60} />
              </CardBody>
            </>
            : <>
              {fullData.length > 0 && (
                <Row middle="xs" className="mt-3">
                  <Col breakPoint={{ xs: 12, md: 4 }} className="mb-1">
                    <LabelIcon
                      title={<FormattedMessage id="search.sensor.description" />}
                    />
                    <InputText
                      value={filter?.searchText}
                      onChange={(txt) => onChangeFilter("searchText", txt)}
                      placeholder={intl.formatMessage({ id: "search.sensor.description" })}
                      iconName="search-outline"
                    />
                  </Col>

                  <Col breakPoint={{ xs: 12, md: 4 }} className="mb-1">
                    <LabelIcon
                      title={<FormattedMessage id="filter.by.unit" />}
                    />
                    <Select
                      options={availableUnits.map(unit => ({
                        value: unit,
                        label: unit
                      }))}
                      placeholder={intl.formatMessage({ id: "filter.by.unit" })}
                      value={filter.unitFilter ? { value: filter.unitFilter, label: filter.unitFilter } : null}
                      onChange={(option) => onChangeFilter("unitFilter", option?.value || "")}
                      isClearable
                      menuPosition="fixed"
                    />
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 4 }} className="mb-1">
                    <LabelIcon
                      title={<FormattedMessage id="filter.by.type" />}
                    />
                    <SelectTypeSensor
                      placeholder={intl.formatMessage({ id: "filter.by.type" })}
                      value={filter.typeFilter}
                      onChange={(option) => onChangeFilter("typeFilter", option?.value || "")}
                      isClearable
                      placeholderID="filter.by.type"
                    />
                  </Col>
                </Row>
              )}
              <TableItens
                fullData={filteredData}
                idEnterprise={idEnterprise}
                onAfterDataSensorSave={onAfterDataSensorSave}
                onHandleChangeMinMax={onHandleChangeMinMax}
                dataMinMaxRef={dataMinMaxRef}
                sensorsMinMax={sensorsMinMax}
                isLoadingMinMax={isLoadingMinMax}
              />
            </>
          }
        </CardBody>
        {!isLoading &&
          !!filteredData.length &&
          <CardFooter>
            <Row end="xs" className="m-0">
              <Button
                size="Small"
                className="flex-between"
                onClick={handleSaveAll}
              >
                <EvaIcon name="checkmark-outline" className="mr-1" />
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>}
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, null)(SensorMinMax);
