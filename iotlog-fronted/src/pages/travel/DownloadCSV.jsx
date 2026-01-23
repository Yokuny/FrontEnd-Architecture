import { Button, EvaIcon } from "@paljs/ui";
import React from "react";
import { CSVLink } from "react-csv";
import { getCSVData } from "./Utils";
import { FormattedMessage } from "react-intl";
import { Fetch, SpinnerFull } from "../../components";

export default function DownloadCSV(props) {

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState([]);
  const csvRef = React.useRef()

  React.useEffect(() => {
    if (data?.length && csvRef.current)
      csvRef.current.click();
  }, [data])

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/travel/list/download?idEnterprise=${props.idEnterprise}`)
      .then((response) => {
        setData(response?.data)
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return <>
    <Button
      size="Tiny"
      className="flex-between"
      status="Basic"
      onClick={getData}
      isDisabled={isLoading}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        margin: "0 0 1rem 1rem",
      }}
    >
      <EvaIcon name="download-outline" className="mr-1" />
      <FormattedMessage id="download" />
    </Button>
    <CSVLink
      style={{
        display: 'none'
      }}
      data={getCSVData(data)} filename={Date.now()}>
      <Button
        ref={csvRef}
      ></Button>
    </CSVLink>
    <SpinnerFull isLoading={isLoading} />
  </>
}
