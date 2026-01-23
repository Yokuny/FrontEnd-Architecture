import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  CardFooter,
  CardHeader,
} from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  DeleteConfirmation,
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import FieldsFence from "./FieldsFence";
import MapContentFence from "./MapContentFence";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const AddGeofence = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [dataInitial, setDataInitial] = React.useState();
  const [color, setColor] = React.useState("#3366FF");
  const [fenceReference, setFenceReference] = React.useState();

  const [isLoading, setIsLoading] = React.useState(false);

  const idGeofence = new URL(window.location.href).searchParams.get("id");

  const data = React.useRef({
    color: "#3366FF",
  });

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (idGeofence) {
      setIsLoading(true);
      Fetch.get(`/geofence/find?id=${idGeofence}`)
        .then((response) => {
          const enterprise = response.data?.enterprise;

          data.current = {
            ...response.data,
            enterprise: {
              value: enterprise?.id,
              label: `${enterprise?.name} - ${enterprise?.city} ${enterprise?.state}`,
            },
            fenceReference: response.data?.fenceReference && {
              value: response.data?.fenceReference?.id,
              label: ` ${response.data?.fenceReference?.description}`,
              location: response.data?.fenceReference?.location,
              color: ` ${response.data?.fenceReference?.color}`,
            },
            finalizeTravel: !!response.data?.finalizeTravel,
            initializeTravel: !!response.data?.initializeTravel,
            nearestPort: !!response.data?.nearestPort,
          };
          if (data.current.fenceReference) {
            setFenceReference(data.current.fenceReference);
          }
          setColor(data.current.color);

          setDataInitial(data.current);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onChangeRef = (prop, value) => {
    data.current = {
      ...data.current,
      [prop]: value,
    };
    if (prop === "color") {
      setColor(value);
    } else if (prop === "fenceReference") {
      setFenceReference(value);
    }
  };

  const onSave = () => {
    if (!data.current?.enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!data.current?.type?.value) {
      toast.warn(intl.formatMessage({ id: "type.required" }));
      return;
    }

    if (!data.current?.code) {
      toast.warn(intl.formatMessage({ id: "code.required" }));
      return;
    }

    if (!data.current?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (
      !data.current?.location ||
      (data.current?.location?.type === "Polygon" &&
        !data.current?.location?.coordinates?.length) ||
      (data.current?.location?.type === "Feature" &&
        !data.current.location?.geometry?.coordinates?.length)
    ) {
      toast.warn(intl.formatMessage({ id: "coordinates.required" }));
      return;
    }

    setIsLoading(true);
    const dataToSave = {
      id: idGeofence,
      idEnterprise: data.current?.enterprise?.value,
      idFence: fenceReference?.value || null,
      type: data.current.type,
      code: data.current?.code,
      description: data.current?.description,
      city: data.current?.city,
      state: data.current?.state,
      country: data.current?.country,
      link: data.current?.link,
      finalizeTravel: !!data.current?.finalizeTravel,
      initializeTravel: !!data.current?.initializeTravel,
      nearestPort: !!data.current?.nearestPort,
      color: data.current?.color,
      location: data.current?.location,
      timezone: data.current?.timezone,
    };
    Fetch.post(`/geofence`, dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/geofence?id=${idGeofence}`)
      .then((r) => {
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
          <TextSpan apparence="s1">
            <FormattedMessage
              id={idGeofence ? "edit.geofence" : "add.geofence"}
            />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ md: 4 }}>
              <FieldsFence
                dataInitial={dataInitial}
                onChangeRef={onChangeRef}
                idGeofence={idGeofence}
              />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <MapContentFence
                color={color}
                fenceReference={fenceReference}
                onChangeRef={onChangeRef}
                dataInitial={dataInitial}
              />
            </Col>
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Row
            between={idGeofence ? "xs" : ""}
            end={idGeofence ? "" : "xs"}
            className="ml-1 mr-1"
          >
            {!!idGeofence ? (
              <DeleteConfirmation
                onConfirmation={onDelete}
                message={intl.formatMessage({ id: "delete.message.default" })}
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

export default AddGeofence;
