import React from "react";
import styled from "styled-components";
import Col from "@paljs/ui/Col";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import { SpinnerFull, TextSpan, UserImage } from "../../../components";
import Fetch from "../../../components/Fetch/Fetch";
import { FormattedMessage, injectIntl } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button, Checkbox, InputGroup, Select } from "@paljs/ui";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const MachineControlIntegration = (props) => {
  const idMachine = new URL(window.location.href).searchParams.get("id");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const timeInSeconds = [
    {
      label: `30 ${props.intl.formatMessage({ id: "seconds" })}`,
      value: 30,
    },
    {
      label: `1 ${props.intl.formatMessage({ id: "minute" })}`,
      value: 60,
    },
    {
      label: `5 ${props.intl.formatMessage({ id: "minutes" })}`,
      value: 300,
    },
    {
      label: `10 ${props.intl.formatMessage({ id: "minutes" })}`,
      value: 600,
    },
    {
      label: `30 ${props.intl.formatMessage({ id: "minutes" })}`,
      value: 1800,
    },
  ];

  React.useLayoutEffect(() => {
    getMachineDetails();
  }, []);

  const typeIntegration =[
    {
      label: `API`,
      value: "API",
    },
    {
      label: `Middleware`,
      value: "MIDDLEWARE",
    },
  ];

  const getMachineDetails = () => {
    setIsLoading(true);
    Fetch.get(`/machine/find?id=${idMachine}`)
      .then((response) => {
        if (response?.data) {
          setData(response.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = () => {
    setIsLoading(true);
    const machineSave = {
      id: idMachine,
      locked: data.locked,
      intervalSaveHistory: data.intervalSaveHistory || null,
      typeIntegration: data.typeIntegration || null,
      timeLostConnection: data?.timeLostConnection
        ? parseInt(data.timeLostConnection)
        : 0,
      useDateServer: !!data.useDateServer,
    };

    Fetch.put("/machine", machineSave)
      .then((response) => {
        toast.success(props.intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  return (
    <>
      <ContainerRow>
        <Col>
          <Card>
            <CardHeader>
              <UserImage
                size="Large"
                image={data?.image?.url}
                title={data?.enterprise?.name}
                name={data?.name}
              />
            </CardHeader>
            <CardBody>
              <Row middle>
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="s2">
                    {props.intl.formatMessage({ id: "time.to.save.history" })}
                  </TextSpan>
                  <Select
                    className="mt-1"
                    options={timeInSeconds}
                    menuPosition="fixed"
                    isClearable
                    value={timeInSeconds?.find(
                      (x) => x.value == data?.intervalSaveHistory
                    )}
                    onChange={(value) =>
                      onChange("intervalSaveHistory", value?.value)
                    }
                    noOptionsMessage={() =>
                      props.intl.formatMessage({
                        id: "nooptions.message",
                      })
                    }
                    placeholder={props.intl.formatMessage({
                      id: "time.to.save.history",
                    })}
                  />
                </Col>
                <Col breakPoint={{ md: 6 }} className="pt-4 mb-4">
                  <Checkbox
                    checked={data?.locked}
                    onChange={(e) => onChange("locked", !data?.locked)}
                  >
                    <TextSpan apparence="s2">
                      <FormattedMessage id="locked.integration" />
                    </TextSpan>
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="time.sec.lost.connection" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      value={data?.timeLostConnection}
                      onChange={(e) =>
                        onChange(
                          "timeLostConnection",
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                      type="number"
                      placeholder={props.intl.formatMessage({
                        id: "time.sec.lost.connection",
                      })}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 6 }} className="pt-4 mb-4">
                  <Checkbox
                    className="mt-4"
                    checked={data?.useDateServer}
                    onChange={(e) =>
                      onChange("useDateServer", !data?.useDateServer)
                    }
                  >
                    <TextSpan apparence="s2">
                      <FormattedMessage id="use.date.server" />
                    </TextSpan>
                  </Checkbox>
                </Col>
                <Col breakPoint={{ md: 6 }} className="pt-4">
                  <TextSpan apparence="s2">
                    {props.intl.formatMessage({ id: "type.integration" })}
                  </TextSpan>
                  <Select
                    className="mt-1"
                    options={typeIntegration}
                    menuPosition="fixed"
                    isClearable
                    value={typeIntegration?.find(
                      (x) => x.value == data?.typeIntegration
                    )}
                    onChange={(value) =>
                      onChange("typeIntegration", value?.value)
                    }
                    noOptionsMessage={() =>
                      props.intl.formatMessage({
                        id: "nooptions.message",
                      })
                    }
                    placeholder={props.intl.formatMessage({
                      id: "type.integration",
                    })}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button size="Small" onClick={onSave}>
                <FormattedMessage id="save" />
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(MachineControlIntegration);
