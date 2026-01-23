import React from "react";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import moment from "moment";
import styled from "styled-components";
import { Button, Card, Col, EvaIcon, Row } from "@paljs/ui";
import DateTime from "../../../DateTime";
import { useSocket } from "../../../Contexts/SocketContext";

const ContainerRow = styled(Row)`
  z-index: 9;
  display: flex;
  flex-direction: row;
  width: 100%;

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;

  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;

const GroupBooleanDateWrapper = (props) => {
  const { data, height, width } = props;

  const [countSignalsTrue, setCountSignalsTrue] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const [dateInit, setDateInit] = React.useState(moment().format("YYYY-MM-DD"));
  const [dateEnd, setDateEnd] = React.useState(moment().format("YYYY-MM-DD"));

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    if (data?.machines?.length)
      data.machines.forEach((x) => {
        socket.on(
          `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`,
          takeData
        );
      });

    return () => {
      if (data?.machines?.length)
        data.machines.forEach((x) => {
          socket.off(
            `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`,
            takeData
          );
        });
    };
  }, [socket, data]);

  React.useEffect(() => {
    searchingData();
  }, []);

  React.useEffect(() => {
    if (newValue && newValue.signals.some((x) => x.value)) {
      if (data?.typeDate?.value == "month") {
        let dateSaved = moment(newValue.dateServer).utc();
        let indexAlter = countSignalsTrue.findIndex(
          (x) => x.month == dateSaved.month && x.year == dateSaved.year
        );
        if (indexAlter) {
          let updateTotal = countSignalsTrue[indexAlter];
          updateTotal.total = updateTotal.total + 1;
          setCountSignalsTrue([
            ...countSignalsTrue.slice(0, indexAlter),
            updateTotal,
            ...countSignalsTrue.slice(indexAlter + 1),
          ]);
        } else {
          setCountSignalsTrue([
            ...countSignalsTrue,
            {
              year: dateSaved.year,
              month: dateSaved.month,
              total: 1,
            },
          ]);
        }
        return;
      }

      if (data?.typeDate?.value == "week") {
        let dateSaved = moment(newValue.dateServer).utc();
        let indexAlter = countSignalsTrue.findIndex(
          (x) => x.week == dateSaved.week && x.year == dateSaved.year
        );
        if (indexAlter) {
          let updateTotal = countSignalsTrue[indexAlter];
          updateTotal.total = updateTotal.total + 1;
          setCountSignalsTrue([
            ...countSignalsTrue.slice(0, indexAlter),
            updateTotal,
            ...countSignalsTrue.slice(indexAlter + 1),
          ]);
        } else {
          setCountSignalsTrue([
            ...countSignalsTrue,
            {
              year: dateSaved.year,
              week: dateSaved.week,
              total: 1,
            },
          ]);
        }
        return;
      }

      let dateSaved = moment(newValue.dateServer).utc();
      let indexAlter = countSignalsTrue.findIndex(
        (x) => x.date == dateSaved.format("YYYY-MM-DD")
      );
      if (indexAlter) {
        let updateTotal = countSignalsTrue[indexAlter];
        updateTotal.total = updateTotal.total + 1;
        setCountSignalsTrue([
          ...countSignalsTrue.slice(0, indexAlter),
          updateTotal,
          ...countSignalsTrue.slice(indexAlter + 1),
        ]);
      } else {
        setCountSignalsTrue([
          ...countSignalsTrue,
          {
            date: dateSaved.format("YYYY-MM-DD"),
            total: 1,
          },
        ]);
      }
    }
  }, [newValue]);

  const searchingData = () => {
    let paramsQuery = new URL(window.location.href).searchParams;
    let typeDate = paramsQuery.get("type");
    if (!typeDate) {
      let min;
      if (data?.typeDate?.value == "month") {
        min = moment().utc().subtract(1, "months").date(1);
      } else if (data?.typeDate?.value == "month") {
        min = moment().utc().subtract(3, "weeks").startOf('week');
      } else {
        min = moment().utc().subtract(15, "days");
      }
      setDateInit(min.format("YYYY-MM-DD"));
      setDateEnd(moment().utc().format("YYYY-MM-DD"));
      getData(min, moment().utc());
      return;
    }

    let min, max;
    if (typeDate == "month") {
      let year = paramsQuery.get("year");
      let month = paramsQuery.get("month");
      let monthMoment = moment()
        .year(parseInt(year))
        .month(parseInt(month) - 1);
      min = monthMoment.date(1).utc().format("YYYY-MM-DD");
      max = moment()
        .year(parseInt(year))
        .month(parseInt(month) - 1)
        .date(monthMoment.daysInMonth())
        .utc()
        .format("YYYY-MM-DD");
    } else if (typeDate == "week") {
      let year = paramsQuery.get("year");
      let week = paramsQuery.get("week");
      let weekMoment = moment().year(parseInt(year)).week(parseInt(week));
      min = weekMoment.startOf("week").utc().format("YYYY-MM-DD");
      max = weekMoment.endOf("week").utc().format("YYYY-MM-DD");
    }

    setDateInit(min);
    setDateEnd(max);
    getData(min, max);
  };

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const getData = (min, max) => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/chart/manycountbooleandate?idChart=${props.id}&min=${moment(
        min
      )
        .utc()
        .format("YYYY-MM-DD")}&max=${moment(max).utc().format("YYYY-MM-DD")}`
    )
      .then((response) => {
        if (response.data?.length) {
          setCountSignalsTrue(response.data);
        } else {
          setCountSignalsTrue([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <LoadingCard isLoading={isLoading}>
      <Card style={{ height: '100%', width: '100%' }}>
        {!props.activeEdit && (
          <ContainerRow>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <DateTime
                onChangeDate={(value) => setDateInit(value)}
                date={dateInit}
                max={dateEnd}
                onlyDate
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <DateTime
                onChangeDate={(value) => setDateEnd(value)}
                date={dateEnd}
                min={dateInit}
                onlyDate
              />
            </Col>
            <Col
              breakPoint={{ md: 2 }}
              className="mb-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                size="Tiny"
                status="Basic"
                disabled={!dateInit || !dateEnd}
                onClick={() => getData(dateInit, dateEnd)}
              >
                <EvaIcon name="search-outline" />
              </Button>
            </Col>
          </ContainerRow>
        )}
        <props.component
          countSignalsTrue={countSignalsTrue}
          title={data?.title}
          height={height - 54}
          width={width}
          data={data}
          id={props.id}
          activeEdit={props.activeEdit}
          isMobile={props.isMobile}
        />
      </Card>
    </LoadingCard>
  );
};

export default GroupBooleanDateWrapper;
