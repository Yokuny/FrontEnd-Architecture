import { Button, Card, CardBody, CardFooter, CardHeader, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import CMMSCharts from "./CMMSCharts";
import { useEffect, useRef, useState } from "react";
import ImageMarker from "react-image-marker";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Marker } from "./Marker";
import { Fetch, LabelIcon, TextSpan, UploadImage } from "../../components";
import { SelectForm } from "../../components/Select";
import LastUpdate from "./LastUpdate";
import ModalDashboardDefault from "../dashboard/panel-default/ModalDashboard";
import { SkeletonThemed } from "../../components/Skeleton";

const ColStyled = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2rem;
`

function DiagramDetails(props) {
  const [cmmsData, setCmmsData] = useState(null);
  const [cmmsLoading, setCmmsLoading] = useState(false);
  const [osExpired, setOsExpired] = useState(null);
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [image, setImage] = useState(null);
  const [isPointEdit, setIsPointEdit] = useState(false);
  const [isPointMove, setIsPointMove] = useState(false);
  const [pointToMove, setPointToMove] = useState(null);
  const [dataModal, setDataModal] = useState(null);
  const [diagramDescription, setDiagramDescription] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  const lastDateRef = useRef(null);

  const intl = useIntl();
  const navigate = useNavigate();

  const containerImageRef = useRef(null);

  const diagramId = new URL(window.location.href).searchParams.get("id");

  useEffect(() => {
    getData();
    setIsPointEdit(!diagramId);
    const interval = setInterval(() => {
      if (markers?.length) {
        getSensors(markers);
        getEquipmentsStatus(markers);
      }
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!markers?.length || !osExpired) return;

    const needsUpdate = markers.some(marker =>
      marker.type === "maintenance" &&
      osExpired.some(os =>
        !os.dataConclusao &&
        os.embarcacao === marker.machine &&
        os.equipamento === marker.equipment &&
        marker.state !== "danger"
      )
    );

    if (!needsUpdate) return;

    const newMarkers = markers.map(marker => {
      if (marker.type === "maintenance") {
        const hasOpenDeviation = osExpired.some(os =>
          !os.dataConclusao &&
          os.embarcacao === marker.machine &&
          os.equipamento === marker.equipment
        );

        if (hasOpenDeviation && marker.state !== "danger") {
          return { ...marker, state: "danger" };
        }
      }
      return marker;
    });

    setMarkers(newMarkers);
  }, [osExpired, markers]);


  const getMousePosition = (e) => {
    if (!containerImageRef.current) return { xPercent: 0, yPercent: 0 };
    const rect = containerImageRef.current?.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const xPercent = x * 100;
    const yPercent = y * 100;

    return { xPercent, yPercent };
  };

  const handleMouseDown = (e) => {
    if (isPointEdit) {
      const { xPercent, yPercent } = getMousePosition(e);

      const point = findClosestMarker(xPercent, yPercent);

      if (point) {
        setPointToMove(point);
        setIsPointMove(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (isPointMove) {
      setIsPointMove(false);
      setPointToMove(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isPointMove || !pointToMove) return;

    const { xPercent, yPercent } = getMousePosition(e);

    if (isPointMove) {
      handleChange({
        ...pointToMove,
        left: xPercent,
        top: yPercent,
      });
    }
  };

  const findClosestMarker = (x, y) => {
    const closestMarker = markers.reduce((closest, marker) => {
      const distance = Math.sqrt(Math.pow(marker.left - x + 2, 2) + Math.pow(marker.top - y + 2, 2));

      if (!closest || distance < closest.distance) {
        if (marker.type === "label" && distance < 3) {
          return { ...marker, distance };
        } else if (distance < 1.5) {
          return { ...marker, distance };
        }
      }

      return closest;
    }, null);

    return closestMarker;
  };

  const handleChange = (marker) => {
    setMarkers((prev) => prev.map((m) => (m.id === marker.id ? marker : m)));
  };

  const handleClear = () => {
    setImage(null);
  };

  const handleRemove = (id) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
  };

  const getData = () => {
    if (!diagramId) return;
    setIsLoading(true);
    Fetch.get(`/machine/plant?id=${diagramId}&idEnterprise=${localStorage.getItem("id_enterprise_filter")}`)
      .then((response) => {
        if (response.data.data) {
          setMarkers(response.data?.data);
          getSensors(response.data?.data);
          getEquipmentsStatus(response.data?.data);
          setIsEdit(true);
          setData(response.data);
          setImage(response.data?.image);
          setDiagramDescription(response.data?.description);
          setSelectedForm(
            response.data?.form ? { value: response.data.form.id, label: response.data.form.description } : null
          );
        }
      })
      .catch((error) => { })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSave = () => {
    setIsLoading(true);
    uploadImage((image) => {
      if (isEdit) {
        Fetch.put(`/machine/plant/${data.id}`, {
          idEnterprise: localStorage.getItem("id_enterprise_filter"),
          description: diagramDescription,
          data: markers,
          image: image,
          form: selectedForm?.value || null,
        }).then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));

          setIsPointEdit(false);
          setIsLoading(false);

          getData();
          navigate(`/diagram-list`);
        });
      } else {
        Fetch.post("/machine/plant", {
          idEnterprise: localStorage.getItem("id_enterprise_filter"),
          description: diagramDescription,
          data: markers,
          image: image,
          form: selectedForm?.value || null,
        }).then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));

          setIsPointEdit(false);
          setIsLoading(false);
          setIsEdit(true);

          getData();
          navigate(`/diagram-list`);
        });
      }
    });
  };

  const uploadImage = (cb) => {
    if (image?.new) {
      const formData = new FormData();
      formData.append("file", image.data);

      Fetch.post("/upload", formData).then((response) => {
        setImage(response.data);
        cb(response.data);
      });
    } else {
      cb(image);
    }
  };

  const getEquipmentsStatus = (markers) => {
    const equipments = markers.filter((marker) => marker.type === "maintenance");

    if (equipments.length === 0) {
      return;
    }

    // Criar array de objetos com machineId e equipment para enviar na requisição
    const equipmentData = equipments.map((marker) => ({
      machineId: marker.machine,
      equipment: marker.equipment,
    }));

    // Construir query string com pares machineId-equipment
    const queryParams = equipmentData
      .map(
        (item) =>
          `equipments[]=${encodeURIComponent(
            JSON.stringify({
              machineId: item.machineId,
              equipment: item.equipment,
            })
          )}`
      )
      .join("&");

    Fetch.get(`/formdata/cmms/equipmentstatus?${queryParams}`)
      .then((response) => {
        const newMarkers = markers.map((marker) => {
          if (marker.type === "maintenance") {
            const equipmentData = response.data.find(
              (equipment) => equipment.machineId === marker.machine && equipment.equipment === marker.equipment
            );

            return {
              ...marker,
              state: equipmentData ? equipmentData.status : "success",
            };
          }
          return marker;
        });
        setMarkers(newMarkers);
      })
      .catch((error) => { });
  };

  const getSensors = (markers) => {
    const sensors = markers.map((marker) => `idMachines[]=${marker.machine}&sensors[]=${marker.sensor}`);

    Fetch.get(`/sensorstate/last/machines/sensors?${sensors.join("&")}`).then((response) => {
      const newMarkers = markers.map((marker) => {
        const sensorData = response.data.find(
          (sensor) => sensor.idMachine === marker.machine && sensor.idSensor === marker.sensor
        );
        lastDateRef.current = sensorData?.date;
        return {
          ...marker,
          state: sensorData ? sensorData.value : null,
        };
      });

      setMarkers(newMarkers);
    });
  };

  const handleChangeImage = (file) => {
    setImage({
      url: URL.createObjectURL(file),
      data: file,
      new: true,
    });
  };

  const fetchCmmsData = (formId, machines) => {
    if (!formId || !machines?.length) return;

    const filter = [];
    filter.push(`idMachines=${machines.join(",")}`);

    setCmmsLoading(true);
    Fetch.get(`/formdata/data/${formId}?fieldDate=dataAbertura&isNotDeletedDate=true&${filter.join("&")}`).then((response) => {
      const processedData = (response.data || []).map(x => ({
        ...x,
        tipoManutencao: x.tipoManutencao || intl.formatMessage({ id: "undefined" }),
      }));

      setCmmsData(processedData);
    }).finally(() => {
      setCmmsLoading(false);
    });
  };

  useEffect(() => {
    if (!cmmsData) {
      setOsExpired(null);
      return;
    }

    const newExpiredData = cmmsData.filter(x =>
      x.manutencaoVencida === "Sim" ||
      x.tipoManutencao === intl.formatMessage({ id: "corrective_from_predictive" })
    );

    const currentExpiredIds = osExpired?.map(os => os.id).sort().join(',') || '';
    const newExpiredIds = newExpiredData.map(os => os.id).sort().join(',');

    if (currentExpiredIds !== newExpiredIds) {
      setOsExpired(newExpiredData);
    }
  }, [cmmsData]);

  const hasMaintenanceMarkers = markers.some((marker) => marker.type === "maintenance");
  const showCMMSCharts = hasMaintenanceMarkers && (data?.form?.typeForm === "CMMS" || data?.form?.description === "CMMS");
  const hasPermissionAdd = props.items?.some((x) => x === "/diagram-add");

  useEffect(() => {
    if (showCMMSCharts && data?.form?.id) {
      const maintenanceMachines = [...new Set(markers.filter((m) => m.type === "maintenance").map((marker) => marker.machine))]?.filter((m) => m);
      fetchCmmsData(data?.form?.id, maintenanceMachines);
    }
  }, [data?.form?.id, showCMMSCharts]);

  return (
    <>
      <Card>
        <CardHeader>
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              {isPointEdit ? (
                <>
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
                      onChange={
                        (text) => setDiagramDescription(text.target.value)
                        //onChange("description", text.target.value)
                      }
                      value={diagramDescription}
                      maxLength={150}
                    />
                  </InputGroup>

                  <LabelIcon
                    className="mt-2"
                    iconName="file-text-outline"
                    title={
                      <>
                        <FormattedMessage id="form" />
                      </>
                    }
                  />
                  <SelectForm
                    className="mt-1"
                    placeholder="form"
                    onChange={(value) => setSelectedForm(value)}
                    value={selectedForm}
                    idEnterprise={localStorage.getItem("id_enterprise_filter")}
                    isClearable={true}
                  />
                </>
              ) :
                showCMMSCharts
                  ? <>
                    <ColStyled>
                      <TextSpan apparence="s1">
                        <FormattedMessage id="panel.confiability" /> - {data?.description}
                      </TextSpan>
                      <TextSpan apparence="p2" hint>
                        CBM - Condition Based Maintenance
                      </TextSpan>
                    </ColStyled>
                  </>
                  : <TextSpan apparence="s1">
                    {data.description}
                  </TextSpan>}
            </Col>
          </Row>
        </CardHeader>
        <CardBody style={{ padding: "0.2rem" }}>
          {showCMMSCharts && data?.form?.id && (
            <CMMSCharts
              cmmsData={cmmsData}
              loading={cmmsLoading}
            />
          )}
          <>
            {isLoading ? (
              <Row className="m-0 p-4">
                <SkeletonThemed height={450} />
              </Row>
            ) : (
              <>
                {!image?.url ? (
                  <UploadImage onAddFile={handleChangeImage} />
                ) : (
                  <div
                    ref={containerImageRef}
                    className="relative"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}>
                    <ImageMarker
                      src={image.url}
                      markers={markers}
                      onAddMarker={(marker) =>
                        isPointEdit ? setMarkers([...markers, { ...marker, type: "on-off", id: nanoid(3) }]) : null
                      }
                      markerComponent={(marker) => (
                        <Marker
                          isEditing={isPointEdit}
                          marker={marker}
                          onChange={handleChange}
                          onRemove={handleRemove}
                          handleClick={() =>
                            setDataModal({
                              id: "5528c60f-713b-400c-ad4f-c80c793a5ee7",
                              idMachine: marker.machine,
                              idSensors: [marker.sensor],
                            })
                          }
                        />
                      )}
                    />
                    {lastDateRef.current && <LastUpdate date={lastDateRef.current} />}
                  </div>
                )}
              </>
            )}
          </>
        </CardBody>
        {hasPermissionAdd && !isLoading && (
          <CardFooter>
            <Row className="m-0" between={isPointEdit ? "xs" : ""} end={!isPointEdit ? "xs" : ""}>
              {!!image?.url && isPointEdit && (
                <Button
                  appearance="ghost"
                  size="Tiny"
                  status="Danger"
                  className="flex-between"
                  onClick={handleClear}
                  disabled={!image}>
                  <EvaIcon name="trash-2-outline" className="mr-1" />
                  <FormattedMessage id="remove.image" />
                </Button>
              )}
              <Row className="m-0">
                {!isPointEdit ? (
                  <Button
                    size="Tiny"
                    status="Basic"
                    onClick={() => setIsPointEdit(true)}
                    className="flex-between"
                    appearance="ghost">
                    <EvaIcon name="edit-2-outline" className="mr-1" />
                    <FormattedMessage id="edit" />
                  </Button>
                ) : (
                  <Button
                    appearance="ghost"
                    size="Tiny"
                    status="Basic"
                    onClick={() => setIsPointEdit(false)}
                    className="mr-2 flex-between">
                    <EvaIcon name="close-outline" className="mr-1" />
                    <FormattedMessage id="cancel" />
                  </Button>
                )}
                {isPointEdit && (
                  <Button
                    size="Small"
                    status="Primary"
                    className="ml-2"
                    disabled={!markers.length}
                    onClick={handleSave}>
                    <FormattedMessage id="save" />
                  </Button>
                )}
              </Row>
            </Row>
          </CardFooter>
        )}
      </Card >
      {dataModal && (
        <ModalDashboardDefault
          filterModal={dataModal}
          onClose={() => setDataModal(null)}
          enterprises={data?.enterprises}
        />
      )
      }
    </>
  );
}
const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(DiagramDetails);
