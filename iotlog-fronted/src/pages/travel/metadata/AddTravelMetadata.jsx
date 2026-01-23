import { Button, Card, CardBody, CardFooter, CardHeader, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  DeleteConfirmation,
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import DataCharge from "./data-charge";
import HeaderTravelMetadata from "./header/travel";
import EventsTravel from "./events";
import ReportTypes from "./types";
import { setDataVoyage } from "../../../actions";
import { DENSITY_DEFAULT } from "../Utils";
import { useNavigate } from "react-router-dom";
import { FormInVoyage } from "./forms";

const ContainerRow = styled(Row)`
  input[type="text"] {
    line-height: 0.5rem;
  }

  overflow-x: hidden;
`;

const AddTravelMetadata = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const navigate = useNavigate();
  const idTravel = new URL(window.location.href).searchParams.get("id");

  React.useLayoutEffect(() => {
    getData();

    return () => {
      props.setDataVoyage(undefined);
    };
  }, []);

  const getData = () => {
    if (idTravel) {
      setIsLoading(true);
      Fetch.get(`/travel?id=${idTravel}`)
        .then((response) => {
          const dateTimeDeparture =
            response.data?.metadata?.dateTimeDeparture ||
            response.data?.dateTimeStart;
          const dateTimeArrival =
            response.data?.metadata?.dateTimeArrival ||
            response.data?.dateTimeEnd;
          props.setDataVoyage({
            data: {
              code: response.data?.code,
              machine: {
                ...response.data?.machine,
                model: response.data.modelMachine,
              },
              dateTimeStart: response.data?.dateTimeStart,
              eta: response.data?.metadata?.eta,
              etaDate:
                response.data?.metadata &&
                moment(response.data?.metadata?.eta).format("YYYY-MM-DD"),
              etaTime:
                response.data?.metadata &&
                moment(response.data?.metadata?.eta).format("HH:mm"),
              dateTimeDeparture,
              dateTimeDepartureDate:
                moment(dateTimeDeparture).format("YYYY-MM-DD"),
              dateTimeDepartureTime: moment(dateTimeDeparture).format("HH:mm"),
              dateTimeArrival,
              dateTimeArrivalDate: dateTimeArrival
                ? moment(dateTimeArrival).format("YYYY-MM-DD")
                : "",
              dateTimeArrivalTime: dateTimeArrival
                ? moment(dateTimeArrival).format("HH:mm")
                : "",
              portDestiny: response.data?.portPointDestiny && {
                value: response.data?.portPointDestiny?.id,
                label: `${response.data?.portPointDestiny?.code} - ${response.data?.portPointDestiny?.description}`,
              },
              portPointStart: response.data?.portPointSource
                ? {
                    value: response.data?.portPointSource?.id,
                    label: `${response.data?.portPointSource?.code} - ${response.data?.portPointSource?.description}`,
                  }
                : {
                    value: response.data?.portPointStart?.id,
                    label: `${response.data?.portPointStart?.code} - ${response.data?.portPointStart?.description}`,
                  },
              events: response.data?.metadata?.events?.map((x) => ({
                type: x.type,
                observation: x.observation,
                dateStart: moment(x.dateTimeStart).format("YYYY-MM-DD"),
                timeStart: moment(x.dateTimeStart).format("HH:mm"),
                dateEnd: moment(x.dateTimeEnd).format("YYYY-MM-DD"),
                timeEnd: moment(x.dateTimeEnd).format("HH:mm"),
                dateOk: true,
              })),
              departureReport: response.data?.metadata?.departureReport,
              arrivalReport: response.data?.metadata?.arrivalReport,
              load: response.data?.metadata?.load,
              formsInVoyage: response.data?.metadata?.formsInVoyage,
            },
            consume: response.data?.metadata?.consume,
          });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const mountDate = (date, time) => {
    if (!date) {
      return null;
    }
    const normalizedDate = moment(date);
    return moment(`${normalizedDate.format("YYYY-MM-DD")}T${time}`).toDate();
  };

  const onSave = () => {
    const { data, consume } = props;

    if (
      (data?.etaDate && !data?.etaTime) ||
      (!data?.etaDate && data?.etaTime)
    ) {
      toast.warn(intl.formatMessage({ id: "date.eat.is.invalid" }));
      return;
    }

    if (
      data?.etaDate &&
      data?.etaTime &&
      moment(mountDate(data?.etaDate, data?.etaTime)).isBefore(
        moment(data.dateTimeStart)
      )
    ) {
      toast.warn(intl.formatMessage({ id: "date.eat.is.before" }));
      return;
    }

    if (data?.events?.length) {
      const allDateIsValid = data?.events?.some((x) =>
        isDatesAreValidAndShowMessage(x, data)
      );
      if (!allDateIsValid) {
        return;
      }
    }

    setIsLoading(true);
    const dataToSave = {
      code: data?.code,
      metadata: {
        idPortPointDestiny: data?.portDestiny?.value,
        idPortPointSource: data?.portPointStart?.value,
        eta: mountDate(data?.etaDate, data?.etaTime),
        dateTimeDeparture: mountDate(
          data?.dateTimeDepartureDate,
          data?.dateTimeDepartureTime
        ),
        dateTimeArrival: mountDate(
          data?.dateTimeArrivalDate,
          data?.dateTimeArrivalTime
        ),
        departureReport: {
          ...data?.departureReport,
          densityIFO: data?.departureReport?.densityIFO || DENSITY_DEFAULT.IFO,
          densityMDO: data?.departureReport?.densityMDO || DENSITY_DEFAULT.MDO,
        },
        arrivalReport: {
          ...data?.arrivalReport,
          densityIFO: data?.arrivalReport?.densityIFO || DENSITY_DEFAULT.IFO,
          densityMDO: data?.arrivalReport?.densityMDO || DENSITY_DEFAULT.MDO,
        },
        consume,
        load: data?.load,
        events: data?.events?.map((x) => ({
          type: x.type,
          observation: x.observation,
          dateTimeStart: x.dateTimeStart,
          dateTimeEnd: x.dateTimeEnd,
        })),
        formsInVoyage: data.formsInVoyage,
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
      value: "anchoring",
      label: intl.formatMessage({ id: "anchoring" }),
    },
    {
      value: "speedReduction",
      label: intl.formatMessage({ id: "speed.reduction" }),
    },
    {
      value: "routeChange",
      label: intl.formatMessage({ id: "route.change" }),
    },
    {
      value: "technicalFailure",
      label: intl.formatMessage({ id: "technical.failure" }),
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
            <FormattedMessage id="add.travel.metadata" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <HeaderTravelMetadata />
            <DataCharge />
            <ReportTypes />
            <FormInVoyage />
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
  consume: state.voyage.consume,
});

const mapDispatchToProps = (dispatch) => ({
  setDataVoyage: (item) => {
    dispatch(setDataVoyage(item));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTravelMetadata);
