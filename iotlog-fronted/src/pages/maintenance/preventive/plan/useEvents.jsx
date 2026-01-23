import moment from "moment";
import { useIntl } from "react-intl"

export function useEvents() {
  const intl = useIntl()

  const formatDate = (date) =>
    date
      ? moment(date).format(intl.formatMessage({ id: "format.date" }))
      : null;

  const formatDateTime = (date) =>
    date
      ? moment(date).format(
          intl.formatMessage({ id: "format.datetimewithoutss" })
        )
      : "-";
  
  const event = [
    {
      title: "datetime",
      format: (data) => formatDateTime(data.date),
    },
    {
      title: "observation",
      format: (data) => data.observation,
    },
    {
      title: "users",
      format: (data) => data.users?.map((user) => user.label).join(", "),
    },
  ];

  const teamChange = [
    {
      title: "machine",
      format: (data) => data.machine?.name,
    },
    {
      title: "date",
      format: (data) => formatDate(data.date),
    },
    {
      title: "QLP",
      format: (data) => data.qlp?.label,
    },
    {
      title: "local",
      format: (data) => data.local,
    },
  ];

  const maintenance = [
    {
      title: "machine",
      format: (data) => data.machine?.name,
    },
    {
      title: "date.done.start",
      format: (data) => formatDate(data.dateDoneInit),
    },
    {
      title: "date.done.end",
      format: (data) => formatDate(data.dateDoneEnd),
    },
    {
      title: "date.plan.start",
      format: (data) => formatDate(data.datePlanInit),
    },
    {
      title: "date.plan.end",
      format: (data) => formatDate(data.datePlanEnd),
    },
    {
      title: "date.window.start",
      format: (data) => formatDate(data.dateWindowInit),
    },
    {
      title: "date.window.end",
      format: (data) => formatDate(data.dateWindowEnd),
    },
    {
      title: "observation",
      format: (data) => data.observation,
    },
  ];

  const options = [
    { value: "event", label: intl.formatMessage({ id: "event" }) },
    {
      value: "teamChange",
      label: intl.formatMessage({ id: "event.team.change" }),
    },
    {
      value: "maintenance",
      label: intl.formatMessage({ id: "maintenance" }),
    },
  ];

  return {
    options,
    event,
    teamChange,
    maintenance
  }
}