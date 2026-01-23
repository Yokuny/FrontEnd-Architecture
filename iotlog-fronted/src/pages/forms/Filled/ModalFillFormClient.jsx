import React from "react";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, Row } from "@paljs/ui";
import styled from "styled-components";
import { connect } from "react-redux";
import { Modal, Fetch, SpinnerFull } from "../../../components";
import MountFormFields from "../MountFormFields/index";

const RowStyled = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }

  input[type="time"] {
    line-height: 1.1rem;
  }

  #icondate {
    margin-top: -4px;
  }
  #icontime {
    margin-top: -4px;
  }
`;

const ModalFillFormClient = (props) => {
  const { onClose, formSelected, title, fillMachine, isShow } =
    props;

  const [isLoading, setIsLoading] = React.useState();
  const [formData, setFormData] = React.useState({});
  const [fieldLast, setFieldLast] = React.useState();

  const intl = useIntl();

  React.useEffect(() => {
    if (formSelected?.id) getData(formSelected?.id);
    else if (!!fillMachine) setFormData({ embarcacao: formData.embarcacao });

    return () => {
      setFormData({});
    };
  }, [formSelected?.id]);

  React.useEffect(() => {
    if (isShow && formSelected?.idForm
      && formData?.embarcacao &&
      !formSelected?.id
    ) {
      fetchLastFilledForm(formSelected.idForm, formData.embarcacao);
    }
  }, [isShow, formSelected?.idForm, formData?.embarcacao]);

  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/formdata?id=${id}`)
      .then((response) => {
        setFormData(response.data?.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };


  const fetchLastFilledForm = async (idForm, embarcacao) => {
    setIsLoading(true);
    try {
      const response = await Fetch.get(
        `/formdata/lastfilled?idForm=${idForm}&idMachine=${embarcacao}`
      );
      setFieldLast(response.data?.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onChangeForm = (prop, value) => {
    if (prop === "embarcacao" && !formSelected?.id) {
      fetchLastFilledForm(formSelected.idForm, value);
    }
    setFormData((prevstate) => ({
      ...prevstate,
      [prop]: value,
    }));
  };

  const onSave = async () => {
    if (!formSelected.idForm) {
      toast.warn(intl.formatMessage({ id: "form.required" }));
      return;
    }

    const validation = props.fields
      ?.filter((x) => x?.isRequired)
      .find((x) => {
        if (
          formData[x.name] === undefined ||
          formData[x.name] === null ||
          formData[x.name] === "" ||
          formData[x.name] === 0
        ) {
          return true;
        }
        return false;
      });

    if (validation) {
      toast.warn(
        intl
          .formatMessage({ id: "field.required.value" })
          .replace("{0}", validation.description)
      );
      return;
    }

    if (formData.dataHoraInicio && formData.dataHoraFim) {
      if (
        new Date(formData.dataHoraInicio).getTime() >
        new Date(formData.dataHoraFim).getTime()
      ) {
        toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
        return;
      }

      if (
        new Date(formData.dataHoraInicio).getTime() ===
        new Date(formData.dataHoraFim).getTime()
      ) {
        toast.warn(intl.formatMessage({ id: "dates.same" }));
        return;
      }
    }

    const dataToSave = {
      id: formSelected.id,
      idForm: formSelected.idForm,
      data: formData
    };

    if (fieldLast) {
      if (dataToSave.data?.dieselAnterior === undefined) {
        dataToSave.data.dieselAnterior = fieldLast?.dieselExistente;
      }
      if (dataToSave.data?.dieselAnteriorCons === undefined) {
        dataToSave.data.dieselAnteriorCons = fieldLast?.dieselExistenteCons;
      }
      if (dataToSave.data?.aguaAnterior === undefined) {
        dataToSave.data.cargaAnterior = fieldLast?.cargaExistente;
      }
    }

    function isFile(item) {
      return item instanceof File;
    }

    function entries(obj) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          return {
            [key]: value.flatMap((x) => (isFile(x) ? x : entries(x))),
            ...acc,
          };
        }

        return acc;
      }, {});
    }

    const uploadFormData = new FormData();

    function appendToFormData(data, nodeName = "") {
      Object.entries(data).forEach(([key, value]) => {
        value.map((item, index) =>
          item instanceof File
            ? uploadFormData.append(`${nodeName}${key}[${index}]`, item)
            : item && appendToFormData(item, `${key}[${index}].`)
        );
      });
    }

    const dataEntries = entries(dataToSave.data);
    appendToFormData(dataEntries || {});

    setIsLoading(true);
    try {
      const response = await Fetch.post(`/formdata`, dataToSave)
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      if (dataEntries) {
        await Fetch.post(
          `/upload/formData?idForm=${dataToSave.idForm}&id=${response.data.id}`,
          uploadFormData
        )
      }
      setFormData({});
      setIsLoading(false);
      onClose(true);
    }
    catch (e) {
      setIsLoading(false);
    }
  };

  const mergedData = !formSelected?.id && fieldLast ? {
    ...formData,
    dieselAnterior: fieldLast?.dieselExistente,
    dieselAnteriorCons: fieldLast?.dieselExistenteCons,
    cargaAnterior: fieldLast?.cargaExistente,
  } : formData;

  return (
    <>
      <Modal
        textTitle={title}
        onClose={() => onClose(false)}
        show={isShow}
        styleContent={{ maxHeight: "calc(100vh - 220px)", overflowX: "hidden" }}
        size="ExtraLarge"
        renderFooter={() => (
          <CardFooter>
            <Row end="xs" className="m-0">
              <Button
                size="Small"
                status="Primary"
                onClick={onSave}
                disabled={isLoading}
                className="mr-1 flex-between"
              >
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <RowStyled>
          <MountFormFields
            idForm={formSelected?.idForm}
            onChange={(prop, value) => onChangeForm(prop, value)}
            data={mergedData}
          />
        </RowStyled>
      </Modal>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  fields: state.form.form?.fields,
});

export default connect(mapStateToProps, undefined)(ModalFillFormClient);
