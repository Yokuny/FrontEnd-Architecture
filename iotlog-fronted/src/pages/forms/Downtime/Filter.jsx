import { Button, Col, EvaIcon, Row, Select, Checkbox } from "@paljs/ui";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { LabelIcon, SelectMachineEnterprise } from "../../../components";
import { Vessel } from "../../../components/Icons";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { ContainerRow } from "./styles";
import { SelectView } from "../../../components/Select";

export default function FilterData({
  onSearchCallback,
  dataInitial,
  idEnterprise,
  view,
  setView
}) {

  const [machines, setMachines] = useState([]);
  const [initialDate, setInitialDate] = useState();
  const [finalDate, setFinalDate] = useState();
  const [status, setStatus] = useState();

  const theme = useTheme();
  const intl = useIntl();

  React.useEffect(() => {
    if (dataInitial) {
      setMachines(dataInitial?.machines?.split(",") || []);
      setInitialDate(dataInitial?.initialDate);
      setFinalDate(dataInitial?.finalDate);
      setStatus(dataInitial?.status);
    }
  }, []);

  function handleFilterMachines(machines) {
    setMachines(machines);
  }

  function handleFilterDate(date, type) {
    if (type === "initialDate") {
      setInitialDate(date);
    } else {
      setFinalDate(date);
    }
  }

  function handleSearch(isClear = false) {
    if (isClear) {
      setMachines([]);
      setInitialDate();
      setFinalDate();
      setStatus();
      onSearchCallback({
        idEnterprise
      });
      return
    }

    if (initialDate && finalDate && new Date(initialDate) > new Date(finalDate)) {
      toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }

    onSearchCallback({
      machines: machines.filter(Boolean),
      initialDate: initialDate ? new Date(initialDate).toISOString() : undefined,
      finalDate: finalDate ? new Date(finalDate).toISOString() : undefined,
      status,
      idEnterprise,
    });
  }

  const hasFilter = dataInitial?.machines?.length || dataInitial?.initialDate || dataInitial?.finalDate || dataInitial?.status;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <>
      <ContainerRow middle="xs" className="mb-4">
        <Col breakPoint={{ xs: 12, md: 10 }} className="mb-2">
          <Row>
            <Col breakPoint={{ xs: 12, md: 12 }} className="mb-2">
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
                onChange={(value) => handleFilterMachines(value?.map(x => x.value))}
                placeholder="vessels.select.placeholder"
                value={machines}
                idEnterprise={idEnterprise}
                isMulti={true}
              />
            </Col>

            <Col breakPoint={{ xs: 12, md: 4 }} className="mb-2">
              <LabelIcon
                iconName={"calendar-outline"}
                title={<FormattedMessage id="date.start" />}
              />
              <InputDateTime
                onChange={(e) => handleFilterDate(e, "initialDate")}
                value={initialDate}
                max={finalDate ? new Date(finalDate) : new Date()}
              />
            </Col>
            <Col breakPoint={{ xs: 12, md: 4 }} className="mb-2">
              <LabelIcon
                iconName={"calendar-outline"}
                title={<FormattedMessage id="date.end" />}
              />
              <InputDateTime
                onChange={(e) => handleFilterDate(e, "finalDate")}
                value={finalDate}
                max={yesterday}
              />
            </Col>
            <Col breakPoint={{ xs: 12, md: 4 }} className="mb-2">
              <LabelIcon
                iconName={"eye-outline"}
                title={<FormattedMessage id="view.analytics" />}
              />
              <SelectView
                onChange={(value) => setView(value)}
                value={view}
              />
            </Col>
          </Row>
        </Col>

        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2 pt-2">
          <Row className="m-0" center="xs">
            <Button
              className="mt-4 flex-between"
              status={hasFilter ? "Info" : "Basic"}
              size="Tiny"
              onClick={() => handleSearch()}
            >
              <EvaIcon name="search-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
            {hasFilter && <Button
              className="mt-4 flex-between"
              status="Danger"
              size="Tiny"
              appearance="ghost"
              onClick={() => handleSearch(true)}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage id="clear.filter" />
            </Button>}
          </Row>
        </Col>
      </ContainerRow>
    </>
  );
}
