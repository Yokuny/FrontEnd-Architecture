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

const dieselFields = [
  "dieselAnterior",
  "dieselRecebido",
  "dieselFornecido",
  "dieselConsumido",
]

const dieselFunction = `
  const dieselAnterior = %dieselAnterior || 0;
  const dieselRecebido = %dieselRecebido || 0;
  const dieselFornecido = %dieselFornecido || 0;
  const dieselConsumido = %dieselConsumido || 0;
  return (dieselAnterior + dieselRecebido - dieselFornecido - dieselConsumido);
`


const ModalFillForm = (props) => {
  const { onClose, formSelected, title, idMachine, fillMachine, isShow } =
    props;

  const [isLoading, setIsLoading] = React.useState();
  const [formData, setFormData] = React.useState({});
  const intl = useIntl();

  React.useEffect(() => {
    if (formSelected?.id) getData(formSelected?.id);
    else if (!!fillMachine && idMachine) setFormData({ embarcacao: idMachine });

    return () => {
      setFormData({});
    };
  }, [formSelected]);

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

  const sumValues = (prevstate, prop, value) => {





    return {

    }
  }

  const onChangeForm = (prop, value) => {

    setFormData((prevstate) => ({
      ...prevstate,
      [prop]: value,
      ...sumValues(prevstate, prop, value)
    }));
  };

  const onSave = () => {
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
      data: formData,
    };

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
    Fetch.post(`/formdata`, dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));

        if (dataEntries) {
          Fetch.post(
            `/upload/formData?idForm=${dataToSave.idForm}&id=${response.data.id}`,
            uploadFormData
          )
            .then((response) => {
              setFormData({});
              setIsLoading(false);
              onClose(true);
            })
            .catch((e) => {
              setIsLoading(false);
            });
        } else {
          setFormData({});
          setIsLoading(false);
          onClose(true);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

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
            data={formData}
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

export default connect(mapStateToProps, undefined)(ModalFillForm);
