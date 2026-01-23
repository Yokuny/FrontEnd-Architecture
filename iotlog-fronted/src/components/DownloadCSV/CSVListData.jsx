import React from "react";
import { CSVLink } from "react-csv";


export default function CSVListData({
  fileName,
  getData = () => []
}) {
  const downloadRef = React.useRef();

  const [isReady, setIsReady] = React.useState(false)

  React.useLayoutEffect(() => {
    setIsReady(true)
  }, [])

  React.useLayoutEffect(() => {
    if (isReady)
      onDowload();
  }, [isReady])

  const onDowload = () => {
    if (downloadRef.current?.link) downloadRef.current.link.click();
  };

  const data = getData();

  return (
    <>
      <CSVLink
        filename={fileName}
        data={data}
        separator={";"}
        enclosingCharacter=""
        ref={downloadRef}
        style={{ display: "none" }}
      />
    </>
  );
}
