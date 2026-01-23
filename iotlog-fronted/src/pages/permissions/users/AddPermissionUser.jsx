import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CardHeader, Card, CardBody, CardFooter } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Button } from "@paljs/ui/Button";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Checkbox } from "@paljs/ui";
import {
  SelectEnterprise,
  SelectUsers,
  SelectRole,
  SpinnerFull,
  Fetch,
  DeleteConfirmation,
  TextSpan,
  SelectMachineEnterprise,
  SelectCustomer,
} from "../../../components";
import UserInput from "../../../components/Inputs/UserInput";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const AddPermissionUser = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [user, setUser] = React.useState(undefined);
  const [roles, setRoles] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [isUserCustomer, setIsUserCustomer] = React.useState(false);


  // const [machines, setMachines] = React.useState([]);
  // const [codeIntegrationUser, setCodeIntegrationUser] = React.useState();
  // const [allMachines, setAllMachines] = React.useState(false);

  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");
  const idUserRef = searchparams.get("idRef");

  React.useEffect(() => {
    if (!!id) {
      loadingEdit();
    }
  }, []);

  const loadingEdit = () => {
    setIsLoading(true);
    Fetch.get(`/user/find/userenterprise?id=${id}`)
      .then((response) => {
        if (response.data) {
          setUser({
            value: response.data.idUser,
            label: response.data.name,
          });
          setEnterprise({
            value: response.data.enterprise?.id,
            label: response.data.enterprise?.name,
          });
          setRoles(
            response.data.role?.map((x) => ({
              value: x.id,
              label: x.description,
            }))
          );
          setCustomers(
            response.data.customers?.map((x) => ({
              value: x.id,
              label: x.name,
            }))
          );
          setIsUserCustomer(!!response.data.customers?.length)
          //setCodeIntegrationUser(response.data?.codeIntegrationUser);
          // setAllMachines(response.data?.allMachines);
          // setMachines(
          //   response.data.machines?.map((x) => ({
          //     value: x.id,
          //     label: x.name,
          //   }))
          // );
          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!idUserRef && !user?.value) {
      toast.warn(intl.formatMessage({ id: "user.required" }));
      return;
    }

    if (isUserCustomer && !customers?.length) {
      toast.warn(intl.formatMessage({ id: "customers.required" }));
      return;
    }

    if (isEdit) {
      onUpdate();
      return;
    }

    setIsLoading(true);
    Fetch.post("/user/enterprise", {
      idUser: idUserRef || user?.value,
      idEnterprise: enterprise?.value,
      roles: roles?.map((x) => x.value),
      isUserCustomer,
      customers: isUserCustomer && customers?.length
      ? customers?.map(x => x.value)
      :  []
      // codeIntegrationUser,
      // idMachines: allMachines ? [] : machines?.map((x) => x.value),
      // allMachines,
    })
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onUpdate = () => {
    setIsLoading(true);
    Fetch.put("/user/enterprise", {
      id: id,
      idUser: user?.value,
      idEnterprise: enterprise?.value,
      roles: roles?.map((x) => x.value),
      isUserCustomer,
      customers: isUserCustomer && customers?.length
      ? customers?.map(x => x.value)
      :  []
      // codeIntegrationUser,
      // idMachines: allMachines ? [] : machines?.map((x) => x.value),
      // allMachines,
    })
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onDeletePermission = () => {
    setIsLoading(true);
    Fetch.delete(`/user/enterprise?id=${id}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage
            id={isEdit ? "edit.user.permission" : "add.user.permission"}
          />
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="enterprise" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
                isDisabled={isEdit}
              />
            </Col>

            <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="username" />
              </TextSpan>
              <div className="mt-1"></div>
              {idUserRef ? (
                <UserInput idUser={idUserRef} />
              ) : (
                <SelectUsers
                  onChange={(value) => setUser(value)}
                  value={user}
                  idEnterprise={enterprise?.value}
                  isDisabled={isEdit}
                />
              )}
            </Col>

            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="role" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectRole onChange={(value) => setRoles(value)} value={roles} />
            </Col>

            <Col breakPoint={{ lg: 2, md: 2 }}>
              <Checkbox checked={isUserCustomer} onChange={(e) => setIsUserCustomer(prevState => !prevState)}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="user.customer" />
                </TextSpan>
              </Checkbox>
            </Col>
            {isUserCustomer && <Col breakPoint={{ lg: 10, md: 10 }}>
              <TextSpan apparence="s2"><FormattedMessage id="customer" /></TextSpan>
              <SelectCustomer
                onChange={(value) => setCustomers(value)}
                value={customers}
                idEnterprise={enterprise?.value}
                className="mt-1"
                isMulti
              />
            </Col>}

            {/* <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <Checkbox
                checked={allMachines}
                onChange={(e) => setAllMachines((prevState) => !prevState)}
              >
                <TextSpan apparence="s2">
                  <FormattedMessage id="all.machines" />
                </TextSpan>
              </Checkbox>
            </Col>

            {!allMachines && (
              <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                <TextSpan apparence="s2">
                  <FormattedMessage id="machines" />
                </TextSpan>
                <div className="mt-1"></div>
                <SelectMachineEnterprise
                  idEnterprise={enterprise?.value}
                  onChange={(value) => setMachines(value)}
                  value={machines}
                  isMulti
                />
              </Col>
            )} */}

            {/* <Col breakPoint={{ lg: 12, md: 12 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="code.user.integration.placeholder" />
              </TextSpan>

              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "code.user.integration.placeholder",
                  })}
                  onChange={(text) => setCodeIntegrationUser(text.target.value)}
                  value={codeIntegrationUser}
                  maxLength={150}
                />
              </InputGroup>
            </Col> */}
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            {!!id ? (
              <DeleteConfirmation
                message={intl.formatMessage({ id: "delete.message.default" })}
                onConfirmation={onDeletePermission}
              />
            ) : (
              <div></div>
            )}
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default AddPermissionUser;
