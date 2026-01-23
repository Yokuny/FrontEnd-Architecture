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
  Fetch,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import InputWhatsapp from "../../../components/Inputs/InputWhatsapp";
import { useNavigate } from "react-router-dom";

const SetupChatbot = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [enterprise, setEnterprise] = React.useState();

  const idEnterpriseQuery = new URL(window.location.href).searchParams.get(
    "id"
  );

  React.useLayoutEffect(() => {
    if (idEnterpriseQuery) getData(idEnterpriseQuery);
  }, []);

  React.useLayoutEffect(() => {
    if (enterprise?.value) {
      getData(enterprise?.value);
    }
  }, [enterprise]);

  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/setupenterprise/find/chatbot?idEnterprise=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            idEnterprise: id,
            id: response.data.id,
            phone: response.data?.chatbot?.phone,
            messageWelcome: response.data?.chatbot?.messageWelcome,
          });
        } else {
          setData({
            idEnterprise: id,
            id: "",
            phone: "",
            messageWelcome: "",
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setData({
          idEnterprise: id,
          id: "",
          phone: "",
          messageWelcome: "",
        });
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onSave = () => {
    if (!data?.idEnterprise) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    const dataToSave = {
      idEnterprise: data?.idEnterprise,
      id: data?.id,
      chatbot: {
        phone: data?.phone,
        messageWelcome: data?.messageWelcome,
      },
    };
    setIsLoading(true);
    Fetch.post("/setupenterprise/chatbot", dataToSave)
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
          <TextSpan apparence="s2">
            <FormattedMessage id="setup.chatbot" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <Row>
            {!idEnterpriseQuery && (
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <SelectEnterprise
                  onChange={(value) => setEnterprise(value)}
                  value={enterprise}
                  oneBlocked
                />
              </Col>
            )}
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">WhatsApp</TextSpan>
              <InputWhatsapp
                value={data?.phone}
                className="pl-1 mt-1"
                onChange={(value) => onChange("phone", value)}
              />
            </Col>

            <Col breakPoint={{ md: 12 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="message.welcome" />
              </TextSpan>
              <InputGroup fullWidth>
                <textarea
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "message.welcome",
                  })}
                  onChange={(text) =>
                    onChange("messageWelcome", text.target.value)
                  }
                  value={data?.messageWelcome}
                  rows={4}
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Button size="Small" onClick={onSave}>
            <FormattedMessage id="save" />
          </Button>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default SetupChatbot;
