import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui";
import { toast } from "react-toastify";
import {
  LabelIcon,
  Modal,
  Fetch,
} from "../";
import AddDocuments from "./AddDocuments"

const ColFlex = styled.div`
display: flex;
flex-direction: column;
width: 100%;
padding: 0 36px;
margin-bottom: 20px;
`

const ModalAddDocument = ({
  show,
  setIsLoading,
  onClose = undefined,
  folderId = undefined,
}) => {
  const intl = useIntl();
  const firstRun = useRef(true);
  const [documents, setDocuments] = useState([]);

  if (!folderId) return null;

  const onDocumentChange = (file) => {
    setDocuments([...file]);
  }

  const handleClose = () => {
    firstRun.current = true;
    setDocuments([]);
    onClose();
  }

  const handleSave = async () => {
    if (!documents.length) {
      toast.error(intl.formatMessage({ id: "documents.required" }));
      return;
    }
    setIsLoading(true);

    const requestForm = new FormData();
    requestForm.append("id", folderId);
    documents.forEach(doc => requestForm.append("files", doc));

    Fetch.post("/folder/upload-document", requestForm).then((response) => {
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setDocuments([[]]);
      setIsLoading(false);

      if (onClose) {
        onClose();
      }
    });
    setDocuments([[]]);
  }

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "add.document" })}
      onClose={handleClose}
      styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button size="Small"
              className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row>
        <ColFlex>
          <LabelIcon
            className="mb-2"
            title={<FormattedMessage id="documents" />}
          />
          <AddDocuments
            onFileChange={onDocumentChange} />
        </ColFlex>
      </Row>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ModalAddDocument);
