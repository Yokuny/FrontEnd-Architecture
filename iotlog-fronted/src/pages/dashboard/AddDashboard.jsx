import React from "react";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import Select from "@paljs/ui/Select";
import {
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SelectUsers,
  SpinnerFull,
  SelectMachineEnterprise,
} from "../../components";
import DeleteDashboard from "./DeleteDashboard";
import { useNavigate } from "react-router-dom";
import SelectFolder from "./folder/SelectFolder";

const VISIBILITY = {
  LIMITED: "limited",
  PRIVATE: "private",
  PUBLIC: "public",
};

const LAYOUTS = {
  SIMPLE: "simple",
  GROUP: "group",
  FRAME: "frame"
};

const TYPE = {
  DASHBOARD: "dashboard",
  FOLDER: "folder",
  URL_EXTERNAL: "url.external",
};

const AddDashboard = (props) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState();

  const [data, setData] = React.useState({
    description: "",
    visible: "",
    edit: "",
    typeLayout: "",
    typeData: "",
    urlExternal: undefined,
    users: [],
    machines: [],
  })


  const intl = useIntl();
  const navigate = useNavigate();
  const paramsQuery = new URL(window.location.href).searchParams;
  const id = paramsQuery.get("id");

  React.useEffect(() => {
    if (id) verifyEdit(id);
  }, []);

  const onChange = (prop, value) => {
    setData(prevState => ({
      ...prevState,
      [prop]: value
    }))
  }

  const verifyEdit = () => {
    setIsLoading(true);
    Fetch.get(`/dashboard/find?id=${id}`)
      .then((response) => {
        if (response.data) {

          setEnterprise({
            value: response.data?.enterprise?.id,
            label: response.data?.enterprise?.name,
          });
          setData({
            description: response.data?.description,
            visible: response.data?.visibility,
            users: response.data?.usersData?.map((x) => ({
              value: x.id,
              label: x.name,
            })),
            machines: response.data?.machines?.map((x) => ({
              value: x.id,
              label: x.name,
            })),
            urlExternal: response.data.urlExternal || undefined,
            edit: response.data.edit,
            typeLayout: response.data?.typeLayout,
            typeData: response.data.typeData,
            folder: response.data.folder
              ? {
                value: response.data.folder.id,
                label: response.data.folder.description,
              }
              : null
          })

          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = async () => {
    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (data?.visible === VISIBILITY.LIMITED && !data?.users?.length) {
      toast.warn(intl.formatMessage({ id: "users.required.when.limited" }));
      return;
    }

    const toSave = {
      id,
      description: data?.description,
      public: !!(data?.visible === VISIBILITY.PUBLIC),
      idEnterprise: enterprise?.value,
      visibility: data?.visible,
      users:
        data?.visible === VISIBILITY.LIMITED
          ? data?.users?.map((x) => ({ id: x.value, name: x.label }))
          : [],
      idMachines: data?.machines?.map((x) => x.value),
      edit: data?.edit,
      typeLayout: data?.typeLayout,
      typeData: data?.typeData,
      idFolder: data?.folder?.value || null,
      urlExternal: data?.urlExternal || undefined
    };

    setIsLoading(true);
    try {
      await Fetch.post("/dashboard", toSave);
      setIsLoading(false);
      navigate(-1)
    } catch (e) {
      setIsLoading(false);
    }
  };

  const optionsVisible = [
    {
      label: intl.formatMessage({ id: "private.placeholder" }),
      value: VISIBILITY.PRIVATE,
    },
    {
      label: intl.formatMessage({ id: "limited.placeholder" }),
      value: VISIBILITY.LIMITED,
    },
    {
      label: intl.formatMessage({ id: "public.placeholder" }),
      value: VISIBILITY.PUBLIC,
    },
  ];

  const optionsEdit = [
    {
      label: intl.formatMessage({ id: "me.edit" }),
      value: "me",
    },
    {
      label: intl.formatMessage({ id: "any.edit" }),
      value: "any",
    },
  ];

  const optionsLayout = [
    {
      label: intl.formatMessage({ id: LAYOUTS.SIMPLE }),
      value: LAYOUTS.SIMPLE,
    },
    {
      label: intl.formatMessage({ id: LAYOUTS.GROUP }),
      value: LAYOUTS.GROUP,
    },
  ];

  const optionsType = [
    {
      label: intl.formatMessage({ id: TYPE.DASHBOARD }),
      value: TYPE.DASHBOARD,
    },
    {
      label: intl.formatMessage({ id: TYPE.FOLDER }),
      value: TYPE.FOLDER,
    },
    {
      label: intl.formatMessage({ id: TYPE.URL_EXTERNAL }),
      value: TYPE.URL_EXTERNAL,
    },
  ];

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage
                id={isEdit ? "edit" : "new"}
              />
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
                    title={`${intl.formatMessage({ id: "description" })} *`}
                    iconName="text-outline"
                  />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      style={{ lineHeight: "0.5rem" }}
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "description.placeholder",
                      })}
                      onChange={(text) => onChange("description", text.target.value)}
                      value={data?.description}
                      maxLength={150}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="wifi-outline"
                    title={`${intl.formatMessage({ id: "machines" })}`}
                  />
                  <div className="mt-1"></div>
                  <SelectMachineEnterprise
                    isMulti
                    idEnterprise={enterprise?.value}
                    onChange={(value) => onChange("machines", value)}
                    value={data?.machines}
                  />
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon
                    title={<FormattedMessage id="type" />}
                    iconName={data?.typeData !== TYPE.FOLDER ? "pie-chart-outline" : "folder-outline"}
                  />
                  <Select
                    isClearable
                    className="mt-1"
                    options={optionsType}
                    menuPosition="fixed"
                    placeholder={<FormattedMessage id="type" />}
                    isDisabled={!!id}
                    onChange={(value) => onChange("typeData", value?.value)}
                    value={optionsType?.find((x) => x.value === data?.typeData)}
                  />
                </Col>
                {data?.typeData !== TYPE.FOLDER && <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon
                    title={<FormattedMessage id="folder" />}
                    iconName="folder-outline"
                  />
                  <div className="mt-1"></div>
                  <SelectFolder
                    onChange={(value) => onChange("folder", value)}
                    value={data?.folder}
                    idEnterprise={enterprise?.value}
                  />
                </Col>}
                {data?.typeData == TYPE.DASHBOARD && <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon
                    title={"Layout"}
                    iconName="layout-outline"
                  />
                  <Select
                    isClearable
                    className="mt-1"
                    options={optionsLayout}
                    menuPosition="fixed"
                    placeholder={"Layout"}
                    isDisabled={!!id}
                    onChange={(value) => onChange("typeLayout", value?.value)}
                    value={optionsLayout?.find((x) => x.value === data?.typeLayout)}
                  />
                </Col>}
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon
                    title={<FormattedMessage id="visible.placeholder" />}
                    iconName="eye-outline"
                  />
                  <Select
                    isClearable
                    className="mt-1"
                    options={optionsVisible}
                    menuPosition="fixed"
                    placeholder={intl.formatMessage({
                      id: "visible.placeholder",
                    })}
                    onChange={(value) => onChange("visible", value?.value)}
                    value={optionsVisible?.find((x) => x.value === data?.visible)}
                  />
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon
                    title={<FormattedMessage id="edit.who.placeholder.alt" />}
                    iconName="edit-2-outline"
                  />
                  <Select
                    isClearable
                    className="mt-1"
                    options={optionsEdit}
                    menuPosition="fixed"
                    placeholder={intl.formatMessage({
                      id: "edit.who.placeholder.alt",
                    })}
                    onChange={(value) => onChange("edit", value?.value)}
                    value={optionsEdit?.find((x) => x.value === data?.edit)}
                  />
                </Col>

                {data?.visible === VISIBILITY.LIMITED && (
                  <Col breakPoint={{ md: 12 }}>
                    <LabelIcon
                      title={<FormattedMessage id="users" />}
                      iconName="people-outline"
                    />
                    <SelectUsers
                      isClearable
                      isMulti
                      className="mt-1"
                      idEnterprise={enterprise?.value}
                      onChange={(value) => onChange("users", value)}
                      value={data?.users}
                    />
                  </Col>
                )}

                {data?.typeData == TYPE.URL_EXTERNAL && (
                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <LabelIcon
                      title={intl.formatMessage({ id: "url.external" })}
                      iconName="link-2-outline"
                    />
                    <InputGroup fullWidth>
                      <input
                        style={{ lineHeight: "0.5rem" }}
                        type="text"
                        placeholder={intl.formatMessage({ id: "url.external" })}
                        onChange={(text) => onChange("urlExternal", text.target.value)}
                        value={data?.urlExternal}
                      />
                    </InputGroup>
                  </Col>
                )}
              </Row>
            </CardBody>
            <CardFooter>
              <Row between={isEdit && "xs"} end={!isEdit && "xs"} className="pr-2 pl-2">
                {isEdit && <DeleteDashboard id={id} />}
                <Button size="Small" onClick={onSave} disabled={isLoading}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default AddDashboard;
