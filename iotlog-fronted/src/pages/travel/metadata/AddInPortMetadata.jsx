import { Button, Card, CardBody, CardFooter, CardHeader, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { setDataVoyage } from "../../../actions";
import {
  DeleteConfirmation,
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import BodyInport from "./body-inport";
import HeaderInPortMetadata from "./header/inport";
import EventsTravel from "./events";
import { useNavigate, useSearchParams } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }
  input[type="time"] {
    line-height: 1.1rem;
  }

  a svg {
    top: -7px;
    position: absolute;
    right: -5px;
  }

  overflow-x: hidden;
`;

const AddInPortMetadata = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const idTravel = searchParams.get("id");

  React.useEffect(() => {
    getData(idTravel);
    return () => {
      props.setDataVoyage(undefined);
    };
  }, [idTravel]);

  const getData = (idTravel) => {
    if (idTravel) {
      setIsLoading(true);
      Fetch.get(`/travel?id=${idTravel}`)
        .then((response) => {
          const dateTimeDeparture =
            response.data?.metadata?.dateTimeDeparture ||
            response.data?.dateTimeEnd;
          const dateTimeArrival =
            response.data?.metadata?.dateTimeArrival ||
            response.data?.dateTimeStart;

          const portPointStart = response.data?.portPointSource
            ? {
                value: response.data?.portPointSource?.id,
                label: `${response.data?.portPointSource?.code} - ${response.data?.portPointSource?.description}`,
              }
            : {
                value: response.data?.portPointStart?.id,
                label: `${response.data?.portPointStart?.code} - ${response.data?.portPointStart?.description}`,
              };

          props.setDataVoyage({
            data: {
              code: response.data?.code,
              machine: {
                ...response.data?.machine,
                model: response.data.modelMachine,
              },
              dateTimeStart: response.data?.dateTimeStart,
              portPointStart: portPointStart,
              etd: response.data?.metadata?.etd,
              etdDate:
                response.data?.metadata &&
                moment(response.data?.metadata?.etd).format("YYYY-MM-DD"),
              etdTime:
                response.data?.metadata &&
                moment(response.data?.metadata?.etd).format("HH:mm"),
              dateTimeDeparture,
              dateTimeDepartureDate: dateTimeDeparture
                ? moment(dateTimeDeparture).format("YYYY-MM-DD")
                : "",
              dateTimeDepartureTime: dateTimeDeparture
                ? moment(dateTimeDeparture).format("HH:mm")
                : "",
              dateTimeArrival,
              dateTimeArrivalDate: dateTimeArrival
                ? moment(dateTimeArrival).format("YYYY-MM-DD")
                : "",
              dateTimeArrivalTime: dateTimeArrival
                ? moment(dateTimeArrival).format("HH:mm")
                : "",
              inPortReport: response.data?.metadata?.inPortReport,
              events: response.data?.metadata?.events?.map((x) => ({
                type: x.type,
                observation: x.observation,
                dateStart: moment(x.dateTimeStart).format("YYYY-MM-DD"),
                timeStart: moment(x.dateTimeStart).format("HH:mm"),
                dateEnd: moment(x.dateTimeEnd).format("YYYY-MM-DD"),
                timeEnd: moment(x.dateTimeEnd).format("HH:mm"),
                dateOk: true,
              })),
              formsInPort: response.data?.metadata?.formsInPort,
            },
          });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const mountDate = (date, time) => {
    if (!date) return null;
    const normalizedDate = moment(date);
    return moment(`${normalizedDate.format("YYYY-MM-DD")}T${time}`).toDate();
  };

  const isItemFormIsValidAndShowMessage = (
    formItemName,
    formItemValue,
    fieldsConfig
  ) => {
    const fieldConfig = fieldsConfig?.find((x) => x.name === formItemName);

    if (
      !!fieldConfig?.isRequired &&
      (formItemValue === "" ||
        formItemValue === undefined ||
        formItemValue === null)
    ) {
      toast.warn(
        intl
          .formatMessage({
            id: "field.required.value",
          })
          .replace("{0}", fieldConfig?.description)
      );
      return false;
    }

    if (
      fieldConfig?.datatype === "number" &&
      fieldConfig?.properties?.min !== undefined &&
      formItemValue < fieldConfig?.properties?.min
    ) {
      toast.warn(
        intl
          .formatMessage({
            id: "value.invalid",
          })
          .replace("{0}", fieldConfig?.description)
      );
      return false;
    }

    if (
      fieldConfig?.datatype === "number" &&
      fieldConfig?.properties?.max !== undefined &&
      formItemValue > fieldConfig?.properties?.max
    ) {
      toast.warn(
        intl
          .formatMessage({
            id: "value.invalid",
          })
          .replace("{0}", fieldConfig?.description)
      );
      return false;
    }

    return true;
  };

  const validateForms = (dataForms) => {
    const extractFieldsOfGroups = props?.fields?.flatMap((x) => [
      x,
      ...(x.fields || []),
    ]);

    const formsInListValue = dataForms?.flatMap((x) => [
      ...Object.keys(x).map((y) => ({ field: y, value: x[y] })),
    ]);

    return formsInListValue?.every((x) =>
      isItemFormIsValidAndShowMessage(x.field, x.value, extractFieldsOfGroups)
    );
  };

  const onSave = () => {
    const { data } = props;

    if (
      data?.events?.length &&
      !data?.events?.some((x) => isDatesAreValidAndShowMessage(x, data))
    ) {
      return;
    }

    if (
      props?.fields?.length &&
      data?.formsInPort?.length &&
      !validateForms(data?.formsInPort)
    ) {
      return;
    }

    setIsLoading(true);

    const dataToSave = {
      code: data?.code,
      metadata: {
        idPortPointDestiny: data?.portPointStart?.value,
        idPortPointSource: data?.portPointStart?.value,
        etd: mountDate(data?.etdDate, data?.etdTime),
        dateTimeDeparture: mountDate(
          data?.dateTimeDepartureDate,
          data?.dateTimeDepartureTime
        ),
        dateTimeArrival: mountDate(
          data?.dateTimeArrivalDate,
          data?.dateTimeArrivalTime
        ),
        inPortReport: data?.inPortReport,
        events: data?.events?.map((x) => ({
          type: x.type,
          observation: x.observation,
          dateTimeStart: x.dateTimeStart,
          dateTimeEnd: x.dateTimeEnd,
        })),
        formsInPort: data.formsInPort,
      },
    };
    Fetch.patch(`/travel/metadata?id=${idTravel}`, dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const isDatesAreValidAndShowMessage = (eventLine, data) => {
    if (
      eventLine.dateStart &&
      eventLine.dateEnd &&
      eventLine.timeStart &&
      eventLine.timeEnd
    ) {
      if (
        moment(eventLine.dateTimeEnd).isBefore(moment(eventLine.dateTimeStart))
      ) {
        toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
        return false;
      }
      if (
        moment(eventLine.dateTimeStart).isBefore(moment(data.dateTimeStart))
      ) {
        toast.warn(
          intl.formatMessage({
            id: "date.start.is.before.date.travel",
          })
        );
        return false;
      }
    }

    return true;
  };

  const optionsTypeEvent = [
    {
      value: "personalLogistic",
      label: intl.formatMessage({ id: "personal.logistics" }),
    },
    {
      value: "fill",
      label: intl.formatMessage({ id: "fill" }),
    },
    {
      value: "waitingPort",
      label: intl.formatMessage({ id: "waiting.solutions.port" }),
    },
    {
      value: "technicalUnavailability",
      label: intl.formatMessage({ id: "technical.unavailability" }),
    },
  ];
  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/travel?id=${idTravel}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const showDelete =
    !!idTravel && props.items?.some((x) => x === "/delete-travel");

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            <FormattedMessage id="add.maneuver.metadata" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <HeaderInPortMetadata />
            <BodyInport />
            <EventsTravel optionsEvents={optionsTypeEvent} />
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Row between={showDelete} end={!showDelete} className="ml-1 mr-1">
            {showDelete && (
              <DeleteConfirmation
                message={intl.formatMessage({ id: "delete.message.default" })}
                onConfirmation={onDelete}
              />
            )}
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  data: state.voyage.data,
  fields: state.form.fields,
});

const mapDispatchToProps = (dispatch) => ({
  setDataVoyage: (item) => {
    dispatch(setDataVoyage(item));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddInPortMetadata);
