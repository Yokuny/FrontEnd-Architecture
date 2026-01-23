import { useEffect, useState } from "react";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { DateTime, LabelIcon, SelectMachineEnterprise } from "../../../../components";
import { Vessel } from "../../../../components/Icons";


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

export default function FilterRVE_Sounding() {
  const [idMachines, setIdMachines] = useState([])
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();

  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  useEffect(() => {
    mappingInitialFilter();
  }, [searchParams])

  function mappingInitialFilter() {
    const machines = searchParams.get("machines")?.split(",");
    if (machines?.length) {
      setIdMachines(machines);
    }
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");
    if (dateStart) {
      setDateStart(dateStart.slice(0, 10));
    }
    if (dateEnd) {
      setDateEnd(dateEnd.slice(0, 10));
    }
  }

  function handleFilterMachines(e) {
    setIdMachines(e);
  }


  function clearFilter() {
    setIdMachines([]);
    setDateStart(null);
    setDateEnd(null);
    setSearchParams((state) => {
      state.delete("machines");
      state.delete("dateStart");
      state.delete("dateEnd");
      return state;
    });
  }

  function hasFilter() {
    const machines = searchParams.get("machines")?.split(",");
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");
    return machines || dateStart || dateEnd;
  }

  function onSearch() {
    setSearchParams((state) => {
      if (idMachines?.length) {
        state.set("machines", idMachines.join(","));
      } else {
        state.delete("machines");
      }
      if (dateStart) {
        state.set("dateStart", new Date(dateStart).toISOString());
      } else {
        state.delete("dateStart");
      }
      if (dateEnd) {
        state.set("dateEnd", new Date(dateEnd).toISOString());
      } else {
        state.delete("dateEnd");
      }
      return state;
    });
  }

  return (
    <>
      <ContainerRow middle="xs" className="mb-4">
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Row middle="xs">
            <Col breakPoint={{ xs: 12, md: 4 }}>
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
              <SelectMachineEnterprise
                isOnlyValue
                onChange={(e) => handleFilterMachines(e?.map((x) => x.value))}
                placeholder="vessels.select.placeholder"
                value={idMachines}
                idEnterprise={idEnterprise}
                isMulti={true}
              />
            </Col>
            <Col breakPoint={{ xs: 12, md: 3 }}>
              <LabelIcon
                iconName={"calendar-outline"}
                title={<FormattedMessage id="date.start" />}
              />
              <DateTime
                date={dateStart}
                onChangeDate={(e) => setDateStart(e)}
                onlyDate
                max={dateEnd ? new Date(dateEnd) : null}
              />
            </Col>
            <Col breakPoint={{ xs: 12, md: 3 }}>
              <LabelIcon
                iconName={"calendar-outline"}
                title={<FormattedMessage id="date.end" />}
              />
              <DateTime
                date={dateEnd}
                onChangeDate={(e) => setDateEnd(e)}
                onlyDate
                min={dateStart ? new Date(dateStart) : null}
              />
            </Col>
            <Col
              breakPoint={{ xs: 6, md: 2 }}
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
