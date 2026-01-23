import React, { useState, useEffect } from "react";
import { Button, CardFooter, Col, EvaIcon, Row, InputGroup } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Dropzone from "react-dropzone";
import styled, { css } from "styled-components";
import { DropInputIconFile } from "../Dropzone";
import { Fetch, Modal, LabelIcon, TagSelector } from "../index";
import { toast } from "react-toastify";
import TextSpan from "../Text/TextSpan";
import { Card, CardBody } from "@paljs/ui/Card";

const DropContainer = styled.div`
  ${({ theme }) => css`
    .dropzone {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-width: 2px;
      border-radius: 2px;
      border-color: ${theme.borderBasicColor4};
      border-style: dashed;
      background-color: ${theme.backgroundBasicColor2};
      color: ${theme.textHintColor};
      outline: none;
      transition: border 0.24s ease-in-out;
      cursor: pointer;
    }

    .dropzone:focus,
    .dropzone:hover {
      border-color: ${theme.colorPrimary600};
    }

    .drop-image {
      justify-content: center;
      border-radius: 12px;
    }
  `}
`;

const maxSizeFile = 5 * 1024 * 1024;

const ModalAssetDocument = ({
  show,
  onClose,
  idAsset,
  setIsLoading,
  documentToEdit = null,
  currentFolderId = null,
  itemsByEnterprise = [],
  enterpriseId = null,
}) => {
  const intl = useIntl();
  const isEditMode = !!documentToEdit;
  
  const hasPermission = () => {
    if (!enterpriseId || !itemsByEnterprise?.length) {
      return false;
    }
    return itemsByEnterprise.some(
      (x) =>
        x.enterprise?.id === enterpriseId &&
        x.paths?.includes("/machine-docs")
    );
  };
  
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expirationDate: "",
    alertDays: 5,
    types: [],
  });

  useEffect(() => {
    if (documentToEdit) {
      setFormData({
        title: documentToEdit.title || "",
        description: documentToEdit.description || "",
        expirationDate: documentToEdit.expirationDate
          ? new Date(documentToEdit.expirationDate).toISOString().split("T")[0]
          : "",
        alertDays:
          documentToEdit.alertDate && documentToEdit.expirationDate
            ? Math.ceil(
                (new Date(documentToEdit.expirationDate) -
                  new Date(documentToEdit.alertDate)) /
                  (1000 * 60 * 60 * 24)
              )
            : 5,
        types: documentToEdit.types || [],
      });
    }
  }, [documentToEdit]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length) {
      const fileMoreSize = acceptedFiles.find((x) => x.size > maxSizeFile);
      if (!!fileMoreSize) {
        toast.warn(
          intl
            .formatMessage({ id: "file.more.size" })
            .replace("{0}", fileMoreSize.name)
            .replace("{1}", formatFileSize(maxSizeFile))
        );
        return;
      }

      const filesWithMetadata = acceptedFiles.map((file) => ({
        file,
        title: file.name,
        description: "",
        expirationDate: "",
        alertDays: 5,
        types: [],
      }));

      setUploadFiles(filesWithMetadata);
    }
  };

  const handleSaveEdit = async () => {
    if (!documentToEdit) return;

    if (!hasPermission()) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setIsUploading(true);
    setIsLoading && setIsLoading(true);

    const updateData = {
      title: formData.title,
      description: formData.description,
      expirationDate: formData.expirationDate || undefined,
      types: formData.types || [],
    };

    if (formData.expirationDate && formData.alertDays) {
      const expirationDate = new Date(formData.expirationDate);
      const alertDate = new Date(expirationDate);
      alertDate.setDate(alertDate.getDate() - parseInt(formData.alertDays));
      updateData.alertDate = alertDate.toISOString();
    }

    try {
      await Fetch.put(`/assetdocument?id=${documentToEdit.id}`, updateData);
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      handleClose(true);
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.save" }));
    } finally {
      setIsUploading(false);
      setIsLoading && setIsLoading(false);
    }
  };

  const handleSaveAdd = async () => {
    if (!uploadFiles.length) {
      toast.warn(intl.formatMessage({ id: "no.files.selected" }));
      return;
    }

    if (!hasPermission()) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setIsUploading(true);
    setIsLoading && setIsLoading(true);

    let uploadedCount = 0;
    let errorCount = 0;

    for (const fileData of uploadFiles) {
      const formDataToSend = new FormData();
      formDataToSend.append("files", fileData.file);
      formDataToSend.append("title", fileData.title || "");
      formDataToSend.append("description", fileData.description || "");
      
      if (fileData.types && fileData.types.length > 0) {
        formDataToSend.append("types", JSON.stringify(fileData.types));
      }

      if (currentFolderId) {
        formDataToSend.append("idFolder", currentFolderId);
      }

      if (fileData.expirationDate) {
        formDataToSend.append("expirationDate", fileData.expirationDate);

        if (fileData.alertDays) {
          const expirationDate = new Date(fileData.expirationDate);
          const alertDate = new Date(expirationDate);
          alertDate.setDate(alertDate.getDate() - parseInt(fileData.alertDays));
          formDataToSend.append("alertDate", alertDate.toISOString());
        }
      }

      try {
        await Fetch.post(
          `/assetdocument/upload?idAsset=${idAsset}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedCount++;
      } catch (error) {
        errorCount++;
      }
    }

    setIsUploading(false);
    setIsLoading && setIsLoading(false);

    if (uploadedCount > 0) {
      toast.success(
        intl
          .formatMessage({ id: "upload.success" })
          .replace("{0}", uploadedCount)
      );
    }

    if (errorCount > 0) {
      toast.error(
        intl.formatMessage({ id: "upload.error" }).replace("{0}", errorCount)
      );
    }

    handleClose(uploadedCount > 0);
  };

  const handleSave = () => {
    if (isEditMode) {
      handleSaveEdit();
    } else {
      handleSaveAdd();
    }
  };

  const updateFileMetadata = (index, field, value) => {
    setUploadFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], [field]: value };
      return newFiles;
    });
  };

  const removeFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = (hasChanges = false) => {
    setUploadFiles([]);
    setFormData({
      title: "",
      description: "",
      expirationDate: "",
      alertDays: 5,
      types: [],
    });
    onClose(hasChanges);
  };

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      size="Large"
      show={show}
      title={isEditMode ? "edit.document" : "add.document"}
      onClose={() => handleClose(false)}
      styleContent={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button
              size="Small"
              className="flex-between"
              onClick={handleSave}
              disabled={isUploading || (!isEditMode && uploadFiles.length === 0)}
            >
              <EvaIcon name="checkmark-outline" className="mr-1" />
              {isUploading ? (
                <FormattedMessage id="uploading" />
              ) : (
                <FormattedMessage id="save" />
              )}
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      {isEditMode && documentToEdit && (
        <Row>
          <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-4">
            <LabelIcon
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="file.name" />
                </TextSpan>
              }
            />
            <TextSpan>{documentToEdit.fileName}</TextSpan>
          </Col>

          <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-4">
            <LabelIcon
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="file.size" />
                </TextSpan>
              }
            />
            <TextSpan>{formatFileSize(documentToEdit.fileSize)}</TextSpan>
          </Col>

          <Col breakPoint={{ xs: 12 }} className="mb-4">
            <LabelIcon
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="title" />
                </TextSpan>
              }
            />
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder={intl.formatMessage({ id: "document.title" })}
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ xs: 12 }} className="mb-4">
            <LabelIcon
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="description" />
                </TextSpan>
              }
            />
            <InputGroup fullWidth>
              <textarea
                placeholder={intl.formatMessage({ id: "document.description" })}
                value={formData.description}
                onChange={(e) => onChange("description", e.target.value)}
                rows={3}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-4">
            <LabelIcon
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="expiration.date" />
                </TextSpan>
              }
            />
            <InputGroup fullWidth>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => onChange("expirationDate", e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-4">
            <LabelIcon
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="alert.days.before" />
                </TextSpan>
              }
            />
            <InputGroup fullWidth>
              <input
                type="number"
                placeholder="5"
                value={formData.alertDays}
                onChange={(e) => onChange("alertDays", e.target.value)}
                min="1"
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ xs: 12 }} className="mb-4">
            <LabelIcon
              iconName="pricetags-outline"
              title={
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="document.types" />
                </TextSpan>
              }
            />
            <TagSelector
              value={formData.types}
              onChange={(types) => onChange("types", types)}
            />
          </Col>
        </Row>
      )}

      {!isEditMode && (
        <Row>
          <Col breakPoint={{ xs: 12 }}>
            <DropContainer className="mb-4">
              <LabelIcon
                className="mb-2"
                title={
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="documents" />
                  </TextSpan>
                }
              />
              <Dropzone
                multiple
                onDrop={onDrop}
                accept={{
                  "image/png": ["png"],
                  "image/jpeg": ["jpg", "jpeg"],
                  "application/pdf": ["pdf"],
                  "application/vnd.ms-excel": ["xls"],
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    ["xlsx"],
                  "application/msword": ["doc"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    ["docx"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <DropInputIconFile
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                  />
                )}
              </Dropzone>
              <small style={{ marginTop: "8px", color: "#8f9bb3" }}>
                <FormattedMessage id="documents.allowed" />
              </small>
            </DropContainer>

            {uploadFiles.length > 0 && (
              <div className="mb-3">
                {uploadFiles.map((fileData, index) => (
                  <Card key={index} className="mb-3" accent="Info">
                    <CardBody>
                      <Row>
                        <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-3">
                          <LabelIcon
                            title={
                              <TextSpan apparence="p2" hint>
                                <FormattedMessage id="title" />
                              </TextSpan>
                            }
                          />
                          <InputGroup fullWidth>
                            <input
                              type="text"
                              placeholder={intl.formatMessage({
                                id: "document.title",
                              })}
                              value={fileData.title}
                              onChange={(e) =>
                                updateFileMetadata(index, "title", e.target.value)
                              }
                            />
                          </InputGroup>
                        </Col>

                        <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-3">
                          <LabelIcon
                            title={
                              <TextSpan apparence="p2" hint>
                                <FormattedMessage id="file.name" />
                              </TextSpan>
                            }
                          />
                          <TextSpan>{fileData.file.name}</TextSpan>
                        </Col>

                        <Col breakPoint={{ xs: 12 }} className="mb-3">
                          <LabelIcon
                            title={
                              <TextSpan apparence="p2" hint>
                                <FormattedMessage id="description" />
                              </TextSpan>
                            }
                          />
                          <InputGroup fullWidth>
                            <textarea
                              placeholder={intl.formatMessage({
                                id: "document.description",
                              })}
                              value={fileData.description}
                              onChange={(e) =>
                                updateFileMetadata(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </InputGroup>
                        </Col>

                        <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-3">
                          <LabelIcon
                            title={
                              <TextSpan apparence="p2" hint>
                                <FormattedMessage id="expiration.date" />
                              </TextSpan>
                            }
                          />
                          <InputGroup fullWidth>
                            <input
                              type="date"
                              value={fileData.expirationDate}
                              onChange={(e) =>
                                updateFileMetadata(
                                  index,
                                  "expirationDate",
                                  e.target.value
                                )
                              }
                            />
                          </InputGroup>
                        </Col>

                        <Col breakPoint={{ xs: 12, lg: 6 }} className="mb-3">
                          <LabelIcon
                            title={
                              <TextSpan apparence="p2" hint>
                                <FormattedMessage id="alert.days.before" />
                              </TextSpan>
                            }
                          />
                          <InputGroup fullWidth>
                            <input
                              type="number"
                              placeholder="5"
                              value={fileData.alertDays}
                              onChange={(e) =>
                                updateFileMetadata(
                                  index,
                                  "alertDays",
                                  e.target.value
                                )
                              }
                              min="1"
                            />
                          </InputGroup>
                        </Col>

                        <Col breakPoint={{ xs: 12 }} className="mb-3">
                          <LabelIcon
                            iconName="pricetags-outline"
                            title={
                              <TextSpan apparence="p2" hint>
                                <FormattedMessage id="document.types" />
                              </TextSpan>
                            }
                          />
                          <TagSelector
                            value={fileData.types || []}
                            onChange={(types) =>
                              updateFileMetadata(index, "types", types)
                            }
                          />
                        </Col>

                        <Col breakPoint={{ xs: 12 }}>
                          <Button
                            size="Small"
                            status="Danger"
                            appearance="ghost"
                            onClick={() => removeFile(index)}
                          >
                            <EvaIcon name="trash-2-outline" />
                            <FormattedMessage id="remove" />
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default ModalAssetDocument;


