import { useIntl } from "react-intl";
import TimeLineEvents from "./Events";

export default function TimelineVoyage(props) {

  const { voyages } = props;

  const intl = useIntl();

  const getTypeByActivity = (x) => {
    if (x?.sequence === 1)
      return {
        type: 'init_travel',
        description: x?.port,
        dateTimeStart: x?.dateTimeDeparture,
        title: `${x?.operations?.includes("B") ? `+ ${intl.formatMessage({ id: "fill" })}` : ''}`
      }

    if (x?.operations?.includes("L"))
      return {
        type: 'load',
        description: x?.port,
        dateTimeStart: x?.dateTimeArrival,
        dateTimeEnd: x?.dateTimeDeparture,
        title: `${x?.operations?.includes("B") ? `+ ${intl.formatMessage({ id: "fill" })}` : ''}`
      }

    if (x?.operations?.includes("D"))
      return {
        type: 'finish_travel',
        description: x?.port,
        dateTimeStart: x?.dateTimeArrival,
        title: `${x?.operations?.includes("B") ? `+ ${intl.formatMessage({ id: "fill" })}` : ''}`
      }

    if (x?.operations?.includes("B"))
      return {
        type: 'fuel',
        description: x?.port,
        dateTimeStart: x?.dateTimeArrival,
        dateTimeEnd: x?.dateTimeDeparture,
      }

    return {
      type: 'other',
      description: x?.port,
      dateTimeStart: x?.dateTimeArrival,
      dateTimeEnd: x?.dateTimeDeparture,
      title: `${x?.operations?.includes("B") ? `+ ${intl.formatMessage({ id: "fill" })}` : ''}`
    }
  }

  const eventsVoyages = voyages?.map(x => getTypeByActivity(x))

  return (
    <>
      {!!eventsVoyages?.length &&
        <TimeLineEvents
          events={eventsVoyages} />}
    </>
  )
}
