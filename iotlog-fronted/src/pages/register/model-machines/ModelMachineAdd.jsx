import React from "react";

import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import Dropzone from "react-dropzone";
import styled from "styled-components";
import { DropContainer } from "../../../components/UploadFile/UploadImage";
import { formatterMbKb } from "../../../components/Utils";
import { ContainerColor, InputColorControl } from "../../../components/Inputs";
import {
  CardUploadFile,
  DeleteConfirmation,
  DropInputIconFile,
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SelectTypeMachine,
  SpinnerFull,
  UploadImage,
} from "../../../components";
import { TYPE_MACHINE } from "../../../constants";
import SelectCIIReference from "./SelectCIIReference";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;


const ModelMachineAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const maxSizeFile = process.env.REACT_APP_MAX_SIZE_FILE_BYTES;

  const [isEdit, setIsEdit] = React.useState(false);
  const [editId, setEditId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [image, setImage] = React.useState(undefined);
  const [icon, setIcon] = React.useState(undefined);
  const [iconPreview, setIconPreview] = React.useState(undefined);
  const [imagePreview, setImagePreview] = React.useState(undefined);

  const [description, setDescription] = React.useState("");
  const [specification, setSpecification] = React.useState("");
  const [color, setColor] = React.useState("#ff3d71");
  const [enterprise, setEnterprise] = React.useState();
  const [typeMachine, setTypeMachine] = React.useState();
  const [typeVesselCIIReference, setTypeVesselCIIReference] = React.useState();
  const [files, setFiles] = React.useState([]);
  const [filesDelete, setFilesToDelete] = React.useState([]);

  React.useEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    const idEdit = new URL(window.location.href).searchParams.get("id");
    if (!!idEdit) {
      getEditEntity(idEdit);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    Fetch.get(`/modelmachine/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          setImage(response.data?.image);
          setIcon(response.data?.icon);
          setDescription(response.data?.description);
          setSpecification(response.data?.specification);
          setFiles(response.data?.files || []);
          setTypeMachine(response.data?.typeMachine);
          setTypeVesselCIIReference(response.data?.typeVesselCIIReference)
          setEnterprise({
            value: response.data?.enterprise?.id,
            label: response.data?.enterprise?.name,
          });
          setColor(response.data?.color);
          setEditId(id);
          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const saveImageAsync = async (id) => {
    try {
      const data = new FormData();
      data.append("file", image);
      await Fetch.post(
        `/upload/modelmachine?id=${id}&isImage=true`,
        data
      );
    } catch (e) { }
  };

  const saveIconAsync = async (id) => {
    try {
      const data = new FormData();
      data.append("file", icon);
      await Fetch.post(
        `/upload/modelmachine?id=${id}&isIcon=true`,
        data
      );
    } catch (e) { }
  };

  const saveFilesAsync = async (id, files) => {
    try {
      for await (let file of files) {
        const data = new FormData();
        data.append("file", file);
        await Fetch.post(
          `/upload/modelmachine?id=${id}`,
          data
        );
      }
    } catch (e) { }
  };

  const deleteFilesAsync = async (id) => {
    try {
      await Fetch.delete(
        `/modelmachine/files?idModelMachine=${id}&${filesDelete.map(
          (x, i) => `file[]=${x.filename}`
        )}`
      );
    } catch (e) { }
  };

  const onSave = async () => {
    if (!description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    setIsLoading(true);
    const data = {
      description,
      specification,
      color,
      typeMachine,
      typeVesselCIIReference,
      idEnterprise: enterprise?.value,
      id: editId,
    };

    let idModelMachine = editId;

    try {
      idModelMachine = (await Fetch.post("/modelmachine", data))?.data?.data
        ?.id;
    } catch (e) {
      setIsLoading(false);
      return;
    }

    if (!!imagePreview) await saveImageAsync(idModelMachine);
    if (!!iconPreview) await saveIconAsync(idModelMachine);

    const filesToSave = files?.filter((x) => !x.url);
    if (filesToSave?.length) {
      await saveFilesAsync(idModelMachine, filesToSave);
    }

    if (filesDelete?.length) {
      await deleteFilesAsync(idModelMachine);
    }

    toast.success(intl.formatMessage({ id: "save.successfull" }));
    setIsLoading(false);
    navigate(-1);
  };

  const onChangeImage = (imageAdd) => {
    setImage(imageAdd);
    const reader = new FileReader();
    reader.readAsDataURL(imageAdd);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const onChangeIcon = (imageAdd) => {
    setIcon(imageAdd);
    const reader = new FileReader();
    reader.readAsDataURL(imageAdd);
    reader.onloadend = () => {
      setIconPreview(reader.result);
    };
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles?.length) {
      const fileMoreSize = acceptedFiles.find((x) => x.size > maxSizeFile);
      if (!!fileMoreSize) {
        toast.warn(
          intl
            .formatMessage({ id: "file.more.size" })
            .replace("{0}", fileMoreSize.name)
            .replace("{1}", formatterMbKb(maxSizeFile))
        );
        return;
      }
      const filesToAdd = files?.concat(acceptedFiles);
      const totalSize = filesToAdd?.reduce((a, b) => a + b.size, 0);
      if (totalSize > maxSizeFile) {
        toast.warn(
          intl
            .formatMessage({ id: "file.all.more.size" })
            .replace("{0}", formatterMbKb(maxSizeFile))
        );
        return;
      }

      setFiles(filesToAdd);
    }
  };

  const onRemoveFile = (index) => {
    const fileRemove = files[index];
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);

    if (fileRemove?.url) setFilesToDelete([...filesDelete, fileRemove]);
  };

  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/modelmachine?id=${editId}`)
      .then((r) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id={isEdit ? "edit.model" : "new.model"} />
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 8 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <LabelIcon
                        iconName="home-outline"
                        title={`${intl.formatMessage({ id: 'enterprise' })} *`}
                      />
                      <div className="mt-1"></div>
                      <SelectEnterprise
                        onChange={(value) => setEnterprise(value)}
                        value={enterprise}
                        oneBlocked
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <LabelIcon
                        iconName="text-outline"
                        title={`${intl.formatMessage({ id: 'description' })} *`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "description.placeholder",
                          })}
                          onChange={(text) => setDescription(text.target.value)}
                          value={description}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>

                    <Col breakPoint={{ md: 5 }} className="mb-4">
                      <LabelIcon
                        iconName="radio-button-off-outline"
                        title={`${intl.formatMessage({ id: 'type.machine' })} *`}
                      />
                      <div className="mt-1"></div>
                      <SelectTypeMachine
                        onChange={(value) => setTypeMachine(value?.value)}
                        value={typeMachine}
                      />
                    </Col>

                    <Col breakPoint={{ md: 1 }} className="mb-4">
                      <LabelIcon
                        title={<FormattedMessage id="color" />}
                        iconName="color-palette-outline"
                      />
                      <ContainerColor className="mt-1">
                        <InputColorControl
                          defaultValue="#ff3d71"
                          onChange={(value) => setColor(value)}
                          value={color}
                        />
                      </ContainerColor>
                    </Col>

                    {typeMachine === TYPE_MACHINE.SHIP &&
                      <Col breakPoint={{ md: 6 }} className="mb-4">
                        <LabelIcon
                          iconName="percent-outline"
                          title={`${intl.formatMessage({ id: 'type.vessel' })} (CII reference)`}
                        />
                        <div className="mt-1"></div>
                        <SelectCIIReference
                          onChange={(value) => setTypeVesselCIIReference(value?.value)}
                          value={typeVesselCIIReference}
                        />
                      </Col>
                    }


                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <LabelIcon
                        iconName="info-outline"
                        title={`${intl.formatMessage({ id: 'specification.placeholder' })}`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <textarea
                          type="text"
                          rows={4}
                          placeholder={intl.formatMessage({
                            id: "specification.placeholder",
                          })}
                          onChange={(text) =>
                            setSpecification(text.target.value)
                          }
                          value={specification}
                        />
                      </InputGroup>
                    </Col>

                  </Row>
                </Col>

                <Col breakPoint={{ md: 4 }} style={{ padding: 0 }}>
                  <UploadImage
                    onAddFile={onChangeImage}
                    value={image}
                    maxSize={10485760}
                    imagePreview={imagePreview}
                    height={300}
                  />
                </Col>

                <Col breakPoint={{ md: 2 }} style={{ padding: 0 }}>
                  <UploadImage
                    onAddFile={onChangeIcon}
                    value={icon}
                    textAdd="drag.icon"
                    textUpdate="change"
                    maxSize={10485760}
                    imagePreview={iconPreview}
                    height={125}
                    accept={".svg"}
                  />
                </Col>

                <Col breakPoint={{ md: 10 }}>
                  <DropContainer>
                    <Dropzone multiple onDrop={onDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <div className="mb-3">
                          <DropInputIconFile
                            getRootProps={getRootProps}
                            getInputProps={getInputProps}
                          />
                          {!!files?.length && (
                            <Row style={{ marginTop: 20 }}>
                              {files.map((file, i) => (
                                <Col key={i} breakPoint={{ md: 2 }}>
                                  <CardUploadFile
                                    file={file}
                                    onRemoveFile={() => onRemoveFile(i)}
                                    isLoading={false}
                                  />
                                </Col>
                              ))}
                            </Row>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </DropContainer>
                </Col>

              </Row>

            </CardBody>
            <CardFooter>
              <Row between className="pr-2 pl-2">
                {!!editId ? (
                  <DeleteConfirmation
                    message={intl.formatMessage({
                      id: "delete.message.default",
                    })}
                    onConfirmation={onDelete}
                  />
                ) : (
                  <div></div>
                )}
                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default ModelMachineAdd;
