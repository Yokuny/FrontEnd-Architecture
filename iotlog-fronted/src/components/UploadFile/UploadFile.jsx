import React from "react";
import styled, { css } from "styled-components";
import Dropzone from "react-dropzone";
import { DropInputIconFile } from "../Dropzone";
import Row from "@paljs/ui/Row";
import { CardUploadFile } from "../Cards/CardUploadFile";
import Col from "@paljs/ui/Col";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { formatterMbKb } from "../Utils";

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
const blockedExtensions = [
  "js",
  "jsx",
  "html",
  "htm",
  "css",
  "exe",
  "sh",
  "bat",
  "cmd",
  "php",
  "py",
  "pl",
  "cgi",
  "jar",
  "msi",
  "wsf",
  "vb",
  "vbs",
  "vbe",
  "ps1",
  "ps2",
  "scf",
  "lnk",
  "inf",
  "reg",
];
const defaultAccept = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "application/pdf": ["pdf"],
  "application/vnd.ms-excel": ["xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    "xlsx",
  ],
  "text/csv": ["csv"],
  "video/mp4": ["mp4"],
  "video/mpeg": ["mpeg"],
  "application/msword": ["doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    "docx",
  ],
};

function UploadFile({
  onAddFiles,
  files,
  onRemoveFile,
  colMd = 2,
  accept = defaultAccept,
  multiple = true,
  onSave = true,
}) {
  const intl = useIntl();

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

      const hasBlockedFile = acceptedFiles.some((file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        return blockedExtensions.includes(extension);
      });

      if (hasBlockedFile) {
        toast.error(intl.formatMessage({ id: "file.type.not.allowed" }));
        return;
      }


      onAddFiles(filesToAdd);
    }
  };

  return (
    <>
      <DropContainer>
        <Dropzone multiple={multiple} onDrop={onDrop} accept={accept}>
          {({ getRootProps, getInputProps }) => (
            <div className="mb-3">
              <DropInputIconFile
                getRootProps={getRootProps}
                getInputProps={getInputProps}
              />
              {!!files?.length && (
                <Row className="mt-4">
                  {files.map((file, i) => (
                    <Col key={i} breakPoint={{ md: colMd }}>
                      <CardUploadFile
                        file={file}
                        onSave={onSave}
                        onRemoveFile={() => onRemoveFile(i)}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}
        </Dropzone>
      </DropContainer>
    </>
  );
}

export default UploadFile;
