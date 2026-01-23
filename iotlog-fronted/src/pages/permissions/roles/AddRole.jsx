import * as React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { toast } from "react-toastify";
import { Tab, Tabs } from "@paljs/ui";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  SpinnerFull,
  Fetch,
  DeleteConfirmation,
} from "../../../components";
import ListPaths from "./ListPaths";
import PermissionVisible from "../../../components/Permission/PermissionVisible";
import ListChatbotAllow from "./ListChatbotAllow";
import { LabelIcon, SelectEnterprise } from "../../../components";
import ConfirmDeleteModal from "../../../components/Archive/ModalConfirmDelete";
import AssetsPermissions from "./AssetsPermissions";

const AddRole = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [data, setData] = React.useState({});
  const [pathSelected, setPathSelected] = React.useState([]);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    React.useState(false);
  const [quantityUsersRole, setQuantityUsersRole] = React.useState();

  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");

  const idEnterprise =
    props.idEnterprises?.[0] || localStorage.getItem("id_enterprise_filter");

  React.useEffect(() => {
    if (!!id) {
      loadingEdit();
    }
  }, []);

  const loadingEdit = () => {
    setIsLoading(true);
    Fetch.get(`/role?id=${id}`)
      .then((response) => {
        if (response.data) {
          setPathSelected(response.data?.roles?.map((x) => x.path));
          setData({
            description: response.data?.description,
            enterprise: {
              value: response.data?.enterprise?.id,
              label: response.data?.enterprise?.name,
            },
            visible: response.data?.visibility,
            whoEdit: response.data?.edit,
            users: response.data?.users,
            allMachines: response.data?.allMachines,
            interactChatbot: response.data?.interactChatbot,
            purchaseChatbot: response.data?.purchaseChatbot,
            notifyTravelWhatsapp: response.data?.notifyTravelWhatsapp,
            notifyTravelEmail: response.data?.notifyTravelEmail,
            machines: response.data.machines?.map((x) => ({
              value: x.id,
              label: x.name,
            })),
            allSensors: response.data?.allSensors,
            idSensors: response.data?.idSensors,
            isShowStatusFleet: response.data.isShowStatusFleet,
            isShowConsumption: response.data.isShowConsumption,
            isShowStatus: response.data.isShowStatus,
            isChangeStatusFleet: response.data.isChangeStatusFleet,
            isSendLinkLocation: response.data.isSendLinkLocation,
            isNotifyEventVoyage: response.data.isNotifyEventVoyage,
            isAllowReceivedChangeStatus:
              response.data.isAllowReceivedChangeStatus,
            isNotifyByChatbotAnomaly: response.data.isNotifyByChatbotAnomaly,
            isNotifyByMailAnomaly: response.data.isNotifyByMailAnomaly,
            isNotifyAlertOperational: response.data.isNotifyAlertOperational,
            isNotifyRVEDivergencies: response.data.isNotifyRVEDivergencies,
            isNotifyInsuranceDT: response.data.isNotifyInsuranceDT,

          });
          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        if (e?.response?.status === 403) {
          navigate(-1);
        }
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const onSave = () => {
    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }
    setIsLoading(true);

    const dataToSave = {
      description: data?.description,
      idEnterprise: data?.enterprise?.value,
      roles: pathSelected.map((x) => ({ path: x })),
      edit: data?.whoEdit,
      visibility: data?.visible,
      users: data?.visible === "limited" ? data?.users : [],
      idMachines: data?.allMachines ? [] : data?.machines?.map((x) => x.value),
      allMachines: !!data?.allMachines,
      allSensors: !!data?.allSensors,
      idSensors: data?.allSensors ? [] : data?.idSensors,
      interactChatbot: !!data.interactChatbot,
      notifyTravelWhatsapp: !!data.notifyTravelWhatsapp,
      notifyTravelEmail: !!data.notifyTravelEmail,
      purchaseChatbot: !!data.purchaseChatbot,
      isShowStatusFleet: !!data.isShowStatusFleet,
      isShowConsumption: !!data.isShowConsumption,
      isShowStatus: !!data.isShowStatus,
      isChangeStatusFleet: !!data.isChangeStatusFleet,
      isSendLinkLocation: !!data.isSendLinkLocation,
      isNotifyEventVoyage: !!data.isNotifyEventVoyage,
      isAllowReceivedChangeStatus: !!data.isAllowReceivedChangeStatus,
      isNotifyByChatbotAnomaly: !!data.isNotifyByChatbotAnomaly,
      isNotifyByMailAnomaly: !!data.isNotifyByMailAnomaly,
      isNotifyAlertOperational: !!data.isNotifyAlertOperational,
      isNotifyRVEDivergencies: !!data.isNotifyRVEDivergencies,
      isNotifyInsuranceDT: !!data.isNotifyInsuranceDT,
    };

    if (!!id) {
      dataToSave.id = id;
    }

    Fetch.post("/role", dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const changeCheck = (pathChange, checked) => {
    if (checked) {
      setPathSelected(pathSelected.filter((x) => x != pathChange.path));
      return;
    }
    setPathSelected([...pathSelected, pathChange.path]);
  };

  const fetchUsersRoles = () => {
    setIsLoading(true);
    Fetch.get(
      `role/list/users-enterprise?idRole=${id}&idEnterprise=${idEnterprise}`
    ).then((response) => {
      if (response.data.users.length > 0) {
        setQuantityUsersRole(response.data.users.length);
        setShowConfirmDeleteModal(true);

        setIsLoading(false);
      } else {
        onDelete();
      }
    });
  };

  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/role?id=${id}&idEnterprise=${idEnterprise}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowConfirmDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    setIsLoading(true);
    Fetch.delete(
      `role/removewithusers?idRole=${id}&idEnterprise=${idEnterprise}`
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          toast.success(intl.formatMessage({ id: "delete.successfull" }));
          setIsLoading(false);
          navigate(-1);
        } else {
          setIsLoading(false);
          toast.error(intl.formatMessage({ id: "role.remove.users.error" }));
        }
      })
      .catch((error) => {
        toast.error(intl.formatMessage({ id: "role.request.error" }));
      })
      .finally(() => {
        setIsLoading(false);
        setShowConfirmDeleteModal(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id={isEdit ? "edit.role" : "new.role"} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <LabelIcon
                className="mb-1"
                iconName="home-outline"
                title={<FormattedMessage id="enterprise" />}
              />
              <SelectEnterprise
                onChange={(enterprise) => onChange("enterprise", enterprise)}
                value={data?.enterprise}
                oneBlocked
              />

              <LabelIcon
                className="mt-2"
                iconName="text-outline"
                title={
                  <>
                    <FormattedMessage id="description" /> *
                  </>
                }
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "message.description.placeholder",
                  })}
                  onChange={(text) =>
                    onChange("description", text.target.value)
                  }
                  value={data?.description}
                  maxLength={150}
                />
              </InputGroup>
            </Col>

            <Tabs style={{ width: "100%" }} fullWidth>
              <Tab
                responsive
                icon="monitor-outline"
                title={<FormattedMessage id="pages" />}
              >
                <Row>
                  <Col breakPoint={{ lg: 12, md: 12 }}>
                    <Row>
                      <ListPaths
                        changeCheck={changeCheck}
                        pathSelected={pathSelected}
                      />
                    </Row>
                  </Col>
                </Row>
              </Tab>
              <Tab
                responsive
                icon="settings-2-outline"
                title={<FormattedMessage id="machines" />}
              >
                <AssetsPermissions
                  data={data}
                  onChange={onChange}
                  idEnterprise={idEnterprise}
                />
              </Tab>
              <Tab responsive icon="message-circle-outline" title={"chatbot"}>
                <ListChatbotAllow data={data} onChange={onChange} />
              </Tab>
              <Tab
                title={<FormattedMessage id="edit.role" />}
                icon="edit-2-outline"
                responsive
              >
                <Row style={{ width: "100%" }}>
                  <Col
                    breakPoint={{ lg: 12, md: 12 }}
                    style={{ width: "100%" }}
                  >
                    <PermissionVisible
                      onChangeUsers={(value) => onChange("users", value)}
                      users={data?.users}
                      visible={data?.visible}
                      onChangeVisible={(value) => onChange("visible", value)}
                      whoEdit={data?.whoEdit}
                      onChangeWhoEdit={(value) => onChange("whoEdit", value)}
                    />
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Row>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            {!!id ? (
              <DeleteConfirmation
                message={intl.formatMessage({ id: "delete.message.default" })}
                onConfirmation={fetchUsersRoles}
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
      <ConfirmDeleteModal
        show={showConfirmDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={intl.formatMessage(
          { id: "message.users.role.quantity" },
          { quantity: String(quantityUsersRole) }
        )}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  idEnterprises: state.enterpriseFilter.idEnterprises,
});

export default connect(mapStateToProps)(AddRole);
