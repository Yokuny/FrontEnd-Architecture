import React from "react";
import { Fetch, SpinnerFull, DeleteConfirmation } from "../../../components";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import styled from "styled-components";
import { verifyIDInvalid } from "../../../components/Utils";
import { connect } from "react-redux";
import AddMachine from "./add";
import { useNavigate } from "react-router-dom";
import { MachineAddModal } from "./MachineAddModal";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  .tab-content {
    padding: 0px;
  }
`;

const MachineAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [data, setData] = React.useState();
  const [showIncludeModal, setShowIncludeModal] = React.useState(false);

  const [image, setImage] = React.useState(undefined);
  const [imagePreview, setImagePreview] = React.useState(undefined);

  React.useEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    const idEdit = new URL(window.location.href).searchParams.get("id");
    if (!!idEdit) {
      getEditEntity(idEdit);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    Fetch.get(`/machine/find?_id=${id}`)
      .then((response) => {
        if (response.data) {
          setEnterprise({
            value: response.data?.enterprise?.id,
            label: response.data?.enterprise?.name,
          });
          setData({
            _id: id,
            id: response.data.id,
            name: response.data.name,
            code: response.data.code,
            mmsi: response.data.mmsi,
            imo: response.data.imo,
            sensors:
              response.data?.sensors?.map((x) => ({
                value: x.sensorId,
                label: x.sensor,
                id: x.sensorKey,
              })) || [],
            parts:
              response.data?.partsMachine?.map((x) => ({
                value: x.id,
                label: `${x.name} (${x.sku})`,
              })) || [],
            maintenancePlans:
              response.data?.maintenancesPlan?.map((x) => ({
                value: x.id,
                label: x.description,
              })) || [],
            modelMachine: response.data?.modelMachine
              ? {
                  value: response.data?.modelMachine.id,
                  label: response.data?.modelMachine.description,
                  typeMachine: response.data?.modelMachine.typeMachine,
                }
              : null,
            dataSheet: response.data.dataSheet,
            contacts: response.data.contacts,
            cameras: !response.data.cameras?.length
              ? [{ name: "", link: "" }]
              : response.data.cameras,
            inactiveAt: response.data.inactiveAt,
            fleet: response.data.idFleet,
          });
          setImage(response.data?.image);
          setIsEdit(true);
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
  };

  const onChangeDetails = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      dataSheet: {
        ...(prevState.dataSheet || {}),
        [prop]: value,
      },
    }));
  };

  const onChangeItemContacts = (i, prop, value) => {
    setData((prevState) => {
      const contact = prevState.contacts[i];
      contact[prop] = value;
      return {
        ...prevState,
        contacts: [
          ...prevState.contacts?.slice(0, i),
          contact,
          ...prevState.contacts?.slice(i + 1),
        ],
      };
    });
  };

  const saveImageAsync = async () => {
    try {
      const formToSave = new FormData();
      formToSave.append("file", image);
      await Fetch.post(
        `/upload/machine?id=${data.id}`,
        formToSave
      );
    } catch (e) {}
  };

  const onSave = async () => {
    if (!data?.id) {
      toast.warn(intl.formatMessage({ id: "machine.id.required" }));
      return;
    }

    if (verifyIDInvalid(data.id)) {
      toast.warn(intl.formatMessage({ id: "machine.id.invalid" }));
      return;
    }

    if (!data.name) {
      toast.warn(intl.formatMessage({ id: "machine.name.required" }));
      return;
    }

    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "machine.idEnterprise.required" }));
      return;
    }

    const machineSave = {
      id: data.id,
      idEnterprise: enterprise.value,
      name: data.name,
      sensors:
        data.sensors?.map((x) => {
          return {
            sensorId: x.value,
            sensor: x.label,
            sensorKey: x.id,
          };
        }) || [],
      parts: data.parts?.map((x) => x.value),
      maintenancePlans: data.maintenancePlans?.map((x) => x.value),
      idModel: data.modelMachine?.value,
      code: data.code,
      mmsi: data.mmsi,
      imo: data.imo,
      dataSheet: data.dataSheet,
      contacts: data.contacts,
      cameras: data.cameras,
      idFleet: data.fleet,
    };

    setIsLoading(true);
    try {
      if (isEdit) {
        machineSave._id = data._id;
        await Fetch.put("/machine", machineSave);
      } else {
        await Fetch.post("/machine", machineSave);
      }
    } catch (e) {
      setIsLoading(false);
      return;
    }

    if (!!imagePreview) await saveImageAsync();

    toast.success(intl.formatMessage({ id: "save.successfull" }));
    setIsLoading(false);
    navigate(-1);
  };

  const onChangeItemCameras = (index, prop, value) => {
    const cameras = data?.cameras || [];
    cameras[index][prop] = value;
    setData((prevState) => ({
      ...prevState,
      cameras: cameras,
    }));
  };

  const isShowDeactive =
    isEdit &&
    props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === enterprise?.value &&
        x.paths?.includes("/machine-deactive")
    );

  const handleAcitive = () => {
    setIsLoading(true);
    if (!data.inactiveAt) {
      Fetch.patch(`/machine/deactive?id=${data?.id}`)
        .then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          setIsLoading(false);
          navigate(-1);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    } else {
      Fetch.patch(`/machine/active?id=${data?.id}`)
        .then((response) => {
          toast.success(intl.formatMessage({ id: "active.successfull" }));
          setIsLoading(false);
          navigate(-1);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const handleIncludeModal = () => {
    setShowIncludeModal(!showIncludeModal);
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Row between="md" className="pl-4 pr-4">
                <FormattedMessage
                  id={isEdit ? "machine.edit" : "machine.new"}
                />

                {data?.inactiveAt && (
                  <Button
                    disabled
                    appearance="outline"
                    status="Basic"
                    size="Tiny"
                  >
                    <FormattedMessage id="deactivate" />
                  </Button>
                )}
              </Row>
            </CardHeader>
            <AddMachine
              itemsByEnterprise={props.itemsByEnterprise}
              enterprise={enterprise}
              data={data}
              onChange={onChange}
              onChangeDetails={onChangeDetails}
              onChangeItemContacts={onChangeItemContacts}
              setEnterprise={setEnterprise}
              isEdit={isEdit}
              setImagePreview={setImagePreview}
              imagePreview={imagePreview}
              setImage={setImage}
              image={image}
              onChangeItemCameras={onChangeItemCameras}
              disabled={data?.inactiveAt}
            />

            <CardFooter>
              <Row style={{ margin: 0 }} between="xs">
                {!isEdit &&
                !isLoading &&
                !!enterprise?.value ? (
                  <Button
                    size="Small"
                    status="Primary"
                    appearance="outline"
                    onClick={handleIncludeModal}
                  >
                    <FormattedMessage id="include.vessel" />
                  </Button>
                ) : isShowDeactive ? <></> : (<div></div>)}
                {isShowDeactive && (
                  <DeleteConfirmation
                    message={intl.formatMessage({
                      id: !data?.inactiveAt
                        ? "confirm.deactive.machine"
                        : "confirm.active.machine",
                    })}
                    buttonActionMessage={
                      !data?.inactiveAt ? "deactive" : "enable"
                    }
                    onConfirmation={() => handleAcitive()}
                  />
                )}
                <Button
                  disabled={data?.inactiveAt}
                  size="Small"
                  onClick={onSave}
                >
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <MachineAddModal
        handleModal={handleIncludeModal}
        showModal={showIncludeModal}
        idEnterprise={enterprise?.value}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(MachineAdd);
