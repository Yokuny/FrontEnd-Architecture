import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, Row } from "@paljs/ui";
import { EvaIcon } from "@paljs/ui/Icon"
import styled from "styled-components";
import { connect } from "react-redux";
import { Modal, Fetch, SpinnerFull } from "../../../components";
import MountFormFields from "../MountFormFields/index";
import SidebarTimeline from "../../../components/FormTimeline/SidebarTimeline";

const RowStyled = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"],
  input[type="time"] {
    line-height: 1.1rem;
  }

  #icondate,
  #icontime {
    margin-top: -4px;
  }
`;

const ModalFillForm = React.memo((props) => {
  const { onClose, formSelected, typeForm, title, idMachine, fillMachine, isShow, fields } = props;

  const [showTimeline, setShowTimeline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formEvents, setFormEvents] = useState([]);
  const intl = useIntl();

  // Memoized initial form data
  const initialFormData = useMemo(() => {
    if (fillMachine && idMachine) {
      return { embarcacao: idMachine };
    }
    return {};
  }, [fillMachine, idMachine]);

  useEffect(() => {
    if (formSelected?.id) {
      getData(formSelected.id);
    } else {
      setFormData(initialFormData);
    }

    return () => setFormData({});
  }, [formSelected?.id, initialFormData]);

  const getData = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await Fetch.get(`/formdata?id=${id}`);
      setFormData(response.data?.data || {});
      setFormEvents(response.data?.events || []);
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.loading.form" }));
    } finally {
      setIsLoading(false);
    }
  }, [intl]);

  const onChangeForm = useCallback((prop, value) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: value,
    }));
  }, []);

  const toggleTimeline = useCallback(() => {
    setShowTimeline(prev => !prev);
  }, []);

  const closeTimeline = useCallback(() => {
    setShowTimeline(false);
  }, []);

  const handleClose = useCallback((refresh) => {
    onClose(refresh);
  }, [onClose]);

  // Memoized validation logic
  const requiredFields = (fields, validateNoonReport = false) => {
    if (!fields) return [];

    if (typeForm === "NOON_REPORT" && !validateNoonReport) {
      return fields
        .filter(x => ["vesselName","date","voyage"].includes(x.name))
        .map(x => ({ name: x.name, description: x.description }));
    }

    const regularFields = fields
      .filter(x => x?.isRequired && x?.datatype !== "group")
      .map(x => ({ name: x.name, description: x.description }));

    const groupFields = fields
      .filter(x => x?.datatype === "group")
      .flatMap(x => x.fields || [])
      .filter(x => x?.isRequired)
      .map(x => ({ name: x.name, description: x.description }));

    return [...regularFields, ...groupFields];
  };

  const fieldIsEmpty = (field) => {
    const value = formData[field.name];
    return value === undefined || value === null || value === "" || value === 0;
  };

  const validateForm = (isSend = false) => {
    if (!formSelected?.idForm) {
      toast.warn(intl.formatMessage({ id: "form.required" }));
      return false;
    }

    const missingField = requiredFields(fields, isSend).find(fieldIsEmpty);
    if (missingField) {
      toast.warn(
        intl
          .formatMessage({ id: "field.required.value" })
          .replace("{0}", missingField.description)
      );
      return false;
    }

    // Date validation
    if (formData.dataHoraInicio && formData.dataHoraFim) {
      const startTime = new Date(formData.dataHoraInicio).getTime();
      const endTime = new Date(formData.dataHoraFim).getTime();

      if (startTime > endTime) {
        toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
        return false;
      }

      if (startTime === endTime) {
        toast.warn(intl.formatMessage({ id: "dates.same" }));
        return false;
      }
    }

    return true;
  };

  const processFileUploads = (data) => {
    const uploadFormData = new FormData();

    const appendToFormData = (data, nodeName = "") => {
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              uploadFormData.append(`${nodeName}${key}[${index}]`, item);
            } else if (item && typeof item === 'object') {
              appendToFormData(item, `${nodeName}${key}[${index}].`);
            }
          });
        } 
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (Array.isArray(subValue)) {
              subValue.forEach((item, index) => {
                if (item instanceof File) {
                  uploadFormData.append(`${nodeName}${key}.${subKey}[${index}]`, item);
                } else if (item && typeof item === 'object') {
                  appendToFormData(item, `${nodeName}${key}.${subKey}[${index}].`);
                }
              });
            } else if (subValue instanceof File) {
              uploadFormData.append(`${nodeName}${key}.${subKey}`, subValue);
            }
          });
        }
      });
    };

    appendToFormData(data);
    return uploadFormData;
  };

  const onSave = async (isSend = false) => {
    if (!validateForm(isSend)) return;

    const dataToSave = {
      id: formSelected.id,
      idForm: formSelected.idForm,
      data: formData,
      typeForm: typeForm,
      events: formEvents,
    };

    setIsLoading(true);

    try {
      const response = await Fetch.post(`/formdata`, dataToSave);

      // Handle file uploads if response has ID
      if (response?.data?.id) {
        const uploadFormData = processFileUploads(dataToSave.data);

        if (uploadFormData.entries().next().done === false) {
          try {
            await Fetch.post(
              `/upload/formData?idForm=${dataToSave.idForm}&id=${response.data.id}`,
              uploadFormData
            );
          } catch (error) {
            toast.error(intl.formatMessage({ id: "error.file.upload" }));
          }
        }
      }

      if (isSend) {
        await onSend(dataToSave);
      } else {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
      }

      setFormData({});
      handleClose(true);
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.saving.form" }));
    } finally {
      setIsLoading(false);
    }
  };

  const onSend = async (dataToSave) => {
    try {
      await Fetch.post(`/formdata/send`, dataToSave);
      toast.success(intl.formatMessage({ id: "send.successfull" }));
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.form.send" }));
      throw error;
    }
  };

  const headerButton = () => {
    if (!["NOON_REPORT", "CMMS"].includes(typeForm)) return null;

    return (
      <Button
        className="mr-4 flex-between"
        appearance="ghost"
        size="Tiny"
        onClick={toggleTimeline}
      >
        <EvaIcon name="more-vertical-outline" />
        <FormattedMessage id="timeline" />
      </Button>
    );
  };

  const footerButtons = () => (
    <CardFooter>
      <Row end="xs" className="m-0">
        <Button
          size="Small"
          status="Primary"
          onClick={() => onSave(false)}
          disabled={isLoading}
          className="mr-1 flex-between"
        >
          <EvaIcon name="checkmark-outline" className="mr-1" />
          <FormattedMessage id="save" />
        </Button>
        {typeForm === "NOON_REPORT" && (
          <Button
            size="Small"
            status="Success"
            onClick={() => onSave(true)}
            disabled={isLoading}
            className="mr-1 ml-3 flex-between"
          >
            <EvaIcon name="paper-plane-outline" className="mr-1" />
            <FormattedMessage id="send" />
          </Button>
        )}
      </Row>
    </CardFooter>
  );

  return (
    <>
      <Modal
        textTitle={title}
        onClose={() => handleClose(false)}
        show={isShow}
        styleContent={{ maxHeight: "calc(100vh - 220px)", overflowX: "hidden" }}
        size="ExtraLarge"
        renderHeaderButton={() => headerButton()}
        renderFooter={() => footerButtons()}
      >
        {showTimeline && (
          <SidebarTimeline
            formEvents={formEvents}
            onClose={closeTimeline}
          />
        )}
        <RowStyled>
          <MountFormFields
            idForm={formSelected?.idForm}
            onChange={onChangeForm}
            data={formData}
          />
        </RowStyled>
      </Modal>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
});

ModalFillForm.displayName = 'ModalFillForm';

const mapStateToProps = (state) => ({
  fields: state.form.form?.fields,
  typeForm: state.form.form?.typeForm,
});

export default connect(mapStateToProps)(ModalFillForm);
