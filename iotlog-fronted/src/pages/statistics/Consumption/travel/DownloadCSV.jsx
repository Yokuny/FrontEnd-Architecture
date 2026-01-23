import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { CSVLink } from "react-csv";

export default function DownloadCSV(props) {
  const downloadRef = React.useRef();

  const { listData, typeFuels } = props;

  const data = listData?.map((x) => ({
    codeVoyage: x.code,
    vessel: `${x?.machine?.code ? `${x?.machine?.code} - ` : ""}${x?.machine?.name}`,
    portSourceCode: (x?.portPointSource || x?.portPointStart)?.code,
    portSourceName: (x?.portPointSource || x?.portPointStart)?.description,
    dateTimeSource: x.dateTimeStart,
    portDestinyCode: (x?.portPointDestiny || x?.portPointEnd)?.code,
    portDestinyName: (x?.portPointDestiny || x?.portPointEnd)?.description,
    dateTimeDestiny: x.dateTimeEnd,
    speedAverage: parseFloat((x?.distance ? x?.distance / ((new Date(x?.dateTimeEnd).getTime() - new Date(x?.dateTimeStart).getTime()) / 36e5) : 0)?.toFixed(1)),
    unitSpeed: 'kn',
    distance: parseFloat(x?.distance?.toFixed(2)),
    unitDistance: 'nm',
    ...(typeFuels?.map((y) => ({ [y.code]: x.consumption[y.code] }))?.reduce((a, b) => ({ ...a, ...b }), {})),
    unitFuel: x.unit
  })) || [];

  const onDowload = () => {
    if (downloadRef.current?.link) downloadRef.current.link.click();
  };

  return (
    <>
      <CSVLink
        filename={`voyages_${moment().format("YYYY-MM-DD-HHmmss")}`}
        data={data}
        separator={";"}
        enclosingCharacter=""
        ref={downloadRef}
        style={{ display: "none" }}
      />
      <Tooltip key="downloadCSV"
        eventListener="#scrollPlacementId"
        className="inline-block"
        trigger="hint"
        content={'Download CSV'}
        placement={"top"}>
        <Button
          size="Tiny"
          status="Basic"
          className="mr-3"
          onClick={() => onDowload()}
        >
          <EvaIcon name="download-outline" />
        </Button>
      </Tooltip>
    </>
  );
}
