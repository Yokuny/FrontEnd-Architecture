import { Button, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TextSpan } from "../../components";
import { toast } from "react-toastify";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../components/Table";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../components/Utils";
import TableFormModal from "./TableFormModal";
import ListFiles from "./Downtime/ListFiles";

export default function TableForm({
  fields,
  onChange,
  name,
  data,
  viewOnly = false,
}) {
  const intl = useIntl();

  const getUpdatedFields = () => {
    // idEnterprise is a paliative solution, need refactor
    const idEnterpriseFilter = localStorage.getItem('id_enterprise_filter');
    return fields.map(field => ({
      ...field,
      isRequired: field.isRequired || field.required || (field.name === "anexos"
        && idEnterpriseFilter === "66522106-ccb4-4508-a90b-c1486d95cb78"
        && (edit?.produto === "Óleo (MDO)" || edit?.produto === "Água"))
    }));
  };

  const validateForm = () => {
    const updatedFields = getUpdatedFields();

    const requiredFields = updatedFields.filter(field => field.isRequired);

    for (const field of requiredFields) {

      const value = edit[field.name];
      let isEmpty = true;

      if (field.datatype === 'radio' || field.datatype === 'select') {
        isEmpty = value === undefined || value === null || value === '';
      } else if (field.datatype === 'upload') {
        isEmpty = !value || (Array.isArray(value) && value.length === 0);
      } else if (typeof value === 'object') {
        isEmpty = !value || Object.keys(value).length === 0;
      } else {
        isEmpty = value === undefined || value === null || value === '';
      }

      if (isEmpty) {
        toast.warn(
          intl
            .formatMessage({ id: "field.required.value" })
            .replace("{0}", field.description)
        );
        return false;
      }
    }

    return true;
  };
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState([]);
  const indexEdit = React.useRef(null);

  const [edit, setEdit] = useState({});

  useEffect(() => {
    if (data[name]) {
      setValues(data[name]);
    }

    return () => {
      setValues([]);
    };
  }, [data, name]);

  const handleRemove = (i) => {
    const newValues = values.filter((x, z) => z !== i);

    setValues(newValues);
    onChange(name, newValues);
  };

  const changeEditIndex = (index) => {
    indexEdit.current = index;
    setShowModal(true);
  };

  const handleSave = () => {

    if (!validateForm()) {
      return;
    }

    const newValues = values;

    if (indexEdit.current !== null) {
      newValues[indexEdit.current] = edit;
    } else {
      newValues.push(edit);
    }

    setValues(newValues);
    setEdit({});
    setShowModal(false);

    indexEdit.current = null;

    onChange(name, newValues);
  };

  const formatCell = (field, value) => {
    if (field.datatype === "datetime") {
      if (!value) return "-";

      const date = moment(value);

      return (
        <>
          {date.format("DD MMM YYYY")}
          <br />
          {date.format("HH:mm")}
        </>
      );
    }
    if (field.datatype === "author") {
      return value?.name || "";
    }

    if (field.datatype === "selectScale") {
      return value?.label;
    }

    if (field.datatype === "selectOperationContract") {
      return value?.value;
    }

    if (field.datatype === "selectPlatform") {
      const platform = data?.platforms?.find((x) => x.id === value);

      if (!platform) return "";

      return `${platform.name}${
        platform.acronym ? ` - ${platform.acronym}` : ""
      }`;
    }

    if (field.datatype === "calculated") {
      if (value === undefined || value === null) return "";

      return floatToStringBrazilian(value, 2);
    }

    if (field.datatype === "number") {
      if (field.properties?.sizeDecimals)
        return floatToStringExtendDot(value, field.properties?.sizeDecimals);

      return value;
    }

    if (field.datatype === "upload") {
      return <ListFiles files={value} />;
    }

    return value;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEdit({});
  };

  const handleChangeModal = (prop, value) => {
    setEdit((prev) => ({ ...prev, [prop]: value }));
  };

  const getAlign = (field) => {
    if (field.datatype === "number") {
      return "end";
    }
    if (field.datatype === "datetime" ||
      field.datatype === "date" ||
      field.datatype === "time") {
      return "center";
    }

    return "start";
  };

  return (
    <>
      <Row center="xs">
        <TABLE>
          {!!fields?.length && (
            <THEAD>
              <TRH>
                {fields.map((field) => (
                  <TH textAlign={getAlign(field)}>
                    <TextSpan apparence="p2" hint>
                      {field.description}
                    </TextSpan>
                  </TH>
                ))}
                {!viewOnly && (
                  <TH textAlign="center" style={{ width: 80 }}>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="actions" />
                    </TextSpan>
                  </TH>
                )}
              </TRH>
            </THEAD>
          )}
          <TBODY>
            {values.map((value, i) => (
              <>
                <TR key={`${i}-c`} isEvenColor={i % 2 === 0}>
                  {fields.map((field) => (
                    <TD textAlign={getAlign(field)}>
                      <TextSpan apparence="p2">
                        {formatCell(field, value[field.name])}
                      </TextSpan>
                    </TD>
                  ))}
                  {!viewOnly && (
                    <TD>
                      <Row className="m-0" around="xs">
                        <Button
                          size="Tiny"
                          status="Info"
                          appearance="ghost"
                          style={{ padding: 2 }}
                          onClick={() => {
                            changeEditIndex(i);
                            setEdit(value);
                          }}
                        >
                          <EvaIcon name="edit-2-outline" />
                        </Button>
                        <Button
                          size="Tiny"
                          status="Danger"
                          appearance="ghost"
                          className="ml-1"
                          style={{ padding: 2 }}
                          onClick={() => handleRemove(i)}
                        >
                          <EvaIcon name="trash-2-outline" />
                        </Button>
                      </Row>
                    </TD>
                  )}
                </TR>
              </>
            ))}
            {!!values?.length && (
              <>
                <TR>
                  {fields.map((field) => (
                    <>
                      {field.datatype === "number" && field?.sum ? (
                        <TD textAlign={getAlign(field)}>
                          <TextSpan apparence="s3">
                            {floatToStringExtendDot(
                              values
                                .filter((value) => value[field.name])
                                .reduce((acc, curr) => {
                                  return acc + curr[field.name];
                                }, 0),
                              field.properties?.sizeDecimals
                            )}
                          </TextSpan>
                        </TD>
                      ) : (
                        <TD></TD>
                      )}
                    </>
                  ))}
                  <TD></TD>
                </TR>
              </>
            )}
          </TBODY>
        </TABLE>

        {!viewOnly && (
          <Button
            size="Tiny"
            status="Info"
            appearance="ghost"
            className={`flex-between ml-4 mt-4`}
            onClick={() => changeEditIndex(values?.length)}
          >
            <EvaIcon name="plus-circle-outline" className="mr-1" />
            <FormattedMessage id="add" />
          </Button>
        )}
      </Row>

      {showModal && (
        <TableFormModal
          showModal={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSave}
          fields={getUpdatedFields()}
          data={edit}
          handleChange={handleChangeModal}
        />
      )}
    </>
  );
}
