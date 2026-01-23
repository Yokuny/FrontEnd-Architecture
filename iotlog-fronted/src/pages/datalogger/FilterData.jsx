import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import Select from "@paljs/ui/Select";
import { DateTime, LabelIcon } from "../../components";
import React from "react";


export const OPTIONS_DEFAULT = [
  { value: 1, label: "1 min" },
  { value: 2, label: "2 min" },
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "60 min" },
];

export default function FilterData() {
  const [searchParams, setSearchParams] = useSearchParams();

  const intl = useIntl();
  const isReadyRef = React.useRef(false);

  const dateInit = searchParams.get("dateInit");
  const dateEnd = searchParams.get("dateEnd");
  const timeInit = searchParams.get("timeInit");
  const timeEnd = searchParams.get("timeEnd");
  const interval = searchParams.get("interval") || "30";

    React.useEffect(() => {
    if (!dateInit || !dateEnd) {
      const today = moment().format("YYYY-MM-DD");
      isReadyRef.current = true;
      setSearchParams({
        dateInit: today,
        dateEnd: today,
        timeInit: "00:00",
        timeEnd: "23:59",
        interval: "30"
      });
    }
  }, []);

  React.useEffect(() => {
    if (!isReadyRef.current) {
      return;
    }
    if (dateInit && dateEnd) {
      const optionsInterval = getOptionsInterval();
       updateQueryParam([["interval", optionsInterval?.reverse()[0].value]]);
    } else {
      updateQueryParam([], ["interval"]);
    }
  }, [dateInit, dateEnd]);

  const updateQueryParam = (listValues, listDelete = []) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const item of listValues || []) {
      newSearchParams.set(item[0], item[1]);
    }
    for (const item of listDelete || []) {
      newSearchParams.delete(item);
    }
    if (listValues.length || listDelete.length) {
      setSearchParams(newSearchParams);
    }
  };

  const onChangeDate = (prop, date) => {
    if (!date) {
      const toRemove = [prop]
      if (prop === "dateInit") {
        toRemove.push("timeInit");
      } else if (prop === "dateEnd") {
        toRemove.push("timeEnd");
      }
      updateQueryParam([], toRemove);
      return;
    }

    const newDate = moment(date).format("YYYY-MM-DD");
    const listValues = [[prop, newDate]];
    if (prop === "dateInit" && !timeInit) {
      listValues.push(["timeInit", "00:00"]);
    }
    if (prop === "dateEnd" && !timeEnd) {
      listValues.push(["timeEnd", "23:59"]);
    }
    updateQueryParam(listValues);
  }

  const onChangeTime = (prop, time) => {
    if (!time) {
      updateQueryParam([], [prop]);
      return;
    }
    const newTime = moment(time, "HH:mm").format("HH:mm");
    updateQueryParam([[prop, newTime]]);
  }

  const onChangeInterval = (value) => {
    if (value === null || value === undefined) {
      updateQueryParam([], ["interval"]);
      return;
    }
    updateQueryParam([["interval", value]]);
  }

  const getOptionsInterval = () => {
    if (
      moment(dateEnd).diff(moment(dateInit), "days") === 0
    ) {
      return [
        { value: 0, label: intl.formatMessage({ id: "no.interval" }) },
        ...OPTIONS_DEFAULT,
      ];
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 1) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 1);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 2) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 2);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 3) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 5);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 5) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 10);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") < 16) {
      return OPTIONS_DEFAULT.filter((x) => x.value > 15);
    }
    return OPTIONS_DEFAULT.filter((x) => x.value >= 30);
  };

  const optionsInterval = getOptionsInterval();

  const dateMinus30 = new Date();
  dateMinus30.setDate(dateMinus30.getDate() - 31);

  return (
    <>
      <LabelIcon
        title={intl.formatMessage({ id: "date.start" })}
        iconName="calendar-outline"
      />
      <DateTime
        onChangeDate={(value) => onChangeDate("dateInit", value)}
        onChangeTime={(value) => onChangeTime("timeInit", value)}
        date={dateInit}
        time={timeInit}
        max={dateEnd || new Date()}
        min={dateMinus30}
      />
      <div className="mt-2"></div>
      <LabelIcon
        title={intl.formatMessage({ id: "date.end" })}
        iconName="calendar-outline"
      />
      <DateTime
        onChangeDate={(value) => onChangeDate("dateEnd", value)}
        onChangeTime={(value) => onChangeTime("timeEnd", value)}
        date={dateEnd}
        time={timeEnd}
        min={dateInit}
        max={new Date()}
      />
      <div className="mt-2"></div>
      <>
        <LabelIcon
          title={intl.formatMessage({ id: "interval" })}
          iconName="clock-outline"
        />
        <Select
          options={optionsInterval}
          onChange={(value) => onChangeInterval(value?.value)}
          value={optionsInterval?.find(x => x.value === Number(interval)) || null}
          placeholder={intl.formatMessage({ id: "interval" })}
          menuPosition="fixed"
        />
      </>
    </>
  );
}
