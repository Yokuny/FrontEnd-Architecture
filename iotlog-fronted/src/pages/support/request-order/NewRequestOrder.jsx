import * as React from "react";
import styled, { css } from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import Dropzone from "react-dropzone";
import {
  SelectEnterprise,
  SelectProductService,
  SelectTypeProblem,
  SelectPriority,
  DropInputIconFile,
  CardUploadFile,
  FetchSupport,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { toast } from "react-toastify";
import { Button } from "@paljs/ui/Button";
import { formatterMbKb } from "../../../components/Utils";
import MockDemoSelect from "./MockDemoSelect";
import { useNavigate } from "react-router-dom";

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
    }

    .dropzone:focus {
      border-color: #2196f3;
    }

    .drop-image {
      justify-content: center;
      border-radius: 12px;
    }
  `}
`;

const maxSizeFile = process.env.REACT_APP_MAX_SIZE_FILE_BYTES;

const NewRequestOrder = (props) => {
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [productService, setProductService] = React.useState(undefined);
  const [typeProblem, setTypeProblem] = React.useState(undefined);
  const [priority, setPriority] = React.useState(undefined);
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [files, setFiles] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length) {
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
      const filesToAdd = files.concat(acceptedFiles);
      const totalSize = filesToAdd.reduce((a, b) => a + b.size, 0);
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
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  };

  const onSave = async () => {
    const order = {
      enterprise: enterprise?.label,
      idEnterprise: enterprise?.value,
      productService: productService?.label,
      idProductService: productService?.value,
      urlProductServiceImage: productService?.image,
      idTypeProblem: typeProblem?.value,
      typeProblem: typeProblem?.label,
      priority: priority?.value,
      description: description,
      subject: subject,
    };

    setIsLoading(true);
    try {
      const response = await FetchSupport.post("/ordersupport", order);
      if (files?.length) {
        for await (let fileToSave of files) {
          const data = new FormData();
          data.append("file", fileToSave);
          await FetchSupport.post(
            `/file/upload/order?directory=support&idOrderSupport=${response.data.data.id}`,
            data
          );
        }
      }
      setIsLoading(false);
      navigate(-1);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <FormattedMessage id="new.request" />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="enterprise" /> *
              </TextSpan>
              <div className="mt-1"></div>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>
            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="support.product.label" /> *
              </TextSpan>
              <div className="mt-1"></div>
              {enterprise?.value === "acfa9d4c-d309-4702-8821-895e05fda673" ? (
                <MockDemoSelect
                  onChange={(value) => setProductService(value)}
                  value={productService}
                  idEnterprise={enterprise?.value}
                />
              ) : (
                <SelectProductService
                  onChange={(value) => setProductService(value)}
                  value={productService}
                  idEnterprise={enterprise?.value}
                />
              )}
            </Col>
            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="type.problem" /> *
              </TextSpan>
              <div className="mt-1"></div>
              <SelectTypeProblem
                onChange={(value) => setTypeProblem(value)}
                value={typeProblem}
                idEnterprise={enterprise?.value}
              />
            </Col>
            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="support.priority.label" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectPriority
                onChange={(value) => setPriority(value)}
                value={priority}
              />
            </Col>
            <Col breakPoint={{ lg: 12, md: 12 }}>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="support.subject.label" /> *
              </TextSpan>
              <InputGroup fullWidth className="mb-4 mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "support.subject.placeholder",
                  })}
                  onChange={(text) => setSubject(text.target.value)}
                  value={subject}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="description" /> *
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <textarea
                  placeholder={intl.formatMessage({
                    id: "support.description.placeholder",
                  })}
                  maxLength={3000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 12 }}>
              <DropContainer>
                <Dropzone multiple onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="mb-3">
                      <DropInputIconFile
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                      />
                      {!!files.length && (
                        <Row style={{ marginTop: 20 }}>
                          {files?.map((file, i) => (
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
          <Button size="Small" onClick={onSave}>
            <FormattedMessage id="save" />
          </Button>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

export default NewRequestOrder;
