import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import { useEffect, useState } from "react";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import { LabelIcon, SelectMachineEnterprise } from "../../../../components";
import { Vessel } from "../../../../components/Icons";
import InputDateTime from "../../../../components/Inputs/InputDateTime";

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

function Filter(props) {
  const { idEnterprise, isDisabled } = props;
  const [idMachineInternal, setIdMachineInternal] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();

  const idMachine = searchParams.get("idAsset");
  const initialDate = searchParams.get("initialDate");
  const finalDate = searchParams.get("finalDate");

  useEffect(() => {
    mappingInitialFilter();
  }, [searchParams]);

  function mappingInitialFilter() {
    if (idMachine) {
      setIdMachineInternal(idMachine);
    }
    if (initialDate) {
      setStartDate(new Date(initialDate));
    }
    if (finalDate) {
      setEndDate(new Date(finalDate));
    }
  }

  function handleFilterMachines(e) {
    setIdMachineInternal(e);
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
    setIdMachineInternal();
    setStartDate(null);
    setEndDate(null);
    setSearchParams((state) => {
      state.delete("idAsset");
      state.delete("initialDate");
      state.delete("finalDate");
      return state;
    });
  }

  function hasFilter() {
    return idMachine || initialDate || finalDate;
  }

  function onSearch() {
    setSearchParams((state) => {
      state.set("r", nanoid(5));
      if (idMachineInternal?.value) {
        state.set("idAsset", idMachineInternal?.value);
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
      return state;
    });
  }

  return (
    <>
      <ContainerRow middle="xs" className="mb-0">
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Row middle="xs">
            <Col breakPoint={{ xs: 12, md: 10 }}>
              <Row>
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
                    title={<FormattedMessage id="machine" />}
                  />
                  <div style={{ marginTop: 2.6 }}></div>
                  <SelectMachineEnterprise
                    isOnlyValue
                    onChange={(e) => handleFilterMachines(e)}
                    placeholder="machine.placeholder"
                    value={idMachineInternal}
                    idEnterprise={idEnterprise}
                    disabled={isDisabled}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 4 }}>
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.start" />}
                  />
                  <InputDateTime
                    onChange={(e) => handleFilterDate(e, "initialDate")}
                    value={startDate}
                    max={endDate ? new Date(endDate) : new Date()}
                    isDisabled={isDisabled}
                    onlyDate
                  />
                </Col>
                <Col breakPoint={{ xs: 12, md: 4 }}>
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.end" />}
                  />
                  <InputDateTime
                    onChange={(e) => handleFilterDate(e, "endDate")}
                    value={endDate}
                    max={new Date()}
                    isDisabled={isDisabled}
                    onlyDate
                  />
                </Col>
              </Row>
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



export default Filter