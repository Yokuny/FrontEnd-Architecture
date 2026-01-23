import moment from "moment";
import { TextSpan } from "../../components";
import { useIntl } from "react-intl";

export const getDiffDateString = (dateStart, dateEnd, intl) => {
  let formatDiffInString;
  const diffInMinutes = moment(dateEnd)
    .utc()
    .diff(moment(dateStart).utc(), "minutes");
  if (diffInMinutes < 60) {
    formatDiffInString = `${diffInMinutes} min`;
  } else if (diffInMinutes < 1440) {
    const hours = diffInMinutes ? (diffInMinutes / 60)?.toFixed(2) : 0;
    formatDiffInString = `${hours.split(".")[0]} hrs`;
    if (hours.split(".")[1] != "00") {
      const minutes = ((60 * parseInt(hours.split(".")[1])) / 100)?.toFixed(0);
      formatDiffInString = `${formatDiffInString} ${intl.formatMessage({
        id: "and",
      })} ${minutes} min`;
    }
  } else {
    const diff = moment.duration(
      moment(dateEnd).utc().diff(moment(dateStart).utc())
    );
    const diffDuration = moment.duration(diff);
    const days = parseInt(diffDuration.asDays());
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();

    const formatList = [
      `${days} ${intl
        .formatMessage({
          id: days === 1 ? "day" : "days",
        })
        ?.toLowerCase()}`,
    ];
    if (hours) {
      formatList.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
    }
    if (minutes) {
      formatList.push(`${minutes} min`);
    }

    formatDiffInString =
      formatList.length > 2
        ? `${formatList[0]}, ${formatList[1]} ${intl.formatMessage({
            id: "and",
          })} ${formatList[2]} `
        : `${formatList.join(
            ` ${intl.formatMessage({
              id: "and",
            })} `
          )}`;
  }
  return formatDiffInString;
};

export const getDiffDateCompactedString = (dateStart, dateEnd, intl) => {
  let formatDiffInString;
  const diffInMinutes = moment(dateEnd)
    .utc()
    .diff(moment(dateStart).utc(), "minutes");
  if (diffInMinutes < 60) {
    formatDiffInString = `${diffInMinutes}m`;
  } else if (diffInMinutes < 1440) {
    const hours = diffInMinutes ? (diffInMinutes / 60)?.toFixed(2) : 0;
    formatDiffInString = `${hours.split(".")[0]}h`;
    if (hours.split(".")[1] != "00") {
      const minutes = ((60 * parseInt(hours.split(".")[1])) / 100)?.toFixed(0);
      formatDiffInString = `${formatDiffInString} ${intl.formatMessage({
        id: "and",
      })} ${minutes}m`;
    }
  } else {
    const diff = moment.duration(
      moment(dateEnd).utc().diff(moment(dateStart).utc())
    );
    const diffDuration = moment.duration(diff);
    const days = diffDuration.days();
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();

    const formatList = [`${days}d`];
    if (hours) {
      formatList.push(`${hours}h`);
    }
    if (minutes) {
      formatList.push(`${minutes}m`);
    }

    formatDiffInString =
      formatList.length > 2
        ? `${formatList[0]}, ${formatList[1]} ${intl.formatMessage({
            id: "and",
          })} ${formatList[2]} `
        : `${formatList.join(
            ` ${intl.formatMessage({
              id: "and",
            })} `
          )}`;
  }
  return formatDiffInString;
};

export const calculateValueBetweenDates = (start, end) => {
  const timeStart = new Date(start).getTime() / 1000000;
  const timeEnd = new Date(end).getTime() / 1000000;
  const dateNow = new Date().getTime() / 1000000;
  return ((dateNow - timeStart) * 100) / (timeEnd - timeStart);
};

export const mountTextPort = (port) => {
  return (
    <TextSpan apparence="s2" style={{ textAlign: "center" }}>
      {`${port?.description} - ${port?.code}`}
    </TextSpan>
  );
};

export const DENSITY_DEFAULT = {
  IFO: 0.95,
  MDO: 0.85,
};

const useFormattedTravelStatus = (status) => {
  const intl = useIntl();

  switch (status) {
    case "created":
      return intl.formatMessage({ id: "in.progress" });
    case "finished":
      return intl.formatMessage({ id: "order.support.closed" });
    case "cancelled":
      return intl.formatMessage({ id: "cancelled" });
    default:
      return null;
  }
};

export const getCSVData = (data) => {
  return data?.some((x) => x?.itinerary)
    ? getTravelWithItinerary(data)
    : data.map((prop) => ({
    vessel: prop?.machine?.name || "",
    code: prop?.code || "",
    travelType: prop?.travelType === "travel" ? "Viagem" : "Manobra",
    dateTimeStart: prop?.dateTimeStart || "",
    dateTimeEnd: prop?.dateTimeEnd || "",
    portPointStartCode: prop?.portPointStart?.code || "",
    portPointStartDescription: prop?.portPointStart?.description || "",
    portPointEndCode: prop?.portPointEnd?.code || "",
    portPointEndDescription: prop?.portPointEnd?.description || "",
  }));
};

const getTravelWithItinerary = (data) => {
  return data
    ?.map((travel) =>
      travel.itinerary?.map((departure, index) => ({
        code: travel.code,
        vessel: travel.machine.name,
        client: travel.customer?.label || "",
        cargo: departure.load?.map((load) => load.description).join(",") || "",
        cargoAmount:
          departure.load
            ?.map((load) => `${load.amount} ${load.unit}`)
            .join(",") || "",
        port: departure.where || "",
        departureETA: departure.eta || "",
        departureATA: departure.ata || "",
        departureETD: departure.etd || "",
        departureATD: departure.atd || "",
        departureETB: departure.etb || "",
        departureATB: departure.atb || "",
        departureETC: departure.etc || "",
        departureATC: departure.atc || "",
        departureETS: departure.ets || "",
        departureATS: departure.ats || "",
        arrival: travel.itinerary[index + 1]?.where || "",
        arrivalETA: travel.itinerary[index + 1]?.eta || "",
        arrivalATA: travel.itinerary[index + 1]?.ata || "",
        arrivalETD: travel.itinerary[index + 1]?.etd || "",
        arrivalATD: travel.itinerary[index + 1]?.atd || "",
        arrivalETB: travel.itinerary[index + 1]?.etb || "",
        arrivalATB: travel.itinerary[index + 1]?.atb || "",
        arrivalETC: travel.itinerary[index + 1]?.etc || "",
        arrivalATC: travel.itinerary[index + 1]?.atc || "",
        arrivalETS: travel.itinerary[index + 1]?.ets || "",
        arrivalATS: travel.itinerary[index + 1]?.ats || "",
        status: useFormattedTravelStatus(travel.status) || "",
      }))
    )
    ?.filter((data) => data?.length)
    ?.flat();
};
