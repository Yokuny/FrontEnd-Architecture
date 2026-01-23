import React from 'react';
import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import styled from 'styled-components';
import CSVDataHistory from './CSVDataHistory';

const ContentButton = styled.div`
position: absolute;
top: 10px;
right: -2px;
`

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
    <ContentButton>
      <Tooltip trigger="hint" className="with-margin" placement="top" content='Download CSV'>
        <Button
          status="Basic"
          size="Small"
          onClick={() => onDowloadAsync()}
          disabled={download}
          style={{ padding: 2 }}>
          <EvaIcon name="download-outline" />
        </Button>
      </Tooltip>

    </ContentButton>
  </>)
}
