import { Button, EvaIcon } from "@paljs/ui";
import React from "react";
import CSV_Data from './CSV_Data';

export default function DownloadCSV(props) {

  const [download, setDownload] = React.useState(false)
  const { routeHistory, machineDetailsSelected } = props;

  const onDowloadAsync = async () => {
    setDownload(true);
    await new Promise(r => setTimeout(r, 4000));
    setDownload(false);
  }

  return (
    <>
      {download && <CSV_Data routeHistory={routeHistory} machineDetailsSelected={machineDetailsSelected} />}
      <Button
        size="Tiny"
        status="Info"
        appearance="ghost"
        className="flex-between"
        onClick={() => onDowloadAsync()}
        disabled={download}
      >
        <EvaIcon name="download-outline" className="mr-1" />
        Download CSV
      </Button>
    </>
  );
}
