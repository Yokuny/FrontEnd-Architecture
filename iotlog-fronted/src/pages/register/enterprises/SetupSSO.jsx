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
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { useNavigate } from "react-router-dom";

const SetupSSO = (props) => {
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
    Fetch.get(`/setupenterprise/find/sso?idEnterprise=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            idEnterprise: id,
            id: response.data.id,
            isEdit: response.data.isThereSSO,
          });
        } else {
          setData({
            idEnterprise: id,
            id: "",
            isEdit: false,
            clientId: "",
            tenantId: "",
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setData({
          idEnterprise: id,
          id: "",
          clientId: "",
          tenantId: "",
          isEdit: false,
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

    if (!data?.clientId) {
      toast.warn("Informe o Client Id");
      return;
    }

    if (!data?.tenantId) {
      toast.warn("Informe o Tenant Id");
      return;
    }

    const dataToSave = {
      idEnterprise: data?.idEnterprise,
      id: data?.id,
      clientId: data?.clientId,
      tenantId: data?.tenantId,
    };
    setIsLoading(true);
    Fetch.post("/setupenterprise/sso", dataToSave)
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
          <TextSpan apparence="s1">
            <FormattedMessage id="setup.sso" />
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
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <LabelIcon
                title="Client Id"
              />

              {data?.isEdit && (<TextSpan apparence="s2">
                <FormattedMessage id="previous" />: ****************
              </TextSpan>)}

              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={"Client Id"}
                  onChange={(text) =>
                    onChange("clientId", text.target.value)
                  }
                  value={data?.clientId}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <LabelIcon
                title="Tenant Id"
              />
              {data?.isEdit && (<TextSpan apparence="s2">
                <FormattedMessage id="previous" />: ****************
              </TextSpan>)}
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={"Tenant Id"}
                  onChange={(text) =>
                    onChange("tenantId", text.target.value)
                  }
                  value={data?.tenantId}
                />
              </InputGroup>
            </Col>

          </Row>
        </CardBody>
        <CardFooter>
          <Row className="m-0" end="xs">
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

export default SetupSSO;
