import { useNavigate } from "react-router-dom";
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Fetch, SpinnerFull } from "../../../components";
import FolderEditButtonOverlay from "../../../components/Archive/FolderView/FolderEditButtonOverlay";
import ModalViewDocument from "../../../components/Archive/ModalVIewDocument";
import ModalEditFolderDetails from "../../../components/Archive/ModalEditFolderDetails";
import ModalViewQrCode from "../../../components/Archive/ModalVIewQrCode";

export default function OptionsButton({ data, items, onRefresh }) {

  const [showEditFolderModal, setShowEditFolderModal] = React.useState(false);
  const [showViewQrModal, setShowViewQrModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showViewDocumentModal, setShowViewDocumentModal] = React.useState(false);
  const [documentToView, setDocumentToView] = React.useState(null);

  const navigate = useNavigate();
  const intl = useIntl();

  const onDeleteFolder = async () => {
    setIsLoading(true);
    Fetch.delete(`/folder/delete?id=${data.id}`)
      .then(
        (response) => {
          setIsLoading(false);
          toast.success(intl.formatMessage({ id: "delete.success" }));
          navigate(`/list-folders`);
        })
      .catch(e => {
        setIsLoading(false);
        toast.error(
          intl.formatMessage({ id: "error.delete" }))
      });
  }

  const onShowQrModal = () => {
    setShowViewQrModal(true);
  }


  const onCloseEditModal = () => {
    setShowEditFolderModal(false);
    onRefresh();
  }

  const onCloseViewDocumentModal = () => {
    setShowViewDocumentModal(false);
    setDocumentToView(null);
  }

  return <>
    <FolderEditButtonOverlay
      Link={navigate}
      openEditFolderModal={() => setShowEditFolderModal(true)}
      onDeleteFolder={onDeleteFolder}
      onShowQrModal={onShowQrModal}
      items={items}
      data={data}
    />
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

    <SpinnerFull
      isLoading={isLoading}
    />
  </>
}
