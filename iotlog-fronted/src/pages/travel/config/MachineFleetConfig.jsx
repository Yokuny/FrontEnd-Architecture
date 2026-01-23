import React from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fetch, MachineHeader, SpinnerFull } from "../../../components";
import FleetConfig from "./FleetConfig";
// import FleetDetailsConsumeConfig from "./FleetDetailsConsumeConfig";


const MachineFleetConfig = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const [searchParams] = useSearchParams();

  const idMachine = searchParams.get("id");
  const idEnterprise = searchParams.get("idEnterprise");

  React.useLayoutEffect(() => {
    onGetData();
  }, []);

  const onGetData = () => {
    if (idMachine) {
      setIsLoading(true);
      Fetch.get(`/travelconfig/find?idMachine=${idMachine}&idEnterprise=${idEnterprise}`)
        .then((response) => {
          if (response.data) {
            setData(response.data);
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onChangeFleet = (prop, value) => {
    setData({
      ...data,
      fleet: {
        ...(data?.fleet || {}),
        [prop]: value,
      },
    });
  };

  const onSave = () => {
    if (!idMachine) {
      toast.warn(intl.formatMessage({ id: "machine.required" }));
      return;
    }

    setIsLoading(true);

    const dataToSave = {
      idMachine,
      idEnterprise,
    };

    if (data?.fleet) {
      dataToSave.fleet = {
        idSensorCoordinate: data?.fleet?.sensorCoordinate?.value,
        sensorCoordinate: data?.fleet?.sensorCoordinate,
        idSensorCourse: data?.fleet?.sensorCourse?.value,
        sensorCourse: data?.fleet?.sensorCourse,
        idSensorETA: data?.fleet?.sensorETA?.value,
        sensorETA: data?.fleet?.sensorETA,
        idSensorDestiny: data?.fleet?.sensorDestiny?.value,
        sensorDestiny: data?.fleet?.sensorDestiny,
        idSensorSpeed: data?.fleet?.sensorSpeed?.value,
        unitySpeed: data?.fleet?.unitySpeed,
        sensorSpeed: data?.fleet?.sensorSpeed,
        idSensorDraught: data?.fleet?.sensorDraught?.value,
        sensorDraught: data?.fleet?.sensorDraught,
        idSensorStatusNavigation: data?.fleet?.sensorStatusNavigation?.value,
        sensorStatusNavigation: data?.fleet?.sensorStatusNavigation,
        idSensorConsume: data?.fleet?.sensorConsume?.value,
        sensorConsume: data?.fleet?.sensorConsume,
        idSensorDP: data?.fleet?.sensorDP?.value,
        sensorDP: data?.fleet?.sensorDP,
        isShow: !!data?.fleet?.isShow,
        isProcessStatus: !!data?.fleet?.isProcessStatus,
        notShowPublicFleet: !!data?.fleet?.notShowPublicFleet
      };
    }

    Fetch.post("/travelconfig", dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <MachineHeader idMachine={idMachine} />
        </CardHeader>
        <CardBody>
          <FleetConfig
            idMachine={idMachine}
            onChangeFleet={onChangeFleet}
            fleet={data?.fleet}
          />
          {/* <FleetDetailsConsumeConfig
            idMachine={idMachine}
          /> */}
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
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

export default MachineFleetConfig;
