import { useState, useRef, useEffect } from "react";
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
  Modal,
  Fetch,
  ArchivePermissionEdit,
} from "../";

import ArchivePermissionVisible from "./ArchivePermissionVisible";

const ModalAssetFolder = ({
  show,
  setIsLoading,
  onClose = undefined,
  idAsset,
  folderToEdit = null,
  parentFolderId = null,
}) => {
  const intl = useIntl();
  const [internalFolder, setInternalFolder] = useState({
    name: "",
    description: "",
    visibility: "private",
    allowedUsers: [],
    editPermission: "public",
    allowedEditUsers: [],
    parentFolderId: parentFolderId || null,
  });
  const [usersList, setUsersList] = useState([]);
  const firstRun = useRef(true);

  useEffect(() => {
    Fetch.get(`/user/list/sameenterprises`)
      .then((response) => {
        setUsersList(response.data || []);
      })
      .catch((e) => {
      });
  }, []);

  const isEditMode = !!folderToEdit;

  useEffect(() => {
    if (show && firstRun.current && usersList.length > 0) {
      if (folderToEdit) {
        const hasEditUsers = folderToEdit.allowedEditUsers && folderToEdit.allowedEditUsers.length > 0;

        let editPermission = "public";
        if (hasEditUsers) {
          if (folderToEdit.allowedEditUsers.length === 1 &&
            folderToEdit.allowedEditUsers[0] === folderToEdit.createdBy) {
            editPermission = "private";
          } else {
            editPermission = "limited";
          }
        }

        const mapUsersToOptions = (userIds) => {
          return userIds.map((userId) => {
            const user = usersList.find((u) => u.id === userId);
            return {
              value: userId,
              label: user ? user.name : userId,
            };
          });
        };

        setInternalFolder({
          id: folderToEdit.id,
          name: folderToEdit.name || "",
          description: folderToEdit.description || "",
          visibility: folderToEdit.visibility || "private",
          parentFolderId: folderToEdit.parentFolderId || null,
          allowedUsers: folderToEdit.allowedUsers
            ? mapUsersToOptions(folderToEdit.allowedUsers)
            : [],
          editPermission: editPermission,
          allowedEditUsers: hasEditUsers && editPermission === "limited"
            ? mapUsersToOptions(folderToEdit.allowedEditUsers)
            : [],
        });
      } else {
        setInternalFolder({
          name: "",
          description: "",
          visibility: "private",
          allowedUsers: [],
          editPermission: "public",
          allowedEditUsers: [],
          parentFolderId: parentFolderId || null,
        });
      }
      firstRun.current = false;
    }
  }, [folderToEdit, show, parentFolderId, usersList]);

  const onChangeUsers = (value) => {
    setInternalFolder({
      ...internalFolder,
      allowedUsers: value,
    });
  };

  const onChangeEditUsers = (value) => {
    setInternalFolder({
      ...internalFolder,
      allowedEditUsers: value,
    });
  };

  const onChange = (prop, value) => {
    setInternalFolder({
      ...internalFolder,
      [prop]: value,
    });
  };

  const handleClose = (hasChanges = false) => {
    setInternalFolder({
      name: "",
      description: "",
      visibility: "private",
      allowedUsers: [],
      editPermission: "public",
      allowedEditUsers: [],
      parentFolderId: parentFolderId || null,
    });
    firstRun.current = true;
    if (onClose) {
      onClose(hasChanges);
    }
  };

  const handleSave = async () => {
    if (!internalFolder?.name?.trim()) {
      toast.error(intl.formatMessage({ id: "name.required" }));
      return;
    }

    if (!internalFolder?.visibility) {
      toast.error(intl.formatMessage({ id: "visibility.required" }));
      return;
    }

    if (
      internalFolder?.visibility === "limited" &&
      (!internalFolder.allowedUsers || internalFolder.allowedUsers.length === 0)
    ) {
      toast.error(intl.formatMessage({ id: "allowed.users.required" }));
      return;
    }

    if (
      internalFolder?.editPermission === "limited" &&
      (!internalFolder.allowedEditUsers || internalFolder.allowedEditUsers.length === 0)
    ) {
      toast.error(intl.formatMessage({ id: "edit.users.required" }));
      return;
    }

    setIsLoading(true);

    try {
      const requestPayload = {
        idAsset,
        name: internalFolder.name.trim(),
        description: internalFolder.description?.trim() || "",
        visibility: internalFolder.visibility,
        ...(internalFolder.visibility === "limited" && {
          allowedUsers: internalFolder.allowedUsers.map((user) => user.value),
        }),
        parentFolderId: internalFolder.parentFolderId || null,
        editPermission: internalFolder.editPermission,
      };

      if (internalFolder.editPermission === "limited") {
        requestPayload.allowedEditUsers = internalFolder.allowedEditUsers.map((user) => user.value);
      }

      if (isEditMode) {
        await Fetch.put(
          `/assetdocument/folder/update?id=${internalFolder.id}`,
          requestPayload
        );
        toast.success(intl.formatMessage({ id: "folder.update.successful" }));
      } else {
        await Fetch.post("/assetdocument/folder/create", requestPayload);
        toast.success(intl.formatMessage({ id: "folder.create.successful" }));
      }

      setInternalFolder({
        name: "",
        description: "",
        visibility: "private",
        allowedUsers: [],
        editPermission: "public",
        allowedEditUsers: [],
        parentFolderId: parentFolderId || null,
      });
      setIsLoading(false);
      firstRun.current = true;

      if (onClose) {
        onClose(true);
      }
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: isEditMode ? "error.update.folder" : "error.create.folder",
        })
      );
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({
        id: isEditMode ? "edit.folder" : "new.folder",
      })}
      onClose={() => handleClose(false)}
      styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button size="Small" className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row>
        <Col breakPoint={{ lg: 6, md: 6 }} className="mb-2">
          <LabelIcon
            mandatory
            iconName="folder-outline"
            title={<FormattedMessage id="folder.name" />}
          />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "folder.name" })}
              value={internalFolder?.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ lg: 6, md: 6 }} className="mb-2">
          <LabelIcon
            iconName="text-outline"
            title={<FormattedMessage id="folder.description" />}
          />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "folder.description" })}
              value={internalFolder?.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </InputGroup>
        </Col>
        <ArchivePermissionVisible
          onChangeVisible={(e) => {
            onChange("visibility", e);
          }}
          onChangeUsers={onChangeUsers}
          users={internalFolder.allowedUsers}
          visible={internalFolder?.visibility}
        />

        <ArchivePermissionEdit
          onChangeEditPermission={(value) => onChange("editPermission", value)}
          onChangeEditUsers={onChangeEditUsers}
          editUsers={internalFolder.allowedEditUsers}
          editPermission={internalFolder.editPermission}
        />
      </Row>
    </Modal>
  );
};

export default ModalAssetFolder;


