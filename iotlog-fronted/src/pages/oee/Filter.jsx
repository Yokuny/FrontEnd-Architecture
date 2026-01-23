import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "styled-components";
import { LabelIcon, SelectMachineEnterprise } from "../../components";
import { Vessel } from "../../components/Icons";
import InputDateTime from "../../components/Inputs/InputDateTime";
import { ContainerRow, RowCenter } from "./styles";

export default function Filter() {
  const [idMachines, setIdMachines] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();
  const machines = searchParams.get("machines")?.split(",");
  const initialDate = searchParams.get("initialDate");
  const finalDate = searchParams.get("finalDate");
  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  useEffect(() => {
    mappingInitialFilter();
  }, [searchParams]);

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
  }

  function handleFilterMachines(e) {
    setIdMachines([e?.value]);
  }

  function handleFilterDate(date, type) {
    if (type === "initialDate") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  }

  function clearFilter() {
    setIdMachines([]);
    setStartDate(null);
    setEndDate(null);
    setSearchParams((state) => {
      state.set("page", "1");
      state.delete("machines");
      state.delete("initialDate");
      state.delete("finalDate");
      return state;
    });
  }

  function hasFilter() {
    return machines?.length || initialDate || finalDate;
  }

  function onSearch() {

    setSearchParams((state) => {
      state.delete("machines");
      state.delete("initialDate");
      state.delete("finalDate");

      if (idMachines?.length) {
        state.set("machines", idMachines.join(","));
      }

      if (startDate && endDate) {
        state.set("initialDate", moment(startDate).format("YYYY-MM-DDTHH:mm:ssZ"));
        state.set("finalDate", moment(endDate).format("YYYY-MM-DDTHH:mm:ssZ"));
      }

      return state;
    });
  }

  return (
    <>
      <ContainerRow className="mb-4">
        <Col breakPoint={{ xs: 12, md: 2.5 }} className="mb-2">
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.start" />}
          />
          <InputDateTime
            onChange={(e) => handleFilterDate(e, "initialDate")}
            value={startDate}
            onlyDate
            max={endDate ? new Date(endDate) : new Date()}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2.5 }} className="mb-2">
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.end" />}
          />
          <InputDateTime
            onChange={(e) => handleFilterDate(e, "finalDate")}
            value={endDate}
            onlyDate
            max={new Date()}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 5 }} className="mb-2">
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
            title={<FormattedMessage id="vessel" />}
          />
          <div style={{ marginTop: 2.6 }}></div>
          <SelectMachineEnterprise
            isOnlyValue
            onChange={handleFilterMachines}
            placeholder="vessels.select.placeholder"
            value={idMachines?.length ? idMachines[0] : null}
            idEnterprise={idEnterprise}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2 pt-2">
          <RowCenter>
            <Button
              className="mt-4 flex-between"
              status={hasFilter() ? "Info" : "Basic"}
              size="Tiny"
              onClick={onSearch}
              disabled={
                // Desabilita o botão apenas se tiver uma data sem a outra
                (startDate && !endDate) || (!startDate && endDate)
              }
            >
              <EvaIcon name="search-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
            {hasFilter() && (
              <Button
                className="mt-4 flex-between"
                status="Danger"
                size="Tiny"
                appearance="ghost"
                onClick={clearFilter}
              >
                <EvaIcon name="close-outline" className="mr-1" />
                <FormattedMessage id="clear.filter" />
              </Button>
            )}
          </RowCenter>
        </Col>
      </ContainerRow>
    </>
  );
}
