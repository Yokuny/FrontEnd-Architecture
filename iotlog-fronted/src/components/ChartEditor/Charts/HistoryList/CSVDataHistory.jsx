import moment from "moment";
import React from "react";
import { CSVLink } from "react-csv";

export default function CSVDataHistory(props) {
  const downloadRef = React.useRef();

  const { series } = props;
  const [isReady, setIsReady] = React.useState(false)

  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    setIsReady(true)
  }, [])

  React.useEffect(() => {
    if (isReady)
      onDowload();
    return () => {
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current)
    }
  }, [isReady])

  const getDataCSV = () => {

    const data = series
      ?.flatMap(x => x.data?.map(y => ({ idSensor: x.idSensor, sensor: x.name, date: y[0], value: y[1] })))
      ?.sort((a, b) => a.date - b.date);

    const columns = [...new Set(data.map(x => x.sensor))]

    const groups = data.reduce((groups, sensor) => {
      const date = new Date(sensor?.date).toLocaleString()?.replace(',', '')?.slice(0, 16);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(sensor);
      return groups;
    }, {});

    return Object.keys(groups).map(x => {
      const dataOfGroup = groups[x];
      const date = moment(dataOfGroup[0].date);

      const item = {
        date: date.format('DD/MM/YYYY'),
        time: date.format('HH:mm:ss'),
        timezone: date.format('Z')
      }

      columns.forEach(y => {
        item[y] = dataOfGroup.find(z => z.sensor === y)?.value
      });

      return item;
    })
  }

  const onDowload = () => {
    timeoutRef.current = setTimeout(() => {
      if (downloadRef.current)
        downloadRef.current.link.click();
    }, 500)
  }

  return (
    <>
      <CSVLink
        filename={`sensors_${moment().format("YYYYMMDD_HHmmss")}`}
        data={getDataCSV()}
        separator={";"}
        enclosingCharacter=""
        ref={downloadRef}
        style={{ display: "none" }}
      />
    </>
  );
}
