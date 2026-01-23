import React, { useState } from "react";
import { CardFooter } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import Row from "@paljs/ui/Row";
import { Col, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, Modal } from "../";
import SelectUserRole from "./../../components/Select/SelectUserRole";
import { Fetch } from "../Fetch";
import { SpinnerFull } from "./../Loading";
import { toast } from "react-toastify";

const SelectUsersModal = ({
  show,
  onClose,
  title = "role.user.select",
  onGetData,
  idRole,
  idEnterprise
}) => {
  const intl = useIntl();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = React.useState();
  const [selectUser, setSelectUser] = useState([]);

  async function waitUserRole() {
    if (!selectUser || !idEnterprise || !idRole) {
      return;
    }
    setIsLoading(true);
    try {
      for await (const option of selectUser) {
        const userId = option.value;

        if (userId) {
          await Fetch.put("/user/enterprise/role", {
            id: userId,
            idEnterprise,
            idRole,
          });
        }
      }

      setIsLoading(false);
      return {
        message: intl.formatMessage({ id: "role.users.assigned.success" }),
      };
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    await waitUserRole();
    setIsLoading(false);
    onClose();
    onGetData();
    toast.success(intl.formatMessage({ id: "role.users.assigned.success" }));
  };

  return (
    <Modal
      size="Medium"
      show={show}
      title={intl.formatMessage({ id: title })}
      onClose={onClose}
      styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      renderFooter={() => (
        <CardFooter>
          <Row between="xs" className="m-0">
            <Button
              size="Tiny"
              status="Basic"
              appearance="ghost"
              className="flex-between"
              onClick={onClose}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              size="Tiny"
              status="Success"
              className="flex-between"
              onClick={handleConfirm}
            >
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="confirm" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row>
        <Col breakPoint={{ xs: 12 }}>
          <LabelIcon
            iconName="people-outline"
            title={intl.formatMessage({ id: "users" })}
          />
          <SelectUserRole
            value={selectedRole}
            onChange={setSelectedRole}
            idRole={idRole}
            setSelectUser={setSelectUser}
            placeholder={intl.formatMessage({ id: "select.role" })}
          />
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </Modal>
  );
};

export default SelectUsersModal;
