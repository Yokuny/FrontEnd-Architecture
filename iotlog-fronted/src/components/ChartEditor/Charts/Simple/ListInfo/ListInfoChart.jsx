import { Col, Row } from "@paljs/ui";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { getLatLonNormalize } from "../../../../Utils";
import { ContentChart } from "../../../Utils";

const ColContent = styled(Col)`
  line-height: 15px;
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
`;

export default function InfoChart({
  sensorStates,
  title,
  data,
  onClick = undefined,
}) {
  const intl = useIntl();

  const [proximities, setProximities] = React.useState([]);

  React.useEffect(() => {
    const proximitiesFind = data?.machines?.filter(
      (x) => x.typeCell?.value === "proximity"
    );
    if (proximitiesFind?.length && sensorStates?.length) {
      getProximities(proximitiesFind);
    }
  }, [sensorStates]);

  const getProximities = async (machinesFind) => {
    let results = [];
    for await (const machineItemFind of machinesFind) {
      try {
        const sensorStatePosition = sensorStates?.find(
          (x) =>
            ((x.idSensor && x.idSensor === machineItemFind?.sensor?.value) ||
              x.sensorId === machineItemFind?.sensor?.value) &&
            x.idMachine === machineItemFind?.machine?.value
        );

        if (sensorStatePosition) {
          const normalizedGeo = getLatLonNormalize(sensorStatePosition.value);
          const response = await axios.get(
            `https://nearby-cities.vercel.app/api/search?latitude=${normalizedGeo[0]}&longitude=${normalizedGeo[1]}`
          );
          if (response.data?.length)
            results.push({
              idMachine: machineItemFind?.machine?.value,
              idSensor: machineItemFind?.sensor?.value,
              value: `${response?.data[0]?.name} - ${response?.data[0]?.state?.code}` ,
            });
        }
      } catch (e) {}
      if (results?.length) {
        setProximities(results);
      }
    }
  };

  const getValue = (item) => {
    if (!item) return "";

    if (item?.typeCell?.value === "idMachine") {
      return item?.machine?.value;
    }

    if (item?.typeCell?.value === "machine.name") {
      return item?.machine?.label;
    }

    if (item?.typeCell?.value === "sensorId") {
      return item?.sensor?.value;
    }

    const sensorState = sensorStates.find(
      (x) =>
        x.idSensor === item?.sensor?.value &&
        x.idMachine === item?.machine?.value
    );

    if (item?.typeCell?.value === "date") {
      return sensorState?.date
        ? moment(sensorState?.date).format(
            intl.formatMessage({ id: "format.datetime" })
          )
        : "-";
    }
    if (item?.typeCell?.value === "dateServer") {
      return sensorState?.dateServer
        ? moment(sensorState?.dateServer).format(
            intl.formatMessage({ id: "format.datetime" })
          )
        : "-";
    }

    if (item?.typeCell?.value === "value.signal" && item?.formula) {
      const valueSignal = sensorState?.value;
      const wrap = (s) => `{ return ${item?.formula} };`;
      try {
        return new Function(wrap(item?.formula))
          .call(null)
          .call(null, valueSignal);
      } catch {
        return "error";
      }
    }

    if (item?.typeCell?.value === "value.signal") {
      return sensorState?.value;
    }

    if (item?.typeCell?.value === "proximity") {
      return (
        proximities?.find(
          (x) =>
            x.idSensor === item?.sensor?.value &&
            x.idMachine === item?.machine?.value
        )?.value ?? "-"
      );
    }

    return "";
  };

  return (
    <React.StrictMode>
      <ContentChart
        className="card-shadow"
        style={{ cursor: !!onClick ? "pointer" : "default" }}
        onClick={onClick}
      >
        <TextSpan apparence="p3" hint className="mt-1">
          {title || ""}
        </TextSpan>

        <ColContent>
          {data?.machines?.map((machineItem, i) => (
            <Row key={`info-${i}`} className="mb-1 pl-4 pr-4">
              <TextSpan apparence="s3" hint style={{ textAlign: "left" }}>
                {machineItem?.description}:
              </TextSpan>
              <TextSpan apparence="c1" className="ml-1">
                  {getValue(machineItem)} {machineItem?.unit || ""}
                </TextSpan>
            </Row>
          ))}
        </ColContent>
      </ContentChart>
    </React.StrictMode>
  );
}
