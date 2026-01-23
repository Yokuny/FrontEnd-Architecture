import { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, EvaIcon, Row, Checkbox, Select } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { LabelIcon, SelectMachineEnterprise } from "../../../../components";
import { Vessel } from "../../../../components/Icons";
import InputDateTime from "../../../../components/Inputs/InputDateTime";
import { nanoid } from "nanoid";

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

const unitOptions = [
  { value: "m³", label: "m³" },
  { value: "L", label: "L" },
];

export default function FilterRVE_RDO({ unit, setUnit, isDisabled = false }) {
  const [idMachines, setIdMachines] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showInoperatedConsuption, setShowInoperatedConsuption] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();

  const machines = searchParams.get("machines")?.split(",");
  const initialDate = searchParams.get("initialDate");
  const finalDate = searchParams.get("finalDate");
  const showInoperabilities = searchParams.get("showInoperabilities");
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
    if (showInoperabilities === "true") {
      setShowInoperatedConsuption(true);
    } else {
      setShowInoperatedConsuption(false);
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
    setSearchParams((state) => {
      state.delete("machines");
      state.set("initialDate", moment().subtract(30, 'days').format("YYYY-MM-DDTHH:mm:ssZ"));
      state.set("finalDate", moment().format("YYYY-MM-DDTHH:mm:ssZ"));
      state.delete("showInoperabilities");
      return state;
    });
  }

  function hasFilter() {
    return machines || initialDate || finalDate;
  }

  function onSearch() {
    setSearchParams((state) => {
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
      state.set(
        "showInoperabilities",
        showInoperatedConsuption ? "true" : "false"
      );
      state.set("r", nanoid(5));

      return state;
    });
  }

  return (
    <>
      <ContainerRow middle="xs" className="mb-4">
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Row middle="xs">
            <Col breakPoint={{ xs: 12, md: 10.5 }}>
              <Row>
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
                        }}
                      />
                    )}
                    title={<FormattedMessage id="vessels" />}
                  />
                  <SelectMachineEnterprise
                    isOnlyValue
                    onChange={(e) => handleFilterMachines(e?.map((x) => x.value))}
                    placeholder="vessels.select.placeholder"
                    value={idMachines}
                    idEnterprise={idEnterprise}
                    isMulti={true}
                    disabled={isDisabled}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 3.5 }} className="mb-2">
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.start" />}
                  />
                  <InputDateTime
                    onChange={(e) => handleFilterDate(e, "initialDate")}
                    value={startDate}
                    max={endDate ? new Date(endDate) : new Date()}
                    isDisabled={isDisabled}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 3.5 }} className="mb-2">
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.end" />}
                  />
                  <InputDateTime
                    onChange={(e) => handleFilterDate(e, "endDate")}
                    value={endDate}
                    max={new Date()}
                    isDisabled={isDisabled}
                  />
                </Col>

                <Col breakPoint={{ xs: 12, md: 2 }}>
                  <LabelIcon
                    iconName={"options-2-outline"}
                    title={<FormattedMessage id="unit" />}
                  />
                  <Select
                    options={unitOptions}
                    value={unitOptions.find(x => x.value === unit)}
                    onChange={(e) => setUnit(e.value)}
                    isDisabled={isDisabled}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 2 }}>
                  <LabelIcon
                    iconName={"droplet-outline"}
                    title={<FormattedMessage id="consumption" />}
                  />
                  <Checkbox
                    className="mt-1 ml-1"
                    checked={showInoperatedConsuption}
                    onChange={(e) => setShowInoperatedConsuption(prev => !prev)}
                    disabled={isDisabled}
                  >
                    <FormattedMessage id="include.consumption.in" />
                  </Checkbox>
                </Col>
              </Row>
            </Col>
            <Col
              breakPoint={{ xs: 6, md: 1 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "start",
              }}
            >
              <Button
                className="flex-between"
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
                  className="mt-2 flex-between"
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
