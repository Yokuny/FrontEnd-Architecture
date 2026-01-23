import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import React from "react";
import CSVListData from "./CSVListData";

export default function DownloadCSV(props) {

  const [download, setDownload] = React.useState(false)

  const onDowloadAsync = async () => {
    setDownload(true);
    await new Promise(r => setTimeout(r, 5000));
    setDownload(false);
  }

  return (<>
    {download &&
      <CSVListData
        listData={props.listData}
        isShowDetails={props.isShowDetails}
      />}
    <Tooltip key="downloadCSV"
      eventListener="#scrollPlacementId"
      className="inline-block"
      trigger="hint"
      content={'Download CSV'}
      placement={"top"}>
      <Button
        status="Basic"
        size="Tiny"
        className="mr-3"
        onClick={() => onDowloadAsync()}
        disabled={download}>
        <EvaIcon name="download-outline" />
      </Button>
    </Tooltip>
  </>)
}
