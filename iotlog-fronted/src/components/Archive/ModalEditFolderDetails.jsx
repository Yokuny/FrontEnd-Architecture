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
} from "../";

import ArchivePermissionVisible from "./ArchivePermissionVisible";
import SelectattatchedFolder from "./SelectAttachedFolders";


const ModalEditFolderDetails = ({
    show,
    setIsLoading,
    onClose = undefined,
    folderData = undefined,
}) => {
    const intl = useIntl();
    const [internalFolder, setInternalFolder] = useState({
        "name": "",
        "visibility": "",
        "attatchedFolder": [],
        "allowedUsers": []
    });
    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun) {
            if (folderData) {
                const {
                    id,
                    name,
                    visibility,
                    attatchedFolder,
                    allowedUsers,
                    ...rest
                } = folderData;

                setInternalFolder({
                    id,
                    name,
                    visibility,
                    ...(!attatchedFolder?.length && {
                        attatchedFolder: attatchedFolder?.map(folder => {
                            return {
                                value: folder.id,
                                label: folder.name,
                            }
                        })
                    }),
                    ...(!!allowedUsers?.length && {
                        allowedUsers: allowedUsers.map(user => {
                            return {
                                value: user.id,
                                label: user.name
                            }
                        })
                    })
                });
                firstRun.current = false;
            }
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

    const handleClose = () => {
        setInternalFolder({
            "name": "",
            "visibility": "",
            "attatchedFolder": [],
            "allowedUsers": []
        });
        firstRun.current = true;
        onClose();
    }

    const handleSave = async () => {

        // VALIDAR CAMPOS
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

        setIsLoading(true);

        const requestPayload = {
            id: internalFolder.id,
            name: internalFolder.name,
            visibility: internalFolder?.visibility,
            ...(internalFolder?.visibility === "limited" && {
                allowedUsers: internalFolder?.allowedUsers?.map(user => user.value)
            }),
            ...(!!internalFolder.attatchedFolder && {
                attatchedFolderId: internalFolder.attatchedFolder.map(folder => folder.value)
            })
        };

        Fetch.post("/folder/update", requestPayload).then((response) => {
            toast.success(intl.formatMessage({ id: "save.successfull" }));
            setInternalFolder({
                "name": "",
                "visibility": "",
                "attatchedFolder": [],
                "allowedUsers": []
            });
            setIsLoading(false);

            if (onClose) {
                onClose();
            }
        }).catch((e) => {
            toast.error(intl.formatMessage({ id: "error.save" }));
            setIsLoading(false);
        });
    }

    return (
        <Modal
            size="Large"
            show={show}
            title={intl.formatMessage({ id: "edit" })}
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
                <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
                    <LabelIcon
                        title={<TextSpan apparence='p2' hint>
                            <FormattedMessage id="name" />*
                        </TextSpan>}
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
                <SelectattatchedFolder
                    onChange={
                        (e) => {
                            setInternalFolder({
                                ...internalFolder,
                                attatchedFolder: e
                            })
                        }
                    }
                    value={internalFolder?.attatchedFolder}
                />
            </Row>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ModalEditFolderDetails);
