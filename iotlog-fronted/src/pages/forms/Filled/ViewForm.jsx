import { CardBody, CardHeader, Col, Row } from "@paljs/ui";
import moment from "moment";
import { CardNoShadow, LabelIcon, TextSpan } from "../../../components";
import { onCalculateFieldValue } from "./CalculatedField";
import { floatToStringExtendDot } from "../../../components/Utils";
import ListFiles from "../Downtime/ListFiles";
import TableForm from "../TableForm";
import { onExecFunction } from "./FunctionField";

export default function ViewForm({ fields, values, isPrint = false }) {
  const takeCareData = (field, data) => {
    if (data === undefined) {
      return "";
    }

    const value = data[field?.name];

    if (field?.datatype === "calculated") {
      const valueCalc = onCalculateFieldValue(data, field?.properties);
      return valueCalc ? floatToStringExtendDot(valueCalc, 2) : "";
    }
    if (field?.datatype === "functionfield") {
      const valueExec = onExecFunction(data, field?.properties);
      return valueExec ? floatToStringExtendDot(valueExec, 2) : "";
    }

    if (field?.datatype === "datetime") {
      return value ? moment(value).format("DD MMM YYYY, HH:mm") : "";
    }
    if (field?.datatype === "date") {
      return value ? moment(value).format("DD MMM YYYY") : "";
    }

    if (["selectOperationContract", "selectScale"].includes(field?.datatype)) {
      return value?.label || "";
    }

    if (field?.datatype === "number") {
      return value !== undefined
        ? floatToStringExtendDot(value, field?.properties?.sizeDecimals)
        : "";
    }

    if (field.datatype === "selectFence") {
      if (field.properties?.isMulti) {
        return data[field.name].map((fence) => fence.label).join(", ");
      }

      return data[field.name]?.label;
    }

    if (field.datatype === "upload") {
      return <ListFiles files={data[field.name]} />;
    }

    if (field.datatype === "author") {
      return value?.name || "";
    }

    return value;
  };

  return (
    <>
      {fields?.map((field, index) => {
        return (
          <Col
            key={index}
            breakPoint={{ md: field?.size, xs: isPrint ? field?.size : 12 }}
            className="mb-4"
          >
            {field?.datatype === "group" ? (
              <CardNoShadow>
                <CardHeader>
                  <TextSpan apparence="s2" hint>
                    {field?.description}
                  </TextSpan>
                </CardHeader>
                <CardBody>
                  {field?.subdatatype === "list" ? (
                    <TableForm
                      fields={field?.fields}
                      data={values?.data}
                      name={field?.name}
                      viewOnly
                    />
                  ) : (
                    <Row>
                      {field?.fields?.map((fieldInternal, indexInternal) => (
                        <>
                          <Col
                            key={`${indexInternal}-${index}-k`}
                            breakPoint={{
                              md: fieldInternal.size,
                              xs: isPrint ? fieldInternal.size : 12,
                            }}
                            className="mb-2"
                          >
                            <LabelIcon title={fieldInternal?.description} />
                            <TextSpan apparence="s2" className="ml-1">
                              {takeCareData(fieldInternal, values?.data)}
                            </TextSpan>
                          </Col>
                        </>
                      ))}
                    </Row>
                  )}
                </CardBody>
              </CardNoShadow>
            ) : field?.datatype === "table" ? (
              <TableForm
                fields={field?.fields}
                data={values?.data}
                name={field?.name}
                viewOnly
              />
            ) : (
              <>
                <LabelIcon title={field?.description} />
                <TextSpan apparence="s2" className="ml-1">
                  {takeCareData(field, values?.data)}
                </TextSpan>
              </>
            )}
          </Col>
        );
      })}
    </>
  );
}
