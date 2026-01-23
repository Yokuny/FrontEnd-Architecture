import React from "react";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { LabelAndTextField } from "../LabelAndTextField";
import FolderEditButtonOverlay from "./FolderEditButtonOverlay";
import { useNavigate } from "react-router-dom";
import {
  Fetch,
  LabelIcon
} from "../../";
import AttatchedFolders from "./AttatchedFolders";
import AllowedUsers from "./AllowedUsers";
import ArchiveDocumentCard from "./ArchiveDocumentCard";
import ModalEditFolderDetails from "../ModalEditFolderDetails";
import ModalViewDocument from "../ModalVIewDocument";
import ModalViewQrCode from "../ModalVIewQrCode";

export default function FolderDetails({ data, items, onRefresh, setIsLoading }) {
  const navigate = useNavigate();
  const [showEditFolderModal, setShowEditFolderModal] = React.useState(false);
  const [showViewDocumentModal, setShowViewDocumentModal] = React.useState(false);
  const [showViewQrModal, setShowViewQrModal] = React.useState(false);
  const [documentToView, setDocumentToView] = React.useState(null);

  if (!data) return null;

  const onDeleteFolder = async () => {
    Fetch.delete(`/folder/delete?id=${data.id}`).then(
      (response) => {
        toast.success(<FormattedMessage id="delete.success" />);
        navigate(`/list-folders`);
      }).catch(
        (e) => toast.error(
          <FormattedMessage id="error.delete" />
        )
      );
  }

  const onDeleteDocument = async (item) => {
    Fetch.delete(`/document/delete?id=${item.id}`).then(
      (response) => {
        onRefresh();
        toast.success(<FormattedMessage id="delete.success" />);
      }).catch(
        (e) => toast.error(
          <FormattedMessage id="error.delete" />
        )
      );
  }

  const onCloseEditModal = () => {
    setShowEditFolderModal(false);
    onRefresh();
  }

  const onCloseViewDocumentModal = () => {
    setShowViewDocumentModal(false);
    setDocumentToView(null);
  }

  const onViewDocument = (document) => {
    setDocumentToView(document);
    setShowViewDocumentModal(true);

  }

  const onShowQrModal = () => {
    setShowViewQrModal(true);
  }

  return <>
    <LabelAndTextField
      breakPoint={{ lg: 4, md: 4 }}
      title="name"
      text={data?.name}
    />
    <LabelAndTextField
      breakPoint={{ lg: 4, md: 4 }}
      title="visibility"
      text={data?.visibility ? <FormattedMessage id={data?.visibility} /> : "N/A"}
    />
    {/* <Col breakPoint={{ lg: 1, md: 1 }}>
      <Row end="xs">
        <FolderEditButtonOverlay
          Link={navigate}
          openEditFolderModal={() => setShowEditFolderModal(true)}
          onDeleteFolder={onDeleteFolder}
          onShowQrModal={onShowQrModal}
          items={items}
          data={data}
        />
      </Row>
    </Col> */}
    {
      data?.visibility === "limited" && <AllowedUsers data={data?.allowedUsers} />
    }

    {
      !!data?.attatchedFolder?.length && <AttatchedFolders data={data?.attatchedFolder} onRefresh={onRefresh} />
    }

    {!!data.documents?.length &&
      <Col>
        <LabelIcon
          title={<FormattedMessage id="documents" />}
        />
        <Row>
          {data?.documents?.map((file, i) => (
            <Col key={i} breakPoint={{ md: 3, lg: 3 }}>
              <ArchiveDocumentCard
                file={{ url: file.s3LocationUrl, ...file }}
                presignedEndpoint={"/document/presigned"}
                onDelete={onDeleteDocument}
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

    <ModalEditFolderDetails
      show={showEditFolderModal}
      onClose={onCloseEditModal}
      folderData={data}
      setIsLoading={setIsLoading}
    />

    <ModalViewQrCode
      show={showViewQrModal}
      folder={data}
      onClose={() => setShowViewQrModal(false)} />
  </>
}
