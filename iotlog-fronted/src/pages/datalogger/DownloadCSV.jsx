import React from 'react';
import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import CSVDataHistory from '../../components/ChartEditor/Charts/HistoryList/CSVDataHistory';


export default function DownloadCSV({ series }) {

  const [download, setDownload] = React.useState(false)

  const onDowloadAsync = async () => {
    setDownload(true);
    await new Promise(r => setTimeout(r, 5000));
    setDownload(false);
  }

  return (<>
    {download &&
      <CSVDataHistory
        series={series}
      />}

      <Tooltip trigger="hint" className="with-margin" placement="top" content='Download CSV'>
        <Button
          status="Basic"
          size="Small"
          className="ml-3"
          onClick={() => onDowloadAsync()}
          disabled={download}
          style={{ padding: 2 }}>
          <EvaIcon name="download-outline" />
        </Button>
      </Tooltip>
  </>)
}
