import React from 'react'
import { Col } from "@paljs/ui";
import moment from "moment";
import { DateTime, LabelIcon } from "../../../../components";

export default function NavigationFields(props) {
  const {
    data,
    onChange
  } = props;

  const [date, setDate] = React.useState();
  const [time, setTime] = React.useState();


  React.useEffect(() => {
    verifyChange(date, time)
  }, [date, time])


  const verifyChange = (date, time) => {
    if (date && time) {
      const utc = moment().format("Z")
      onChange("eta", new Date(`${date}T${time}:00${utc}`))
    }
  }

  const onChangeDate = (date) => {
    setDate(date)
  }

  const onChangeTime = (time) => {
    setTime(time)
  }

  return <>

    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title={`ETA (${moment().format("Z")} GMT) *`}
      />
      <DateTime
        className="mt-1"
        onChangeTime={(value) => onChangeTime(value)}
        onChangeDate={(value) => onChangeDate(value)}
        breakPointDate={{ md: 6 }}
        breakPointTime={{ md: 4 }}
        date={date}
        time={time}
      />
    </Col>

  </>
}
