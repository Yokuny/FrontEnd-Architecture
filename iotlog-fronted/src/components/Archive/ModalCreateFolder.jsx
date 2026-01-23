import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui";
import { toast } from "react-toastify";
import {
  LabelIcon,
  TextSpan,
  Modal,
  Fetch,
  SelectEnterprise,
} from "../";

import ArchivePermissionVisible from "./ArchivePermissionVisible";
import SelectAttatchedFolders from "./SelectAttachedFolders";

import AddDocuments from "./AddDocuments";
import styled from "styled-components";

const ColFlex = styled.div`
display: flex;
flex-direction: column;
width: 100%;
padding: 0 36px;
margin-bottom: 20px;
`
const ModalCreateFolder = ({
  show,
  setIsLoading,
  onClose = undefined,
  folderData = undefined,
}) => {
  const intl = useIntl();
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalFolder, setInternalFolder] = useState(
    {
      "name": "",
      "visibility": "",
      "attachedFolders": [],
      "allowedUsers": []
    });
  const firstRun = useRef(true);
  const [documents, setDocuments] = useState([]);
  const [enterprise, setEnterprise] = useState(null);

  useEffect(() => {
    if (firstRun) {
      if (folderData) {
        const {
          id,
          name,
          visibility,
          attachedFolders,
          documents,
          ...rest
        } = folderData;

        setInternalFolder({
          id,
          name,
          visibility,
          attachedFolders,
          documents,
        });
      }

      firstRun.current = false;
    }
  }, [folderData, show])

  const onChangeUsers = (value) => {
    setInternalFolder({
      ...internalFolder,
      allowedUsers: value
    })
  }

  const onChange = (prop, value) => {
    const oldFolder = internalFolder;
    oldFolder[prop] = value;
    setInternalFolder({ ...oldFolder });
  }

  const onDocumentChange = (file) => {
    setDocuments([...file]);
  }

  const handleClose = () => {
    setInternalFolder({
      "name": "",
      "visibility": "",
      "attachedFolders": [],
      "allowedUsers": []
    });
    firstRun.current = true;
    setDocuments([]);
    onClose();
  }

  const handleSave = () => {

    // VALIDAR CAMPOS
    if (!enterprise?.value) {
      toast.error(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!internalFolder?.name) {
      toast.error(intl.formatMessage({ id: "name.required" }));
      return;
    }

    if (!internalFolder?.visibility) {
      toast.error(intl.formatMessage({ id: "visibility.required" }));
      return;
    }

    if (internalFolder?.visibility === "limited" && !internalFolder.allowedUsers) {
      toast.error(intl.formatMessage({ id: "allowed.users.required" }));
      return;
    }

    if (!documents.length) {
      toast.error(intl.formatMessage({ id: "documents.required" }));
      return;
    }
    setIsLoading(true);

    const requestForm = new FormData();
    requestForm.append("idEnterprise", enterprise?.value);
    requestForm.append("name", internalFolder.name);
    requestForm.append("visibility", internalFolder?.visibility);

    if (internalFolder?.visibility === "limited")
      internalFolder.allowedUsers.forEach(user => requestForm.append("allowedUsers", user.value));

    if (internalFolder.attachedFolders)
      internalFolder.attachedFolders.forEach(folder => requestForm.append("attatchedFolderId", folder.value));

    documents.forEach(doc => requestForm.append("files", doc));

    Fetch.post("/folder/create", requestForm)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setDocuments([[]]);
        setInternalFolder({
          "name": "",
          "visibility": "",
          "attachedFolders": [],
          "allowedUsers": []
        });
        setIsLoading(false);

        if (onClose) {
          onClose();
        }
      })
      .catch((error) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setDocuments([[]]);
        setInternalFolder({
          "name": "",
          "visibility": "",
          "attachedFolders": [],
          "allowedUsers": []
        });
      });
  }

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "new.folder" })}
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
        <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
          <LabelIcon
            iconName={"home-outline"}
            title={<FormattedMessage id="enterprise" />}
            mandatory
          />
          <div className="mt-1"></div>
          <SelectEnterprise
            onChange={(value) => setEnterprise(value)}
            value={enterprise}
            oneBlocked
          />
        </Col>
        <Col breakPoint={{ lg: 6, md: 6 }} className="mb-2">
          <LabelIcon
            mandatory
            iconName={"text-outline"}
            title={<FormattedMessage id="name" />}
          />
          <InputGroup fullWidth>
            <input type="text"
              placeholder={intl.formatMessage({ id: "name" })}
              value={internalFolder?.name}
              onChange={(e) => onChange("name", e.target.value)} />
          </InputGroup>
        </Col>
        <ArchivePermissionVisible
          onChangeVisible={(e) => {
            onChange("visibility", e)
          }}
          onChangeUsers={onChangeUsers}
          users={internalFolder.allowedUsers}
          visible={internalFolder?.visibility}
        />
        <SelectAttatchedFolders
          onChange={
            (e) => {
              setInternalFolder({
                ...internalFolder,
                attachedFolders: e
              })
            }
          }
          value={internalFolder?.attachedFolders}
        />
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

export default connect(mapStateToProps, undefined)(ModalCreateFolder);
