import * as React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import {
  SelectEnterprise,
  SpinnerFull,
  SelectTypeProblem,
  SelectUsers,
  FetchSupport,
} from "../../../components";
import { Button } from "@paljs/ui/Button";
import { Checkbox } from "@paljs/ui/Checkbox";
import { PERMISSIONS_SUPPORT } from "../../../constants";
import { InputGroup } from "@paljs/ui/Input";
import { toast } from "react-toastify";
import DeleteButton from "./actions/DeleteButton";
import { useNavigate } from "react-router-dom";

const AddUser = (props) => {
  const { intl } = props;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const [enterprise, setEnterprise] = React.useState(undefined);
  const [user, setUser] = React.useState(undefined);
  const [permissions, setPermissions] = React.useState([]);
  const [problems, setProblems] = React.useState([]);
  const [description, setDescription] = React.useState("");

  const searchparams = new URL(window.location.href).searchParams;
  const idEnterprise = searchparams.get("idEnterprise");
  const idUser = searchparams.get("idUser");

  React.useEffect(() => {
    if (idUser && idEnterprise) {
      loadingDataEdit(idUser, idEnterprise);
    }
  }, []);

  const loadingDataEdit = (idUser, idEnterprise) => {
    setIsLoading(true);
    FetchSupport.get(
      `/permission/userenterprise?idUser=${idUser}&idEnterprise=${idEnterprise}`
    )
      .then((response) => {
        if (response.data) {
          const {
            idEnterprise,
            idUser,
            nameUser,
            nameEnterprise,
            permissions,
            typeProblems,
            description,
          } = response.data;
          setUser({ value: idUser, label: nameUser });
          setEnterprise({ value: idEnterprise, label: nameEnterprise });
          setPermissions(permissions);
          setProblems(typeProblems);
          setDescription(description);
          setIsEdit(true);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const changePermission = (key) => {
    const keyActive = permissions.find((x) => x == key);
    if (keyActive) {
      setPermissions(permissions.filter((x) => x != key));
      return;
    }

    setPermissions([...permissions, key]);
  };

  const takeCareAllProblems = permissions.some(
    (x) => x == PERMISSIONS_SUPPORT.all_type_problems
  );

  const onSave = () => {
    if (!user || !user.value) {
      toast.warn(intl.formatMessage({ id: "user.required" }));
      return;
    }

    if (!enterprise || !enterprise.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (
      !permissions ||
      !permissions.length ||
      !permissions.some((x) => x != PERMISSIONS_SUPPORT.all_type_problems)
    ) {
      toast.warn(intl.formatMessage({ id: "allow.one.permission" }));
      return;
    }

    setIsLoading(true);

    let userSave = {
      idUser: user?.value,
      nameUser: user?.label,
      idEnterprise: enterprise?.value,
      nameEnterprise: enterprise?.label,
      permissions,
      typeProblems: problems?.map((x) => x.value),
      description,
    };

    FetchSupport.post("/permission", userSave)
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <FormattedMessage id={isEdit ? "edit.team" : "new.team"} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>

            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <SelectUsers
                onChange={(value) => setUser(value)}
                value={user}
                idEnterprise={enterprise?.value}
              />
            </Col>

            <Col breakPoint={{ lg: 12, md: 12 }}>
              <Row>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.manager_support
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.manager_support)
                    }
                  >
                    <FormattedMessage id="manager.support" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.to_do_attendance
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.to_do_attendance)
                    }
                  >
                    <FormattedMessage id="to.attendance" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.manage_maintenance
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.manage_maintenance)
                    }
                  >
                    <FormattedMessage id="manage.maintance" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.to_do_maintenance
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.to_do_maintenance)
                    }
                  >
                    <FormattedMessage id="to.maintance" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.schedule_maintenance
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.schedule_maintenance)
                    }
                  >
                    <FormattedMessage id="schedule.maintenance" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) =>
                        x == PERMISSIONS_SUPPORT.confirm_schedule_maintenance
                    )}
                    onChange={() =>
                      changePermission(
                        PERMISSIONS_SUPPORT.confirm_schedule_maintenance
                      )
                    }
                  >
                    <FormattedMessage id="confirm.schedule" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.view_closed
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.view_closed)
                    }
                  >
                    <FormattedMessage id="view.closed" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.transfer_user
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.transfer_user)
                    }
                  >
                    <FormattedMessage id="transfer.user" />
                  </Checkbox>
                </Col>

                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.cancel
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.cancel)
                    }
                  >
                    <FormattedMessage id="cancel.support" />
                  </Checkbox>
                </Col>

                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.to_do_close
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.to_do_close)
                    }
                  >
                    <FormattedMessage id="to.do.close" />
                  </Checkbox>
                </Col>

                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <Checkbox
                    checked={permissions.some(
                      (x) => x == PERMISSIONS_SUPPORT.view_feedback
                    )}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.view_feedback)
                    }
                  >
                    <FormattedMessage id="view.feedback" />
                  </Checkbox>
                </Col>

                <Col breakPoint={{ md: 3 }}>
                  <Checkbox
                    checked={takeCareAllProblems}
                    onChange={() =>
                      changePermission(PERMISSIONS_SUPPORT.all_type_problems)
                    }
                  >
                    <FormattedMessage id="takecare.all.problems" />
                  </Checkbox>
                </Col>
              </Row>
            </Col>
            {!takeCareAllProblems && (
              <Col breakPoint={{ lg: 12, md: 12 }}>
                <SelectTypeProblem
                  onChange={(value) => setProblems(value)}
                  value={problems}
                  idEnterprise={enterprise?.value}
                  isClearable
                  isMulti
                />
              </Col>
            )}
            <Col breakPoint={{ lg: 12, md: 12 }} className="mt-4">
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "message.description.placeholder",
                  })}
                  onChange={(text) => setDescription(text.target.value)}
                  value={description}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
            {!!isEdit && (
              <DeleteButton
                idEnterprise={idEnterprise}
                idUser={idUser}
                history={props.history}
              />
            )}
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

export default injectIntl(AddUser);
