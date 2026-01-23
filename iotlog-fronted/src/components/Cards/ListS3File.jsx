import React from "react";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { EvaIcon } from "@paljs/ui/Icon";
import { Checkbox } from "@paljs/ui";
import { Button, Row } from "@paljs/ui";
import Fetch from "../Fetch/Fetch"
import { TABLE, THEAD, TBODY, TH, TD, TRH, TR } from "../Table";
import TextSpan from "../Text/TextSpan";
import StatusFas from "../../pages/forms/fas/StatusFas";
import DeleteConfirmation from "../Delete/DeleteConfirmation";
import { canDeleteAttachment } from "../Fas/Utils/FasPermissions"
import { getFormatFromName } from "../Fas/Utils/Attachments";
import { SpinnerFull } from "../Loading/SpinnerFull";
import ModalViewFasAttachments from "../Fas/ModalVIewFasAttachments";

export default function ListS3File({ files, presignedEndpoint, onDelete, orderState, allFilesName = "" }) {

  const [bulkDownloadFiles, setBulkDownloadFiles] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false);
  const [attatchmentToView, setAttatchmentToView] = React.useState(false);
  const [showViewAttachmentModal, setShowViewAttachmentModal] = React.useState(false);

  const intl = useIntl();

  const getPresignedUrl = async (file) => {
    try {
      const response = await Fetch.get(`${presignedEndpoint}?location=${file.location}`);
      if (response.data.invoiceUrl) {
        window.open(response.data.invoiceUrl);
      } else {
        toast.error(intl.formatMessage({ id: "error.download" }));
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.download" }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSelectFile = (file) => {
    setBulkDownloadFiles((state) => state.some((x) => x === file) ? state.filter((x) => x !== file) : [...state, file])
  }

  const onBulkDownload = async () => {
    setIsLoading(true)
    try {
      const response = await Fetch.get(`/fas/presignedbylocations?locations=${bulkDownloadFiles.map(x => x.location).join(',')}`, { responseType: 'blob' });
      if (response.data) {
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = allFilesName ? `${allFilesName}.zip` : "documentos.zip";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error(intl.formatMessage({ id: "error.download" }));
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.download" }));
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const onViewFile = (file) => {
    file.url = file.location;
    setAttatchmentToView(file);
    setShowViewAttachmentModal(true);
  }

  const onCloseViewFile = (document) => {
    setAttatchmentToView(null);
    setShowViewAttachmentModal(false);
  }

  const allIsChecked = files?.length > 0 && files?.every(file => bulkDownloadFiles?.includes(file));

  return (
    <>
      {!!files?.length &&
        <>
          <TABLE>
            <THEAD>
              <TRH>
                <TH>
                  <Row className="m-0" center="xs" middle="xs">
                    <Checkbox
                      onChange={(e) => allIsChecked ? setBulkDownloadFiles([]) : setBulkDownloadFiles(files)}
                      checked={allIsChecked}
                    />
                  </Row>
                </TH>
                <TH colSpan={2}>
                  <TextSpan apparence="p2" hint>
                    {intl.formatMessage({ id: "file" })}
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    {intl.formatMessage({ id: "uploaded.state" })}
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    {intl.formatMessage({ id: "uploaded.by" })}
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    {intl.formatMessage({ id: "size" })}
                  </TextSpan>
                </TH>
                <TH textAlign="center" style={{ width: '150px' }}>
                  <TextSpan apparence="p2" hint>
                    {intl.formatMessage({ id: "actions" })}
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
            <TBODY>
              {files?.map((file, index) => (
                <TR key={file.key || index} isEvenColor={index % 2 === 0}>

                  <TD>
                    <Row className="m-0" center="xs" middle="xs">
                      <Checkbox
                        checked={bulkDownloadFiles?.includes(file) || false}
                        onChange={() => onSelectFile(file)}
                      />
                    </Row>
                  </TD>

                  <TD>
                    <Row center="xs" className="m-0">
                      <Button
                        appearance="outline"
                        status="Primary"
                        size="Small"
                        onClick={() => getPresignedUrl(file)}
                        style={{ border: 'none', padding: 4 }}
                      >
                        <EvaIcon name="file-text-outline" />
                      </Button>
                    </Row>
                  </TD>
                  <TD>
                    <Row className="m-0" middle="xs">
                      <TextSpan apparence="p2">
                        {file?.originalname || file?.name}
                      </TextSpan>
                    </Row>
                  </TD>

                  <TD textAlign="end">
                    <StatusFas
                      styleText={{
                        textAlign: "center",
                        fontSize: "10px",
                        lineHeight: "1.2",
                        marginTop: 5, marginBottom: 5
                      }}
                      status={file.uploadedState} />
                  </TD>
                  <TD>
                    <TextSpan apparence="p3">
                      {file?.uploadedBy?.supplier ?
                        `(${intl.formatMessage({ id: "suppliers" })}) ${file?.uploadedBy?.email || "-"}`
                        :
                        file.uploadedBy?.userId?.name
                      }
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    <TextSpan apparence="p3">
                      {formatFileSize(file.size || 0)}
                    </TextSpan>
                  </TD>
                  <TD>
                    <Row className="m-0" center="xs">
                      {["png", "jpg", "jpeg"].includes(
                        getFormatFromName(file.name)
                      ) &&
                        <Button
                          size="Tiny"
                          status="Info"
                          style={{ padding: 3 }}
                          appearance="ghost"
                          className="flex-between mr-2"
                          onClick={() => onViewFile(file)}>
                          <EvaIcon name="eye-outline" />
                        </Button>}
                      <Button
                        size="Tiny"
                        status="Basic"
                        style={{ padding: 3 }}
                        appearance="ghost"
                        className="flex-between mr-2"
                        onClick={() => getPresignedUrl(file)}>
                        <EvaIcon name="download-outline" />
                      </Button>
                      {canDeleteAttachment({ state: orderState }) &&
                        <DeleteConfirmation
                          onConfirmation={() => onDelete(file)}
                          placement="bottom"
                          message={<FormattedMessage id="delete.confirmation.file" />}>
                          <Button
                            size="Tiny"
                            appearance="ghost"
                            style={{ padding: 3 }}
                            status="Danger">
                            <EvaIcon name="trash-2-outline" />
                          </Button>
                        </DeleteConfirmation>
                      }
                    </Row>
                  </TD>
                </TR>
              ))}
            </TBODY>
          </TABLE>
          {!isLoading &&
            bulkDownloadFiles.length > 0 &&
            <Row center="md" className="m-2 pb-4">
              <Button
                size="Tiny"
                className="flex-between"
                disabled={!bulkDownloadFiles.length}
                onClick={onBulkDownload}
                status="Info"
                appearance="ghost"
              >
                <EvaIcon name="download-outline" className="mr-1" />
                <FormattedMessage id="download.selected.files" />
              </Button>
            </Row>}
          <SpinnerFull isLoading={isLoading} />
          <ModalViewFasAttachments
            show={showViewAttachmentModal}
            documentRef={attatchmentToView}
            onClose={onCloseViewFile}
          />
        </>
      }
    </>
  );
}
