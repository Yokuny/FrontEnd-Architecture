import { Button, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { TD } from "../../components/Table";
import { InputDecimal } from "../../components";
import { SkeletonThemed } from "../../components/Skeleton";
import CopyButton from "./CopyButton";

function EditMinMax({
  itemConfig,
  onHandleChangeMinMax,
  dataMinMaxInitial,
  currentValues,
  isLoadingMinMax = false,
}) {
  const intl = useIntl();

  const [min, setMin] = useState(currentValues?.min);
  const [max, setMax] = useState(currentValues?.max);
  const [isAlert, setIsAlert] = useState(currentValues?.isAlert);
  const [booleanNotify, setBooleanNotify] = useState(currentValues?.booleanNotify);

  const booleanNotifyOptions = [
    { value: true, label: intl.formatMessage({ id: "notify.when.true" }) },
    { value: false, label: intl.formatMessage({ id: "notify.when.false" }) },
  ];

  useEffect(() => {
    setMin(currentValues?.min);
    setMax(currentValues?.max);
    setIsAlert(currentValues?.isAlert);
    setBooleanNotify(currentValues?.booleanNotify);
  }, [currentValues]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (min !== currentValues?.min) {
        onHandleChangeMinMax(itemConfig.idSensor, "min", min);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [min, itemConfig.idSensor, onHandleChangeMinMax]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (max !== currentValues?.max) {
        onHandleChangeMinMax(itemConfig.idSensor, "max", max);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [max, itemConfig.idSensor, onHandleChangeMinMax]);

  useEffect(() => {
    if (isAlert !== currentValues?.isAlert) {
      onHandleChangeMinMax(itemConfig.idSensor, "isAlert", isAlert);
    }
  }, [isAlert, itemConfig.idSensor, onHandleChangeMinMax]);

  useEffect(() => {
    if (booleanNotify !== currentValues?.booleanNotify) {
      onHandleChangeMinMax(itemConfig.idSensor, "booleanNotify", booleanNotify);
    }
  }, [booleanNotify, itemConfig.idSensor, onHandleChangeMinMax]);


  const onApplyCopy = () => {
    setMin(itemConfig?.min);
    setMax(itemConfig?.max);
  }

  if (isLoadingMinMax) {
    return <>
      <TD><SkeletonThemed /></TD>
      <TD><SkeletonThemed /></TD>
      <TD><SkeletonThemed /></TD>
      <TD><SkeletonThemed /></TD>
    </>
  }

  if (!!itemConfig.type && !["decimal", "double", "int", "bool", "bool_number"].includes(itemConfig.type)) {
    return <>
      <TD></TD>
      <TD></TD>
      <TD></TD>
      <TD></TD>
    </>
  }

  const hasValue = (value) => value !== null && value !== undefined && value !== "";

  if(itemConfig.type === 'bool' || itemConfig.type === 'bool_number') {
    const selectedNotifyOption = booleanNotifyOptions.find(
      (opt) => opt.value === booleanNotify
    ) || null;

    return <>
      <TD textAlign="center">
      </TD>
      <TD colSpan={2}>
        <Select
          options={booleanNotifyOptions}
          placeholder={intl.formatMessage({ id: "select.notify.condition" })}
          value={selectedNotifyOption}
          isClearable
          onChange={(option) => setBooleanNotify(option?.value)}
          menuPosition="fixed"
          size="Small"
        />
      </TD>
      <TD textAlign="center">
        {booleanNotify !== null && booleanNotify !== undefined && <Button
          appearance="ghost"
          size="Tiny"
          status={!isAlert ? "Basic" : "Warning"}
          className="flex-between"
          onClick={() => setIsAlert(prev => !prev)}
        >
          <EvaIcon name={!!isAlert ? "bell-outline" : "bell-off-outline"} className="mr-1" />
          {!!isAlert ? "ON" : "OFF"}
        </Button>}
      </TD>
    </>
  }

  return <>
    <TD textAlign="center">
      <CopyButton
        isLoading={isLoadingMinMax}
        onApplyCopy={onApplyCopy} />
    </TD>
    <TD>
      <Row center="xs" className="m-0" style={{ zIndex: 1 }}>
        <InputGroup>
          <InputDecimal
            value={min}
            onChange={setMin}
            sizeDecimals={2}
            placeholder="Min"
            style={{ textAlign: min !== null ? "right" : "left" }}
          />
        </InputGroup>
      </Row>
    </TD>
    <TD>
      <Row center="xs" className="m-0" style={{ zIndex: 1 }}>
        <InputGroup>
          <InputDecimal
            value={max}
            onChange={setMax}
            placeholder="Max"
            style={{ textAlign: max !== null && max !== undefined ? "right" : "left" }}
          />
        </InputGroup>
      </Row>
    </TD>
    <TD textAlign="center">
      {(hasValue(min) || hasValue(max)) && <Button
        appearance="ghost"
        size="Tiny"
        status={!isAlert ? "Basic" : "Warning"}
        className="flex-between"
        onClick={() => setIsAlert(prev => !prev)}
      >
        <EvaIcon name={!!isAlert ? "bell-outline" : "bell-off-outline"} className="mr-1" />
        {!!isAlert ? "ON" : "OFF"}
      </Button>}
    </TD>
  </>
}

export default React.memo(EditMinMax);
