import {
  Card,
  CardBody,
  CardHeader,
  EvaIcon,
  InputGroup,
  Radio,
  Row,
  Select,
} from "@paljs/ui";
import AuthorField from "../register/forms/type/AuthorField";
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";
import { nanoid } from "nanoid";
import {
  LabelIcon,
  SelectMachine,
  SelectPlatformEnterprise,
  TextSpan,
  Toggle,
  UploadFile,
} from "../../components";
import InputDateTime from "../../components/Inputs/InputDateTime";
import { InputDecimal } from "../../components/Inputs/InputDecimal";
import { SelectFence, SelectOperationsContract } from "../../components/Select";
import FunctionField from "./Filled/FunctionField";
import ContentItem from "./Item";
import SelectLocalScales from "./select/SelectLocalScales";
import TableForm from "./TableForm";
import CalculatedField from "./Filled/CalculatedField";

const ContainerIcon = styled.div`
  ${({ theme }) => css`
    color: ${theme.colorBasic600};
  `}
  position: absolute;
  right: 12px;
  top: 7px;
`;

const ContainerDataTime = styled(InputGroup)`
  input {
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      opacity: 0;
      width: 100%;
      z-index: 99;
      cursor: pointer;
    }
  }

  #icontime {
    margin-top: 0 !important;
  }
`;

const CardNoShadow = styled(Card)`
  box-shadow: none;
  margin-bottom: 1rem;

  ${({ theme }) => css`
    border: 1px solid ${theme.borderBasicColor3};
  `}
`;

export default function Item(props) {
  const [status, setStatus] = React.useState("Basic");
  const intl = useIntl();
  const theme = useTheme();
  const onStartRef = React.useRef(false);

  React.useEffect(() => {
    onStartRef.current = true;
    return () => {
      onStartRef.current = false;
    }
  },[]);

  const { onChange, data } = props;
  const { name } = props.field;

  const onBlur = () => {
    const value = data[name];
    if (
      !!props.field?.isRequired &&
      (value === "" || value === undefined || value === null)
    ) {
      toast.warn(
        intl
          .formatMessage({
            id: "field.required.value",
          })
          .replace("{0}", props.field?.description)
      );
      setStatus("Danger");
      return;
    }

    if (
      props.field?.datatype === "number" &&
      props.field?.properties?.min !== undefined &&
      value < props.field?.properties?.min
    ) {
      toast.warn(
        intl
          .formatMessage({
            id: "value.invalid",
          })
          .replace("{0}", props.field?.description)
      );
      setStatus("Danger");
      return;
    }

    if (
      props.field?.datatype === "number" &&
      props.field?.properties?.max !== undefined &&
      value > props.field?.properties?.max
    ) {
      toast.warn(
        intl
          .formatMessage({
            id: "value.invalid",
          })
          .replace("{0}", props.field?.description)
      );
      setStatus("Danger");
      return;
    }

    setStatus("Basic");
  };

  const mountTitle = (field) => {
    return `${field?.description}${field?.isRequired ? " *" : ""}`;
  };

  switch (props.field?.datatype) {
    case "number":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <InputGroup fullWidth status={status}>
            <InputDecimal
              onChange={(e) => onChange(name, e)}
              value={data[name]}
              sizeDecimals={props.field?.properties?.sizeDecimals}
              onBlur={onBlur}
              isRequired={props.field?.isRequired}
            />
            <ContainerIcon>
              <TextSpan
                apparence="s2"
                style={{
                  color: status === "Danger" ? theme[`color${status}500`] : "",
                }}
              >
                {props.field?.properties?.unit}
              </TextSpan>
            </ContainerIcon>
          </InputGroup>
        </>
      );
    case "text":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <InputGroup fullWidth status={status}>
            <input
              type="text"
              placeholder={mountTitle(props.field)}
              onChange={(e) => onChange(name, e.target.value)}
              value={data[name]}
              onBlur={onBlur}
              readOnly={props.field?.properties?.readOnly}
              required={props.field?.isRequired}
            />
          </InputGroup>
        </>
      );
    case "textView":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-2" />
          <TextSpan apparence="s1" className="ml-1">
            {data[name]}
          </TextSpan>
        </>
      );
    case "textArea":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <InputGroup fullWidth status={status}>
            <textarea
              placeholder={mountTitle(props.field)}
              onChange={(e) => onChange(name, e.target.value)}
              value={data[name]}
              onBlur={onBlur}
              rows={2}
              required={props.field?.isRequired}
            />
          </InputGroup>
        </>
      );
    case "datetime": {
      const isUseDefault = props.field?.properties?.useDateNowDefault;
      if (!onStartRef.current && !!data && !data[name] && isUseDefault) {
        onChange(name, new Date())
      }

      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <InputDateTime
            onChange={(e) => onChange(name, e)}
            value={data[name]}
            isRequired={props.field?.isRequired}
          />
        </>
      );
    }
    case "date": {
      const isUseDefaultDate = props.field?.properties?.useDateNowDefault;
      if (!onStartRef.current && !!data && !data[name] && isUseDefaultDate) {
        onChange(name, new Date())
      }
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <InputDateTime
            onlyDate
            onChange={(e) => onChange(name, e)}
            value={data[name]}
            isRequired={props.field?.isRequired}
          />
        </>
      );
    }
    case "time":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <ContainerDataTime fullWidth>
            <input
              onChange={(e) => onChange(name, e.target.value)}
              value={data[name]}
              type="time"
              disabled={props.field?.properties?.readOnly}
              required={props.field?.isRequired}
            />
            <ContainerIcon>
              <EvaIcon
                name="clock-outline"
                status="Basic"
                options={{ id: "icontime" }}
              />
            </ContainerIcon>
          </ContainerDataTime>
        </>
      );
    case "boolean":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <Toggle
            className="mt-2"
            onChange={(e) => onChange(name, !data[name])}
            checked={!!data[name]}
          />
        </>
      );
    case "select":
      const options = props.field?.properties?.optionsMap?.length
        ? props.field?.properties?.optionsMap
        : props.field?.properties?.options?.map((y) => ({
          value: y,
          label: y,
        }));
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <Select
            className="mt-1"
            options={options}
            menuPosition="fixed"
            placeholder={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose?.value)}
            value={options?.find((y) => y.value === data[name])}
            isClearable={!!props.field?.properties?.isClearable}
          />
        </>
      );
    case "selectMachine": {
      const query = [
        `idEnterprise=${localStorage.getItem("id_enterprise_filter")}`,
      ]

      if (props.field?.idModel?.length) {
        props.field?.idModel?.map((model) => query.push(`idModel[]=${model.value}`))
      }

      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <SelectMachine
            className="mt-2"
            placeholderText={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose?.value)}
            value={data[name]}
            valueIsSimple
            oneSelected
            filterQuery={query.join("&")}
          />
        </>
      );
    }
    case "selectPlatform":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <SelectPlatformEnterprise
            className="mt-2"
            placeholderText={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose?.value)}
            value={data[name]}
            idEnterprise={localStorage.getItem("id_enterprise_filter")}
            valueIsSimple
          />
        </>
      );
    case "selectScale":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <SelectLocalScales
            placeholderText={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose)}
            value={data[name]}
            idEnterprise={localStorage.getItem("id_enterprise_filter")}
            valueIsSimple
          />
        </>
      );
    case "selectOperationContract":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <SelectOperationsContract
            placeholderText={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose)}
            value={data[name]}
            idEnterprise={localStorage.getItem("id_enterprise_filter")}
            idMachine={data.embarcacao}
          />
        </>
      );
    case "calculated": {
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <CalculatedField
            placeholder={mountTitle(props.field)}
            data={data}
            onChange={(e) => onChange(name, e)}
            value={data[name]}
            propertiesConfig={props.field?.properties}
          />
        </>
      );
    }
    case "functionfield": {
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <FunctionField
            placeholder={mountTitle(props.field)}
            data={data}
            onChange={(e) => onChange(name, e)}
            value={data[name]}
            propertiesConfig={props.field?.properties}
          />
        </>
      );
    }
    case "group":
      return (
        <>
          <CardNoShadow>
            <CardHeader>
              <TextSpan apparence="s2">{mountTitle(props.field)}</TextSpan>
            </CardHeader>
            <CardBody style={{ overflowX: "hidden" }}>
              <Row>
                {props.field?.fields?.map((x, i) => (
                  <ContentItem
                    key={`${i}-${x.name}`}
                    data={data}
                    field={x}
                    onChange={onChange}
                  />
                ))}
              </Row>
            </CardBody>
          </CardNoShadow>
        </>
      );
    case "table":
      return (
        <>
          <CardNoShadow>
            <CardHeader>
              <TextSpan apparence="s2">{mountTitle(props.field)}</TextSpan>
            </CardHeader>
            <CardBody style={{ overflowX: "hidden" }}>
              <TableForm
                fields={props.field?.fields}
                onChange={onChange}
                name={props.field.name}
                data={data}
              />
            </CardBody>
          </CardNoShadow>
        </>
      );
    case "selectFence":
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <SelectFence
            className="mt-2"
            placeholderText={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose)}
            value={data[name]}
            idEnterprise={localStorage.getItem("id_enterprise_filter")}
            isMulti={props.field?.properties?.isMulti}
          />
        </>
      );
    case "upload":
      const mimitypes = {
        "image/*": ["jpg", "jpeg", "png"],
        "application/pdf": ["pdf"],
      };

      const accept = props.field?.properties?.accept?.reduce((acc, curr) => {
        acc[curr] = mimitypes[curr];

        return acc;
      }, {});
      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <UploadFile
            onAddFiles={(e) => onChange(name, e)}
            files={data[name] || []}
            onRemoveFile={(e) =>
              onChange(
                name,
                data[name].filter((_, x) => x !== e)
              )
            }
            accept={accept}
            multiple={props.field?.properties?.isMulti}
          />
        </>
      );
    case "author": {
              return (
          <AuthorField
            onChange={(value) => onChange(name, value)}
            data={data[name]}
          />
      );
    }
    case "radio": {
      const options = props.field?.properties?.optionsMap?.length
        ? props.field?.properties?.optionsMap
        : props.field?.properties?.options?.map((y) =>
          y === data[name]
            ? {
              value: y,
              label: y,
              checked: true,
            }
            : {
              value: y,
              label: y,
            }
        );

      return (
        <>
          <LabelIcon title={mountTitle(props.field)} className="mb-1" />
          <Radio
            key={nanoid(4)}
            options={options}
            name={name}
            label={mountTitle(props.field)}
            onChange={(choose) => onChange(name, choose)}
          />
        </>
      );
    }
    default:
      return <></>;
  }
}
