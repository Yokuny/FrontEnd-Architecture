import { Button, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { LabelIcon, TextSpan } from "../../../components";

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`

const RowAnimation = styled(Row)`
  .animate svg {
    animation: spin 5s infinite;
  }

  @-moz-keyframes spin {
    100% { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
    100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
    100% {
        -webkit-transform: rotate(360deg);
        transform:rotate(360deg);
    }
}
`

const csvStringToJson = (csvString) => {
  let lines = csvString.split("\n")?.filter(x => x !== "" && x !== null);
  let headers = lines[0].split(",");
  let result = [];

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      let value = currentLine[j]?.trim();
      if (!isNaN(value)) {
        if (Number.isInteger(parseFloat(value))) {
          obj[headers[j]?.trim()] = parseInt(value);
        } else {
          obj[headers[j]?.trim()] = parseFloat(value);
        }
      } else if (Date.parse(value)) {
        obj[headers[j]?.trim()] = new Date(value);
      } else {
        obj[headers[j]?.trim()] = value;
      }
    }

    result.push(obj);
  }

  return result;
};

const InputFileCsv = (props) => {

  const [file, setFile] = React.useState(null);
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [index, setIndex] = React.useState(null);

  const interval = React.useRef(null);
  const inputFileRef = React.useRef(null);


  React.useEffect(() => {
    if (index !== null) {
      let item;
      try {
        item = data[index];
      }
      catch (error) {

      }
      if (item)
        props.onHandleData(item)
    };
    if (index >= (data.length - 1)) {
      onStopMonitoring(false);
    }
  }, [index]);

  const onMonitoring = () => {
    setIsMonitoring(true);
    setIndex(0);
    interval.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 20000);
  }

  const onStopMonitoring = () => {
    setIsMonitoring(false);
    clearInterval(interval.current);
    setIndex(null);
    file && setFile(null);
  }


  const onHandleFile = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      setFile(file);
    }
  }

  const onUpload = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        setData(csvStringToJson(text));
        onMonitoring();
      };

      fileReader.readAsText(file);
    }
  }

  return (
    <>
      <Row>
        {!isMonitoring && <>
          <Col breakPoint={{ md: 12 }}>
            <Row
              className="m-0"
              between="xs" middle="xs">
              <input
                style={{ display: 'none' }}
                type="file"
                accept=".csv"
                ref={inputFileRef}
                onChange={onHandleFile}
              />

              {!file ? <Button
                status="Basic"
                size="Tiny"
                onClick={() => inputFileRef.current.click()}
                className="mt-2"
              >
                <EvaIcon name="upload-outline" />
              </Button>
                : <>
                  <Row className="m-0" middle="xs">
                    <Button
                      status="Danger"
                      size="Tiny"
                      appearance="ghost"
                      onClick={() => setFile(null)}
                    >
                      <EvaIcon name="close-outline" />
                    </Button>
                    <LabelIcon
                      title={file.name}
                    />
                  </Row>
                </>}
              {file &&
                <Button
                  status="Info"
                  className="flex-between"
                  onClick={onUpload}
                  size="Tiny">
                  <EvaIcon name="activity-outline"
                    className="mr-1"
                  />
                  <FormattedMessage id="start.monitoring" />
                </Button>
              }
            </Row>
          </Col>
        </>}

        {isMonitoring && !!data?.length && <>
          <Row className="m-0" between="xs"
            style={{ width: '100%' }}
            middle="xs">
            <ColFlex className="ml-4">
              <RowAnimation middle="xs" className="m-0">
                <EvaIcon
                  status="Basic"
                  name="sync-outline"
                  className="mt-1 animate"
                  options={{ height: 16, width: 16 }}
                />
                <TextSpan apparence='p2' hint>
                  <FormattedMessage id="classify" /> {index + 1}/{data.length}
                </TextSpan>
              </RowAnimation>
              <TextSpan apparence='p3' hint>
                <FormattedMessage id="last.date.acronym" />: {new Date().toLocaleString()}
              </TextSpan>
            </ColFlex>

            <Button
              size="Tiny"
              status="Danger"
              className="flex-between"
              appearance="ghost"
              onClick={() => onStopMonitoring()}
            >
              <EvaIcon name="stop-circle-outline" className="mr-1" />
              <FormattedMessage id="stop.monitoring" />
            </Button>
          </Row>
        </>}
      </Row>
    </>
  )
}

export default InputFileCsv;
