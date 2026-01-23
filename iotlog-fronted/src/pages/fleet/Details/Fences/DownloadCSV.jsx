import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import React from "react";
import CSVListData from "../../../../components/DownloadCSV/CSVListData";


export default function DownloadCSV({
  fileName,
  getData = () => [],
  timeoutToDownload = 5000,
  className = "",
  onlyIcon = false,
  status = "Basic",
  appearance = "filled",
}) {

  const [download, setDownload] = React.useState(false)

  const onDowloadAsync = async () => {
    setDownload(true);
    await new Promise(r => setTimeout(r, timeoutToDownload));
    setDownload(false);
  }

  return (<>
    {download &&
      <CSVListData
        fileName={fileName}
        getData={getData}
      />}
    <Tooltip
      eventListener="#scrollPlacementId"
      className="inline-block"
      trigger="hint"
      content={'Download CSV'}
      placement={"top"}>
      <Button
        status={status}
        appearance={appearance}
        size="Tiny"
        className={`flex-between ${className}`}
        onClick={() => onDowloadAsync()}
        disabled={download}>
        <EvaIcon name="download-outline" />
      </Button>
    </Tooltip>
  </>)
}
