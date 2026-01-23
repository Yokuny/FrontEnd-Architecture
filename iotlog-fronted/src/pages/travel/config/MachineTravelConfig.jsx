import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  InputGroup,
  Row,
} from "@paljs/ui";
import { Tabs, Tab } from "@paljs/ui/Tabs";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormulaCodeTravel from "./FormulaCodeTravel";
import {
  Fetch,
  LabelIcon,
  MachineHeader,
  SpinnerFull,
  TextSpan,
  Toggle,
} from "../../../components";
import { SelectForm, SelectSensorByMachine } from "../../../components/Select";
import ListStatistic from "./ListStatistic";
import { convertFormTOSelect } from "../../../components/Select/SelectForm";

const ContainerRow = styled(Row)`
  width: 100%;

  input {
    line-height: 0.5rem;
  }
`;

const MachineTravelConfig = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const [searchParams] = useSearchParams();

  const idMachine = searchParams.get("id");
  const idEnterprise = searchParams.get("idEnterprise");

  React.useEffect(() => {
    onGetData(idMachine);
  }, [idMachine]);

  const onGetData = (idMachine) => {
    if (idMachine) {
      setIsLoading(true);
      Fetch.get(`/travelconfig/find?idMachine=${idMachine}&idEnterprise=${idEnterprise}`)
        .then((response) => {
          if (response.data) {
            setData({
              ...response.data,
              formsInPort: response.data?.formsInPort?.map((x) =>
                convertFormTOSelect(x)
              ) || [],
              formsInVoyage: response.data?.formsInVoyage?.map((x) =>
                convertFormTOSelect(x)
              ) || [],
            });
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onChangeItemStatistic = (index, prop, value) => {
    let statisticUpdate = data.statistics[index];

    statisticUpdate[prop] = value;

    setData({
      ...data,
      statistics: [
        ...data.statistics.slice(0, index),
        statisticUpdate,
        ...data.statistics.slice(index + 1),
      ],
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
      sensor: data.sensor,
      sensorId: data.sensor?.value || null,
      abbreviation: data.abbreviation,
      statistics: data?.statistics,
      formula: data?.formula,
      isProcessTravel: !!data?.isProcessTravel,
      formsInPort: data?.formsInPort?.map((x) => x.value),
      formsInVoyage: data?.formsInVoyage?.map((x) => x.value),
    };

    Fetch.post("/travelconfig", dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
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
          <MachineHeader idMachine={idMachine} />
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <ContainerRow>
            <Tabs fullWidth style={{ width: "100%" }}>
              <Tab
                icon="settings-2-outline"
                title={intl.formatMessage({ id: "setup" })}
              >
                <Row>
                  <Col breakPoint={{ md: 5 }} className="mb-4">
                    <LabelIcon
                      iconName="flash-outline"
                      title={<FormattedMessage id="setup.sensor.geolocation" />}
                    />
                    <div className="mt-1"></div>
                    <SelectSensorByMachine
                      idMachine={idMachine}
                      value={data?.sensor}
                      onChange={(valueSensor) =>
                        onChange("sensor", valueSensor)
                      }
                    />
                  </Col>
                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <LabelIcon
                      iconName="text-outline"
                      title={<FormattedMessage id="abbreviation.code.travel" />}
                    />
                    <InputGroup fullWidth className="mt-1">
                      <input
                        value={data?.abbreviation}
                        onChange={(e) =>
                          onChange("abbreviation", e.target.value)
                        }
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "abbreviation.code.travel",
                        })}
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 3 }} className="mb-4">
                    <LabelIcon
                      iconName="toggle-right-outline"
                      title={<FormattedMessage id="on.proccess.travel" />}
                    />
                    <Row between="xs" middle="xs" style={{ margin: 0 }} className="pt-1">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="process.travel" />
                      </TextSpan>
                      <Toggle
                        checked={!!data?.isProcessTravel}
                        onChange={() =>
                          onChange("isProcessTravel", !data?.isProcessTravel)
                        }
                      />
                    </Row>
                  </Col>

                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <FormulaCodeTravel
                      value={data?.formula}
                      onChange={(e) => onChange("formula", e.target.value)}
                    />
                  </Col>

                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <LabelIcon
                      iconName="file-text-outline"
                      title={<FormattedMessage id="forms.in.port" />}
                    />
                    <SelectForm
                      className="mt-1"
                      isMulti
                      placeholder="forms.in.port"
                      onChange={(value) => onChange("formsInPort", value)}
                      value={data?.formsInPort}
                      idEnterprise={idEnterprise}
                    />
                  </Col>

                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <LabelIcon
                      iconName="file-text-outline"
                      title={<FormattedMessage id="forms.in.voyage" />}
                    />
                    <SelectForm
                      className="mt-1"
                      isMulti
                      placeholder="forms.in.voyage"
                      onChange={(value) => onChange("formsInVoyage", value)}
                      value={data?.formsInVoyage}
                      idEnterprise={idEnterprise}
                    />
                  </Col>
                </Row>
              </Tab>
              <Tab
                icon="trending-up-outline"
                title={intl.formatMessage({ id: "statistic" })}
              >
                <ListStatistic
                  statistics={data?.statistics}
                  onChangeItem={onChangeItemStatistic}
                  onChange={onChange}
                  idMachine={idMachine}
                />
              </Tab>
            </Tabs>
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Row end="xs" className="ml-1 mr-1">
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

export default MachineTravelConfig;
