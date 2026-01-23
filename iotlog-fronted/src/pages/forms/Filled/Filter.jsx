import { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, EvaIcon, Row, Checkbox, Select } from "@paljs/ui";
import SelectMaintenanceType from "../../../components/Select/SelectMaintenanceType";
import SelectStatus from "../../../components/Select/SelectStatus";
import { FormattedMessage, useIntl } from "react-intl";
import { useSearchParams, useLocation } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { LabelIcon, SelectMachineEnterprise } from "../../../components";
import SelectFleetVessels from "../../../components/Select/SelectFleetVessels";
import { Vessel } from "../../../components/Icons";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import InputText from "../../../components/Inputs/InputText";

export const ContainerRow = styled(Row)`
  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;

export default function Filter({ isDisabled = false }) {
  const [idMachines, setIdMachines] = useState([]);
  const [isReady, setIsReady] = useState(false)
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSupply, setShowSuply] = useState(false);
  const [codigoOperacional, setCodigoOperacional] = useState("");
  const [finishedAtValue, setFinishedAtValue] = useState(null);
  const [osCodeJobId, setOsCodeJobId] = useState("");
  const [equipmentCriticalValue, setEquipmentCriticalValue] = useState(null);
  const [maintenanceTypeValue, setMaintenanceTypeValue] = useState(null);
  const [statusValue, setStatusValue] = useState(null);
  const STOCK_FORM_ID = ["2f7ab10a-4d64-44de-b0f2-6a008aeae873", "ad034360-6c90-4553-930b-80542278d1ca"];

  const [searchParams, setSearchParams] = useSearchParams();
  const isRVEForm = searchParams.get("t") === "RVE";
  const isCMMSForm = searchParams.get("t") === "CMMS";
  const isKPICMMS = useLocation().pathname.includes("kpis-cmms");

  const theme = useTheme();
  const intl = useIntl();

  const machines = searchParams.get("machines")?.split(",");
  const initialDate = searchParams.get("initialDate");
  const finalDate = searchParams.get("finalDate");
  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  useEffect(() => {
    if (isCMMSForm) {
      // const finishedAtParam = searchParams.get("finishedAt");
      // if (!finishedAtParam) {
      //   const newSearchParams = new URLSearchParams(searchParams);
      //   newSearchParams.set("finishedAt", "false");
      //   setSearchParams(newSearchParams);
      // }
    }
    setIsReady(true);
  }, [])

  useEffect(() => {
    if (isReady) {
      mappingInitialFilter();
    }
  }, [searchParams, isReady]);

  function mappingInitialFilter() {
    if (machines?.length) {
      setIdMachines(machines);
    }
    if (initialDate) {
      setStartDate(new Date(initialDate));
    }
    if (finalDate) {
      setEndDate(new Date(finalDate));
    }

    const osCodeJobIdParam = searchParams.get("osCodeJobId");
    if (osCodeJobIdParam) {
      setOsCodeJobId(osCodeJobIdParam);
    }

    const stockTypeParam = searchParams.get("stockType");

    if (!stockTypeParam) {
      setShowReceipt(false);
      setShowSuply(false);
    } else if (stockTypeParam === "Recebimento") {
      setShowReceipt(true);
      setShowSuply(false);
    } else if (stockTypeParam === "Fornecimento") {
      setShowReceipt(false);
      setShowSuply(true);
    }

    const finishedAtParam = searchParams.get("finishedAt");
    if (finishedAtParam === "true") {
      setFinishedAtValue({ value: "true", label: intl.formatMessage({ id: "finished.at.true" }) });
    } else if (finishedAtParam === "false") {
      setFinishedAtValue({ value: "false", label: intl.formatMessage({ id: "finished.at.false" }) });
    } else {
      setFinishedAtValue(null);
    }

    const equipmentCriticalParam = searchParams.get("equipmentCritical");
    if (equipmentCriticalParam === "true") {
      setEquipmentCriticalValue({ value: "true", label: intl.formatMessage({ id: "yes" }) });
    } else if (equipmentCriticalParam === "false") {
      setEquipmentCriticalValue({ value: "false", label: intl.formatMessage({ id: "not" }) });
    } else {
      setEquipmentCriticalValue(null);
    }

    const tipoManutencaoParam = searchParams.get("tipoManutencao");
    if (tipoManutencaoParam) {
      setMaintenanceTypeValue({
        value: tipoManutencaoParam,
        label: tipoManutencaoParam === "empty" ? intl.formatMessage({ id: "undefined" }) : tipoManutencaoParam
      });
    } else {
      setMaintenanceTypeValue(null);
    }

    const statusParam = searchParams.get("status");
    if (statusParam) {
      setStatusValue({
        value: statusParam,
        label: statusParam === "empty" ? intl.formatMessage({ id: "undefined" }) : statusParam
      });
    } else {
      setStatusValue(null);
    }
  }

  function handleFilterMachines(e) {
    setIdMachines(e);
  }

  function handleFilterDate(date, type) {
    if (type === "initialDate") {
      const dI = moment(date).format("YYYY-MM-DDTHH:mm:ssZ");
      setStartDate(dI);
    } else {
      setEndDate(moment(date).format("YYYY-MM-DDTHH:mm:ssZ"));
    }
  }

  function clearFilter() {
    setIdMachines([]);
    setStartDate(null);
    setEndDate(null);
    setShowReceipt(false);
    setShowSuply(false);
    setCodigoOperacional("");
    setOsCodeJobId("");
    setFinishedAtValue(null);
    setEquipmentCriticalValue(null);
    setMaintenanceTypeValue(null);
    setStatusValue(null);
    setSearchParams((state) => {
      state.set("page", "1");
      state.delete("machines");
      state.delete("initialDate");
      state.delete("finalDate");
      state.delete("stockType");
      state.delete("codigoOperacional");
      state.delete("finishedAt");
      state.delete("equipmentCritical");
      state.delete("maintenanceType");
      state.delete("status");
      return state;
    });
  }

  function hasFilter() {
    return machines || initialDate || finalDate || showReceipt || showSupply || codigoOperacional || osCodeJobId || finishedAtValue || equipmentCriticalValue || maintenanceTypeValue || statusValue;
  }

  function onSearch() {
    setSearchParams((state) => {
      state.set("page", "1");
      if (idMachines?.length) {
        state.set("machines", idMachines.join(","));
      } else {
        state.delete("machines");
      }
      if (startDate) {
        state.set(
          "initialDate",
          moment(startDate).format("YYYY-MM-DDTHH:mm:ssZ")
        );
      } else {
        state.delete("initialDate");
      }
      if (endDate) {
        state.set("finalDate", moment(endDate).format("YYYY-MM-DDTHH:mm:ssZ"));
      } else {
        state.delete("finalDate");
      }
      if (codigoOperacional) {
        state.set("codigoOperacional", codigoOperacional);
      } else {
        state.delete("codigoOperacional");
      }

      if (osCodeJobId) {
        state.set("osCodeJobId", osCodeJobId);
      } else {
        state.delete("osCodeJobId");
      }
      if (finishedAtValue?.value === "true") {
        state.set("finishedAt", "true");
      } else if (finishedAtValue?.value === "false") {
        state.set("finishedAt", "false");
      } else {
        state.delete("finishedAt");
      }

      if (equipmentCriticalValue?.value === "true") {
        state.set("equipmentCritical", "true");
      } else if (equipmentCriticalValue?.value === "false") {
        state.set("equipmentCritical", "false");
      } else {
        state.delete("equipmentCritical");
      }

      if (maintenanceTypeValue?.value) {
        state.set("tipoManutencao", maintenanceTypeValue.value === intl.formatMessage({ id: "undefined" }) ? "empty" : maintenanceTypeValue.value);
      } else {
        state.delete("tipoManutencao");
      }

      if (statusValue?.value) {
        state.set("status", statusValue.value === "empty" ? "empty" : statusValue.value);
      } else {
        state.delete("status");
      }

      if (showReceipt && showSupply) {
        state.set("stockType", "Recebimento,Fornecimento");
      } else if (showReceipt) {
        state.set("stockType", "Recebimento");
      } else if (showSupply) {
        state.set("stockType", "Fornecimento");
      } else {
        state.delete("stockType");
      }
      return state;
    });
  }

  return (
    <>
      <ContainerRow middle="xs" className="mb-4">
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Row middle="xs">
            <Col breakPoint={{ xs: 12, md: 10.7 }}>
              <Row>
                <Col breakPoint={{ xs: 12, md: (isCMMSForm || isKPICMMS) ? 6 : (isRVEForm) ? 6 : 4 }}>
                  <LabelIcon
                    renderIcon={() => (
                      <Vessel
                        style={{
                          height: 13,
                          width: 13,
                          color: theme.textHintColor,
                          marginRight: 5,
                          marginTop: 2,
                          marginBottom: 2,
                        }}
                      />
                    )}
                    title={<FormattedMessage id="vessels" />}
                  />
                  <div style={{ marginTop: 2.6 }}></div>
                  {(isCMMSForm || isKPICMMS) ?
                    <SelectFleetVessels
                      onChange={(values) => handleFilterMachines(values)}
                      value={idMachines}
                      disabled={isDisabled}
                      idEnterprise={idEnterprise}
                    /> :
                    <SelectMachineEnterprise
                      isOnlyValue
                      onChange={(e) => handleFilterMachines(e?.map((x) => x.value))}
                      placeholder="vessels.select.placeholder"
                      value={idMachines}
                      idEnterprise={idEnterprise}
                      isMulti={true}
                      disabled={isDisabled}
                    />}
                </Col>
                {isRVEForm && (
                  <Col breakPoint={{ xs: 12, md: 6 }}>
                    <LabelIcon
                      iconName={"hash-outline"}
                      title={<FormattedMessage id="operation.code" />}
                    />
                    <div style={{ marginTop: 2.6 }}></div>
                    <InputText
                      value={codigoOperacional}
                      onChange={setCodigoOperacional}
                      placeholder={intl.formatMessage({ id: "filter.by.operation.code" })}
                      iconName="edit-outline"
                      isDisabled={isDisabled}
                    />
                  </Col>
                )}
                <Col breakPoint={{ xs: 12, md: (isCMMSForm || isKPICMMS) ? 3 : (isRVEForm) ? 6 : 4 }}>
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.start" />}
                  />
                  <InputDateTime
                    onChange={(e) => handleFilterDate(e, "initialDate")}
                    value={startDate}
                    max={endDate ? new Date(endDate) : new Date()}
                    isDisabled={isDisabled}
                    onlyDate={isCMMSForm || isKPICMMS ? true : false}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: (isCMMSForm || isKPICMMS) ? 3 : (isRVEForm) ? 6 : 4 }}>
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.end" />}
                  />
                  <InputDateTime
                    onChange={(e) => handleFilterDate(e, "endDate")}
                    value={endDate}
                    max={new Date()}
                    isDisabled={isDisabled}
                    onlyDate={isCMMSForm || isKPICMMS ? true : false}
                  />
                </Col>
                 {isCMMSForm && (
                  <Col breakPoint={{ xs: 12, md: 4 }} className="mt-2">
                    <LabelIcon
                      iconName={"hash-outline"}
                      title={<FormattedMessage id="os.code.job.id.label" />}
                    />
                    <div style={{ marginTop: 2.6 }}></div>
                    <InputText
                      value={osCodeJobId}
                      onChange={setOsCodeJobId}
                      placeholder={intl.formatMessage({ id: "os.code.job.id.placeholder" })}
                      isDisabled={isDisabled}
                    />
                  </Col>
                )}
                {(isCMMSForm || isKPICMMS) && (
                  <Col breakPoint={{ xs: 12, md: (isCMMSForm) ? 3 : 4 }} className="mt-2">
                    <LabelIcon
                      iconName={"settings-2-outline"}
                      title={<FormattedMessage id="maintenance.type.label" />}
                    />
                    <div style={{ marginTop: 2.6 }}></div>
                    <SelectMaintenanceType
                      onChange={(option) => {
                        setMaintenanceTypeValue(option);
                      }}
                      value={maintenanceTypeValue}
                      disabled={isDisabled}
                      idEnterprise={idEnterprise}
                    />
                  </Col>
                )}
                {(isCMMSForm || isKPICMMS) && (
                  <Col breakPoint={{ xs: 12, md: (isCMMSForm) ? 2 : 4 }} className="mt-2">
                    <LabelIcon
                      iconName={"alert-circle-outline"}
                      title={<FormattedMessage id="critical.equipment.label" />}
                    />
                    <div style={{ marginTop: 2.6 }}></div>
                    <Select
                      options={[
                        { value: "true", label: intl.formatMessage({ id: "yes" }) },
                        { value: "false", label: intl.formatMessage({ id: "not" }) }
                      ]}
                      placeholder={intl.formatMessage({ id: "critical" })}
                      onChange={(option) => {
                        setEquipmentCriticalValue(option);
                      }}
                      value={equipmentCriticalValue}
                      isClearable
                      isDisabled={isDisabled}
                    />
                  </Col>
                )}
                {(isKPICMMS) && (
                  <Col breakPoint={{ xs: 12, md: 4 }} className="mt-2">
                    <LabelIcon
                      iconName={"alert-circle-outline"}
                      title={<FormattedMessage id="status.label" />}
                    />
                    <div style={{ marginTop: 2.6 }}></div>
                    <SelectStatus
                      onChange={(option) => {
                        setStatusValue(option);
                      }}
                      value={statusValue}
                      idEnterprise={idEnterprise}
                      disabled={isDisabled}
                    />
                  </Col>
                )}
                {isCMMSForm && (
                  <Col breakPoint={{ xs: 12, md: 3 }} className="mt-2">
                    <LabelIcon
                      iconName={"checkmark"}
                      title={<FormattedMessage id="finished.at.label" />}
                    />
                    <div style={{ marginTop: 2.6 }}></div>
                    <Select
                      options={[
                        { value: "true", label: intl.formatMessage({ id: "finished.at.true" }) },
                        { value: "false", label: intl.formatMessage({ id: "finished.at.false" }) }
                      ]}
                      placeholder={intl.formatMessage({ id: "finished.at.placeholder" })}
                      onChange={(option) => {
                        setFinishedAtValue(option);
                      }}
                      value={finishedAtValue}
                      isClearable
                      isDisabled={isDisabled}
                    />
                  </Col>
                )}

                {!!STOCK_FORM_ID.includes(searchParams.get("idForm")) && (
                  <Row
                    className="m-0 pt-4"
                  >
                    <Col breakPoint={{ md: 12, xs: 12 }}>
                      <LabelIcon
                        iconName="eye-outline"
                        title={intl.formatMessage({ id: "display" })}
                      />
                      <Row className="m-0 pl-2">
                        <Checkbox
                          checked={showReceipt}
                          className="mr-4"
                          onChange={(e) => setShowReceipt(!showReceipt)}
                        >
                          <FormattedMessage id="filled.receipt" />
                        </Checkbox>
                        <Checkbox
                          className="ml-4"
                          checked={showSupply}
                          onChange={(e) => setShowSuply(!showSupply)}
                        >
                          <FormattedMessage id="filled.supply" />
                        </Checkbox>
                      </Row>
                    </Col>
                  </Row>
                )}
              </Row>
            </Col>
            <Col
              breakPoint={{ xs: 6, md: 1.3 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Button
                className="mt-5 flex-between"
                status={hasFilter() ? "Info" : "Basic"}
                size="Tiny"
                onClick={() => onSearch()}
                disabled={isDisabled}
              >
                <EvaIcon name="search-outline" className="mr-1" />
                <FormattedMessage id="filter" />
              </Button>
              {hasFilter() && (
                <Button
                  className="mt-3 flex-between"
                  status="Danger"
                  size="Tiny"
                  appearance="ghost"
                  disabled={isDisabled}
                  onClick={() => clearFilter()}
                >
                  <EvaIcon name="close-outline" className="mr-1" />
                  <FormattedMessage id="clear.filter" />
                </Button>
              )}
            </Col>
          </Row>

        </Col>
      </ContainerRow>
    </>
  );
}
