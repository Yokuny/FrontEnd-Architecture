import React from "react";
import { FormattedMessage } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { LabelAndTextField } from "../../LabelAndTextField";
import {
  LabelIcon
} from "../../../";
import AttatchedFolders from "../AttatchedFolders";
import ModalViewDocument from "../../ModalVIewDocument";
import ArchiveDocumentCardPublic from "./ArchiveDocumentCardPublic";

export default function FolderDetailsPublic({ data, onRefresh }) {
  const [showViewDocumentModal, setShowViewDocumentModal] = React.useState(false);
  const [documentToView, setDocumentToView] = React.useState(null);

  if (!data) return null;

  const onCloseViewDocumentModal = () => {
    setShowViewDocumentModal(false);
    setDocumentToView(null);
  }

  const onViewDocument = (document) => {
    setDocumentToView(document);
    setShowViewDocumentModal(true);

  }

  return <>
    <LabelAndTextField
      breakPoint={{ lg: 6, md: 6 }}
      title="name"
      text={data?.name}
    />
    <LabelAndTextField
      breakPoint={{ lg: 6, md: 6 }}
      title="visibility"
      text={data?.visibility ? <FormattedMessage id={data?.visibility} /> : "N/A"}
    />
    {
      !!data?.attatchedFolder?.length &&
      <AttatchedFolders data={data?.attatchedFolder} onRefresh={onRefresh} />
    }

    {!!data?.documents?.length &&
      <Col>
        <LabelIcon
          title={<FormattedMessage id="documents" />}
        />
        <Row>
          {data?.documents?.map((file, i) => (
            <Col key={i} breakPoint={{ md: 3, lg: 3 }}>
              <ArchiveDocumentCardPublic
                file={{ url: file.s3LocationUrl, ...file }}
                presignedEndpoint={"/public-folder/presigned"}
                onView={onViewDocument}
              />
            </Col>
          ))}
        </Row>
      </Col>
    }

    <ModalViewDocument
      show={showViewDocumentModal}
      documentRef={documentToView}
      onClose={onCloseViewDocumentModal}
    />
  </>
}
