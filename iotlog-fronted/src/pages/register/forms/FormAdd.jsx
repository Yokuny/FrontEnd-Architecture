import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Tab,
  Tabs,
} from "@paljs/ui";
import React, { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  Modal,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import ContentItem from "../../forms/Item";
import ListFields from "./fields/ListFields";
import Others from "./others";
import AddFormPermissions from "./permissions/AddFormPermissionsBody";
import { generateCodeFieldName } from "./Utils";
const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const FormAdd = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState();
  const [data, setData] = React.useState();
  const [dataDemo, setDataDemo] = React.useState({});
  const [validations, setValidations] = React.useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const isChanged = useRef(false);

  const intl = useIntl();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const newForm = searchParams.get("new") || "false";
  const pending = searchParams.get("pending") || "false";
  const duplicate = searchParams.get("duplicate") || "false";

  useEffect(() => {
    if (isChanged.current === true) {
      const forms = JSON.parse(localStorage.getItem("forms")) || [];
      if (data) {
        localStorage.setItem(
          "forms",
          JSON.stringify([
            ...forms.filter((form) => form.id !== id),
            { id, data, enterprise },
          ])
        );
      }
    }
  }, [data, enterprise, id]);

  useEffect(() => {
    verifyGetLocalOrServer(id, newForm, pending, duplicate);
  }, [id, newForm, pending, duplicate]);

  const verifyGetLocalOrServer = (id, newForm, pending, duplicate) => {
    const isPending = pending === "true";
    const isNewForm = newForm === "true";
    const isDuplicate = duplicate === "true";
    
    if (isPending) {
      try {
        const forms = JSON.parse(localStorage.getItem("forms")) || [];
        const form = forms.find((form) => form.id === id);

        if (form) {
          setData(form.data);
          if (form.enterprise) setEnterprise(form.enterprise);
        }
      } catch (e) { }
      return;
    }

    if (isDuplicate && id) {
      getData(true);
      return;
    }
    
    if (id && !isNewForm && !isDuplicate) {
      getData(false);
      return;
    }
  };

  const getData = (isDuplicate = false) => {
    setIsLoading(true);
    Fetch.get(`/form?id=${id}`)
      .then((response) => {
        if (response.data) {
          const formData = {
            ...response.data,
            description: isDuplicate 
              ? `${response.data.description} (${intl.formatMessage({ id: "copy" })})`
              : response.data.description,
            viewVisibility: response.data?.permissions?.view?.visibility,
            viewUsers: response.data.permissions?.view?.users,
            editVisibility: response.data?.permissions?.edit?.visibility,
            editUsers: response.data?.permissions?.edit?.users,
            fillVisibility: response.data?.permissions?.fill?.visibility,
            fillUsers: response.data?.permissions?.fill?.users,
            deleteFormBoardVisibility:
              response.data?.permissions?.deleteFormBoard?.visibility,
            deleteFormBoardUsers:
              response.data?.permissions?.deleteFormBoard?.users,
            justifyVisibility: response.data?.permissions?.justify?.visibility,
            justifyUsers: response.data?.permissions?.justify?.users,
            editFormFillingVisibility: response.data?.permissions?.editFilling?.visibility,
            editFormFillingUsers: response.data?.permissions?.editFilling?.users,
            blockVisibility: response.data?.permissions?.block?.visibility,
            blockUsers: response.data?.permissions?.block?.users,
          };

          setEnterprise({
            value: response.data?.enterprise?.id,
            label: response.data?.enterprise?.name,
          });
          
          setData(formData);
          
          setValidations(
            response.data.validations?.length
              ? response.data.validations[0]
              : undefined
          );
          
          if (isDuplicate) {
            // Remove o parâmetro duplicate e marca como novo
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("duplicate");
            newParams.set("new", "true");
            setSearchParams(newParams, { replace: true });
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));

    if (prop !== "fields") isChanged.current = true;
  };

  const onChangeItem = (index, prop, value) => {
    let item = data.fields[index];
    item[prop] = value;
    setData({
      ...data,
      fields: [
        ...data.fields.slice(0, index),
        item,
        ...data.fields.slice(index + 1),
      ],
    });
  };

  const onSetFieldItem = (index, data) => {
    setData(prevState => ({
      ...prevState,
      fields: [
        ...prevState.fields.slice(0, index),
        data,
        ...prevState.fields.slice(index + 1),
      ],
    }));
  };

  const onRemoveItem = (index) => {
    setData((prevState) => ({
      ...prevState,
      fields: [
        ...prevState.fields.slice(0, index),
        ...prevState.fields.slice(index + 1),
      ].map((x, i) => ({ ...x, id: i + 1 })),
    }));
  };

  const onChangeDemo = (prop, value) => {
    setDataDemo((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const normalizeFields = (fields) => {
    return fields?.map((x) => {
      delete x.chosen;
      return {
        ...x,
        name: x.name || generateCodeFieldName(x.description),
        fields: x?.fields?.length ? normalizeFields(x?.fields) : [],
      };
    });
  };

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "machine.idEnterprise.required" }));
      return;
    }

    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (!data?.fields?.length) {
      toast.warn(intl.formatMessage({ id: "fields.required" }));
      return;
    }

    if (data.whatsapp && !data.users) {
      toast.warn(intl.formatMessage({ id: "users.required" }));
      return;
    }

    if (data.email && !data.emails) {
      toast.warn(intl.formatMessage({ id: "emails.required" }));
      return;
    }

    if (!data?.viewVisibility) {
      toast.warn(intl.formatMessage({ id: "visibility.required" }));
      return;
    }

    if (data.viewVisibility === "limited" && !data?.viewUsers.length) {
      toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
      return;
    }

    if (!data?.editVisibility) {
      toast.warn(`${intl.formatMessage({ id: "required" })} '${intl.formatMessage({ id: "config.form" })}'`);
      return;
    }

    if (data.editVisibility === "limited" && !data?.editUsers.length) {
      toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
      return;
    }

    if (!data?.fillVisibility) {
      toast.warn(`${intl.formatMessage({ id: "required" })} '${intl.formatMessage({ id: "add.form" })}'`);
      return;
    }

    if (data.fillVisibility === "limited" && !data?.fillUsers?.length) {
      toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
      return;
    }

    if (data?.typeForm === "RVE") {
      if (!data?.justifyVisibility) {
        toast.warn(`${intl.formatMessage({ id: "required" })} '${intl.formatMessage({ id: "justify" })}'`);
        return;
      }

      if (data.justifyVisibility === "limited" && !data?.justifyUsers?.length) {
        toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
        return;
      }
    }

    if (!data?.deleteFormBoardVisibility) {
      toast.warn(`${intl.formatMessage({ id: "required" })} '${intl.formatMessage({ id: "delete.form.board" })}'`);
      return;
    }

    if (
      data.deleteFormBoardVisibility === "limited" &&
      !data?.deleteFormBoardUsers?.length
    ) {
      toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
      return;
    }

    if (["RDO", "Sondagem","NOON_REPORT"].includes(data?.typeForm)) {
      if (!data?.blockVisibility) {
        toast.warn(`${intl.formatMessage({ id: "required" })} '${intl.formatMessage({ id: "block" })}'`);
        return;
      }

      if (data.blockVisibility === "limited" && !data?.blockUsers?.length) {
        toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
        return;
      }
    }

    const fieldsNormalize = normalizeFields(data?.fields);
    const allFields = fieldsNormalize
      ?.map((x) => [x.name, ...(x.fields?.map((y) => y.name) || [])])
      ?.flat();

    if (allFields?.length !== [...new Set(allFields)]?.length) {
      toast.warn(intl.formatMessage({ id: "there.name.same" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/form${newForm === "true" ? "?isNew=true" : ""}`, {
      id,
      idEnterprise: enterprise?.value,
      description: data?.description,
      fields: fieldsNormalize,
      validations: validations ? [validations] : [],
      isVisiblePublic: data?.isVisiblePublic,
      usersVisible: data?.usersVisible,
      typeForm: data?.typeForm,
      usersAdmin: data?.usersAdmin,
      permissions: {
        view: {
          users: !!data?.viewUsers?.length
            ? data.viewUsers.map((x) => x.value)
            : [],
          visibility: data?.viewVisibility,
        },
        edit: {
          users: !!data?.editUsers?.length
            ? data.editUsers.map((x) => x.value)
            : [],
          visibility: data?.editVisibility,
        },
        fill: {
          users: !!data?.fillUsers?.length
            ? data?.fillUsers.map((x) => x.value)
            : [],
          visibility: data?.fillVisibility,
        },
        deleteFormBoard: {
          users: !!data?.deleteFormBoardUsers?.length
            ? data?.deleteFormBoardUsers.map((x) => x.value)
            : [],
          visibility: data?.deleteFormBoardVisibility,
        },
        justify: {
          users: !!data?.justifyUsers?.length
            ? data?.justifyUsers.map((x) => x.value)
            : [],
          visibility: data?.justifyVisibility,
        },
        editFilling: {
          users: !!data?.editFormFillingUsers?.length
            ? data?.editFormFillingUsers.map((x) => x.value)
            : [],
          visibility: data?.editFormFillingVisibility,
        },
        block: {
          users: !!data?.blockUsers?.length
            ? data?.blockUsers.map((x) => x.value)
            : [],
          visibility: data?.blockVisibility,
        },
      },
      whatsapp: data.whatsapp || false,
      users: data.users || [],
      email: data.email || false,
      emails: data.emails || [],
    })
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        clearFormLocal(id);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const clearFormLocal = (id) => {
    const forms = JSON.parse(localStorage.getItem("forms")) || [];
    const newForms = forms.filter((form) => form.id !== id);
    localStorage.setItem("forms", JSON.stringify(newForms));
    isChanged.current = false;
  };

  const onDelete = () => {
    const forms = JSON.parse(localStorage.getItem("forms")) || [];
    const newForms = forms.filter((form) => form.id !== id);

    localStorage.setItem("forms", JSON.stringify(newForms));
    isChanged.current = false;

    setIsLoading(true);
    Fetch.delete(`/form?id=${id}`)
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const isShowDeactive =
    id &&
    props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === enterprise?.value &&
        x.paths?.includes("/delete-type-user")
    );

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Row style={{ margin: 0 }} between="xs">
                <TextSpan apparence="s1">
                  <FormattedMessage id="form" />
                </TextSpan>
                {!!data?.fields?.length && (
                  <Button
                    className="flex-between"
                    size="Tiny"
                    onClick={() => setShowModal(true)}
                  >
                    <EvaIcon name="eye-outline" className="mr-1" />
                    Preview
                  </Button>
                )}
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="home-outline"
                    title={`${intl.formatMessage({ id: "enterprise" })} *`}
                  />
                  <div className="mt-1"></div>
                  <SelectEnterprise
                    onChange={(value) => setEnterprise(value)}
                    value={enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="text-outline"
                    title={`${intl.formatMessage({ id: "description" })} *`}
                  />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "description",
                      })}
                      onChange={(text) =>
                        onChange("description", text.target.value)
                      }
                      value={data?.description}
                    />
                  </InputGroup>
                </Col>
                <Tabs fullWidth style={{ width: "100%" }}>
                  <Tab
                    responsive
                    icon="file-text-outline"
                    title={intl.formatMessage({ id: "form" })}
                  >
                    <Row>
                      <ListFields
                        onChange={onChange}
                        onChangeItem={onChangeItem}
                        onRemoveItem={onRemoveItem}
                        onSetFieldItem={onSetFieldItem}
                        data={data}
                        idEnterprise={enterprise?.value}
                        renderHeader={() => (
                          <>
                            <LabelIcon
                              iconName="archive-outline"
                              title={<FormattedMessage id="fields.of.form" />}
                            />
                            <div className="mt-1"></div>
                          </>
                        )}
                      />
                    </Row>
                  </Tab>
                  <Tab
                    icon="shuffle-2-outline"
                    responsive
                    title={intl.formatMessage({ id: "other" })}
                  >
                    <Others
                      data={data}
                      onChange={onChange}
                      enterprise={enterprise}
                    />
                  </Tab>
                  <Tab
                    icon="person-done-outline"
                    responsive
                    title={intl.formatMessage({ id: "permissions" })}
                  >
                    <AddFormPermissions
                      idEnterprise={enterprise?.value}
                      intl={intl}
                      data={data}
                      onChange={onChange}
                    />
                  </Tab>
                </Tabs>
              </Row>
            </CardBody>
            <CardFooter>
              <Row
                style={{ margin: 0 }}
                end={!isShowDeactive}
                between={isShowDeactive}
              >
                {isShowDeactive && (
                  <DeleteConfirmation
                    onConfirmation={() => onDelete()}
                    message={intl.formatMessage({
                      id: "delete.message.default",
                    })}
                  />
                )}
                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <Modal
        size="ExtraLarge"
        show={showModal}
        title="Preview"
        onClose={() => setShowModal(false)}
        styleContent={{ maxHeight: "calc(100vh - 150px)" }}
      >
        <Row>
          {normalizeFields(data?.fields)?.map((x, i) => (
            <ContentItem
              key={`${i}-${x?.name}`}
              data={dataDemo}
              field={x}
              onChange={onChangeDemo}
            />
          ))}
        </Row>
      </Modal>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(FormAdd);
