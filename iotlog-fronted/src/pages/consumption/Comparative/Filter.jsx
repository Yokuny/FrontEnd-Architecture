import { Button, Col, EvaIcon, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { LabelIcon, SelectConsumptionMachine } from "../../../components";
import { Vessel } from "../../../components/Icons";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { useEffect, useState } from "react";

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

export const unitOptions = [
  { label: "L", value: "L" },
  { label: "Ton", value: "T" },
  { label: "m³", value: "m³" },
];

export const viewTypeOptions = [
  { label: "Consumo", value: "consumption" },
  { label: "Estoque", value: "stock" },
];

export default function Filter({ idEnterprise }) {
  const theme = useTheme();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localFilterState, setLocalFilterState] = useState({
    dateMin: new Date(new Date().setDate(new Date().getDate() - 30)),
    dateMax: new Date(),
    machines: [],
    unitSearch: unitOptions.find(opt => opt.value === "L"),
    viewType: viewTypeOptions.find(opt => opt.value === "stock")
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const machines = searchParams.get("machines");
      const dateMin = searchParams.get("dateMin");
      const dateMax = searchParams.get("dateMax");
      const unit = searchParams.get("unit");

      const viewType = searchParams.get("viewType");

      const newState = {
        dateMin: dateMin ? new Date(dateMin) : new Date(new Date().setDate(new Date().getDate() - 30)),
        dateMax: dateMax ? new Date(dateMax) : new Date(),
        machines: [],
        unitSearch: unitOptions.find(opt => opt.value === (unit || "L")),
        viewType: viewTypeOptions.find(opt => opt.value === (viewType || "stock"))
      };

      if (machines) {
        const machineIds = machines.split(",");
        if (machineIds.length > 0) {
          newState.machines = machineIds;
        }
      }

      setLocalFilterState(newState);
    };

    loadInitialValues();
  }, []);

  const handleLocalChange = (key, value) => {
    setLocalFilterState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    const defaultState = {
      dateMin: new Date(new Date().setDate(new Date().getDate() - 30)),
      dateMax: new Date(),
      machines: [],
      unitSearch: unitOptions.find(opt => opt.value === "L"),
      viewType: viewTypeOptions.find(opt => opt.value === "consumption")
    };

    setLocalFilterState(defaultState);
    const params = new URLSearchParams();
    params.set("dateMin", moment(defaultState.dateMin).format("YYYY-MM-DDT00:00:00Z"));
    params.set("dateMax", moment(defaultState.dateMax).format("YYYY-MM-DDT23:59:59Z"));
    params.set("unit", defaultState.unitSearch.value);
    params.set("viewType", defaultState.viewType.value);

    setSearchParams(params);
  };

  const hasFilters = () => {
    return localFilterState?.machines?.length > 0;
  };

  const onSearch = () => {
    const params = new URLSearchParams();

    params.set("dateMin", moment(localFilterState.dateMin).format("YYYY-MM-DDT00:00:00Z"));
    params.set("dateMax", moment(localFilterState.dateMax).format("YYYY-MM-DDT23:59:59Z"));
    params.set("unit", localFilterState.unitSearch?.value || "L");
    params.set("viewType", localFilterState.viewType?.value || "consumption");

    if (localFilterState.machines?.length) {
      const machineIds = localFilterState.machines.filter(Boolean);

      if (machineIds.length > 0) {
        params.set("machines", machineIds.join(","));
        machineIds.forEach(id => {
          params.append("idMachine[]", id);
        });
      }
    }

    setSearchParams(params);
  };

  return (
    <ContainerRow className="mb-4">
      <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
        <LabelIcon
          iconName={"calendar-outline"}
          title={<FormattedMessage id="date.start" />}
        />
        <InputDateTime
          onChange={(e) => handleLocalChange("dateMin", e)}
          value={localFilterState?.dateMin}
          onlyDate
          max={localFilterState?.dateMax ? new Date(localFilterState?.dateMax) : new Date()}
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
        <LabelIcon
          iconName={"calendar-outline"}
          title={<FormattedMessage id="date.end" />}
        />
        <InputDateTime
          onChange={(e) => handleLocalChange("dateMax", e)}
          value={localFilterState?.dateMax}
          onlyDate
          max={new Date()}
          min={localFilterState?.dateMin ? new Date(localFilterState?.dateMin) : null}
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 1.5 }} className="mb-2">
        <LabelIcon
          iconName={"eye-outline"}
          title={<FormattedMessage id="view.type" />}
        />
        <Select
          options={viewTypeOptions}
          value={localFilterState?.viewType}
          onChange={(e) => handleLocalChange("viewType", e)}
          placeholder={intl.formatMessage({ id: "view.type" })}
          menuPosition="fixed"
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 1 }} className="mb-2">
        <LabelIcon
          iconName={"droplet-outline"}
          title={<FormattedMessage id="unit" />}
        />
        <Select
          options={unitOptions}
          value={localFilterState?.unitSearch}
          onChange={(e) => handleLocalChange("unitSearch", e)}
          placeholder={intl.formatMessage({ id: "unit" })}
          menuPosition="fixed"
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 3.5 }} className="mb-2">
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
        <SelectConsumptionMachine
          idEnterprise={idEnterprise}
          onChange={(value) => handleLocalChange("machines", value?.length ? value.map(x => x.value) : [])}
          placeholder="vessels.select.placeholder"
          value={localFilterState?.machines}
          isMulti={true}
          isOnlyValue={true}
          getOptionLabel={(option) => option.label || option.name}
          getOptionValue={(option) => option.value || option.id}
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2 pt-2">
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            className="mt-3 flex-between"
            size="Small"
            onClick={onSearch}
            status={hasFilters() ? "Info" : "Basic"}
            disabled={!localFilterState?.dateMin || !localFilterState?.dateMax}
          >
            <EvaIcon name="search-outline" className="mr-1" />
            <FormattedMessage id="filter" />
          </Button>
          {hasFilters() && (
            <Button
              className="mt-2 flex-between"
              size="Small"
              status="Danger"
              appearance="ghost"
              onClick={handleClearFilters}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage id="clear.filter" />
            </Button>
          )}
        </div>
      </Col>
    </ContainerRow>
  );
}
