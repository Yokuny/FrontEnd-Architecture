import React from "react";
import {
  Fetch,
  Modal,
  SpinnerFull,
  UploadFile,
} from "../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import {  CardFooter } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { toast } from "react-toastify";

const ModalUploadChart = ({ show, onClose }) => {

  const intl = useIntl();

  const [files, setFiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const onRemoveFile = (index) => {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  };

  const idFinded = new URL(window.location.href).searchParams.get("id");


  const renderFooter = () => {
    return (
      <>
        <CardFooter>
          <Row className="mr-1 ml-1" end>
            <Button size="Small" disabled={!files?.length} onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </>
    );
  };

  const onAddFile = (filesToAdd) => {
    const filesInvalids = filesToAdd
      .filter((x) => {
        const paths = x.name?.split(".");
        const lastPath = paths[paths?.length];
        return lastPath === "chart";
      })
      ?.map((x) => x.name);
    if (filesInvalids?.length) {
      filesInvalids.forEach((fileInvalid) => {
        toast.warn(
          `${intl.formatMessage({ id: "invalid.file" })}: "${fileInvalid}"`
        );
      });
      return;
    }

    setFiles(filesToAdd);
  };

  const onSave = async () => {
    let filesReadedLocal = [];
    let error = false;
    for await (let file of files) {
      try {
        let readFile = await new Promise((resolve, eject) => {
          let fileReader = new FileReader();
          fileReader.onloadend = (e) => {
            try {
              const fileReaded = JSON.parse(fileReader.result);
              if (Array.isArray(fileReaded)) resolve(fileReaded);
              else eject(file);
            } catch (e) {
              eject(file);
            }
          };
          fileReader.readAsText(file);
        });
        filesReadedLocal = filesReadedLocal.concat(readFile);
      } catch (fileError) {
        toast.error(
          `${intl.formatMessage({ id: "invalid.file" })}: "${fileError.name}"`
        );
        error = true;
        break;
      }
    }

    if (!error) {
      setIsLoading(true);
      const data = {
        idDashboard: idFinded,
        charts: filesReadedLocal
      }

      Fetch.post("/chart/many", data)
      .then(response => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));

        setTimeout(() => {
          window.location.reload();
        }, 1000)
      })
      .catch(e => {
        setIsLoading(false);
      })
    }
  };

  return (
    <>
      <Modal
        show={show}
        onClose={onClose}
        size="ExtraLarge"
        title="upload.chart"
        renderFooter={renderFooter}
      >
        <Row style={{ maxHeight: "calc(100vh - 230px)" }}>
          <Col breakPoint={{ md: 12 }} className="mt-2">
            <UploadFile
              onAddFiles={onAddFile}
              onRemoveFile={onRemoveFile}
              files={files}
              accept=".chart"
            />
          </Col>
        </Row>
      </Modal>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default ModalUploadChart;
