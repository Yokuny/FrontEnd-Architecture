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
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  EnterpriseHeader,
  Fetch,
  LabelIcon,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { useNavigate } from "react-router-dom";

const LimitEnterprise = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const idEnterprise = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/limitenterprise/find?idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (response.data)
          setData({ ...response.data.chatbot, ...response.data.user, ...response.data.api });
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

  const onSave = () => {
    if (!idEnterprise) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }
    if (!data?.maxContacts || parseInt(data?.maxContacts) < 0) {
      toast.warn(intl.formatMessage({ id: "max.contacts.required" }));
      return;
    }
    setIsLoading(true);
    Fetch.post(`/limitenterprise`, {
      idEnterprise,
      chatbot: {
        maxContacts: parseInt(data.maxContacts),
      },
      user: {
        maxUsers: parseInt(data.maxUsers),
      },
      api: {
        maxRequestHistorySensorApi: parseInt(data.maxRequestHistorySensorApi),
        maxRequestHistoryFleetApi: parseInt(data.maxRequestHistoryFleetApi),
        maxRequestOffhireApi: parseInt(data.maxRequestOffhireApi),
      }
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

  return (
    <>
      <Card>
        <CardHeader>
          <EnterpriseHeader idEnterprise={idEnterprise} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <LabelIcon
                title={<FormattedMessage id="max.contacts.chatbot" />}
                iconName="message-circle-outline"
              />
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={"number"}
                  value={data?.maxContacts}
                  onChange={(e) =>
                    onChange(
                      "maxContacts",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  min={0}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <LabelIcon
                title={<FormattedMessage id="max.users" />}
                iconName="people-outline"
              />
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={"number"}
                  value={data?.maxUsers}
                  onChange={(e) =>
                    onChange(
                      "maxUsers",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  min={0}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                title={`${intl.formatMessage({ id: "max.request.api.day" })} (Histórico sensor)`}
                iconName="swap-outline"
              />
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={"number"}
                  value={data?.maxRequestHistorySensorApi}
                  onChange={(e) =>
                    onChange(
                      "maxRequestHistorySensorApi",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  min={0}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                title={`${intl.formatMessage({ id: "max.request.api.day" })} (Fleet positions)`}
                iconName="swap-outline"
              />
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={"number"}
                  value={data?.maxRequestHistoryFleetApi}
                  onChange={(e) =>
                    onChange(
                      "maxRequestHistoryFleetApi",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  min={0}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                title={`${intl.formatMessage({ id: "max.request.api.day" })} (Offhire)`}
                iconName="swap-outline"
              />
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={"number"}
                  value={data?.maxRequestOffhireApi}
                  onChange={(e) =>
                    onChange(
                      "maxRequestOffhireApi",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  min={0}
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row end="xs">
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

export default LimitEnterprise;
