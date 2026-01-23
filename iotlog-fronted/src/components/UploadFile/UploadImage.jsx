import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import { Button } from "@paljs/ui/Button";
import Dropzone from "react-dropzone";
import styled, { css } from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import TextSpan from "../Text/TextSpan";
import { formatterMbKb } from "../Utils";

const ButtonChange = styled(Button)`
  padding-top: 3px;
  padding-bottom: 3px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const DropContainer = styled.div`
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

const UploadImage = ({
  onAddFile,
  value,
  maxSize,
  imagePreview,
  textAdd = "drag.image",
  textUpdate = "change.image",
  height = 220,
  accept = "image/*",
  disabled = false,
}) => {
  const dropzoneRef = React.createRef();

  const intl = useIntl();

  const onDrop = (acceptedFiles) => {
    if (!!acceptedFiles?.length) {
      const fileMoreSize = acceptedFiles.find((x) => x.size > maxSize);
      if (!!fileMoreSize) {
        toast.warn(
          intl
            .formatMessage({ id: "file.more.size" })
            .replace("{0}", fileMoreSize.name)
            .replace("{1}", formatterMbKb(maxSize))
        );
        return;
      }

      onAddFile(acceptedFiles[0]);
    } else {
      toast.warn(intl.formatMessage({ id: "file.not.image" }));
    }
  };

  return (
    <>
      <Col>
        {!!(value?.url || imagePreview) && (
          <div className="w-100 card-shadow">
            <img
              src={value?.url || imagePreview}
              alt={value?.originalname || "image"}
              className="image-machine"
              style={{
                height: height - 25,
              }}
            />
            <ButtonChange
              disabled={disabled}
              fullWidth
              size="Tiny"
              onClick={() => dropzoneRef.current.open()}
            >
              <EvaIcon name="image-outline" className="mr-1" />
              <FormattedMessage id={textUpdate} />
            </ButtonChange>
          </div>
        )}

        <DropContainer>
          <Dropzone ref={dropzoneRef} onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({
                  className: `dropzone drop-image`,
                  multiline: "true",
                  style: {
                    height: height,
                    display: (value?.url || imagePreview) ? "none" : "flex",
                  },
                })}
              >
                <input {...getInputProps()} accept={accept} />

                <EvaIcon name="image-outline" className="add-image-icon" />
                <TextSpan
                  apparence="s1"
                  style={{ textAlign: "center", marginTop: 10 }}
                >
                  <FormattedMessage id={textAdd} />
                </TextSpan>
              </div>
            )}
          </Dropzone>
        </DropContainer>
      </Col>
    </>
  );
};

export default UploadImage;
