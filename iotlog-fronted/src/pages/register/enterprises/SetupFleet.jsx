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
import { useNavigate } from "react-router-dom";

const SetupFleet = (props) => {
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
    Fetch.get(`/setupenterprise/find/fleet?idEnterprise=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            idEnterprise: id,
            id: response.data.id,
            latitude: response.data.fleet?.center?.length
              ? response.data.fleet?.center[0]
              : "",
            longitude: response.data.fleet?.center?.length
              ? response.data.fleet?.center[1]
              : "",
            zoom: response.data.fleet?.zoom,
          });
        } else {
          setData({
            idEnterprise: id,
            latitude: "",
            longitude: "",
            zoom: "",
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setData({
          idEnterprise: id,
          latitude: "",
          longitude: "",
          zoom: "",
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
      fleet: {
        center:
          data?.latitude || data?.longitude
            ? [parseFloat(data?.latitude), parseFloat(data?.longitude)]
            : null,
        zoom: data?.zoom ? parseInt(data?.zoom) : 0,
      },
    };
    setIsLoading(true);
    Fetch.patch("/setupenterprise/fleet", dataToSave)
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
            {`${intl.formatMessage({ id: "setup" })} Fleet`}
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
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="lat.label" />
              </TextSpan>
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "lat.label",
                  })}
                  onChange={(text) =>
                    onChange(
                      "latitude",
                      text.target?.value?.replace(/[^(\-)(\d+)\.(\d+)]/g, "")
                    )
                  }
                  value={data?.latitude}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="lon.label" />
              </TextSpan>
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "lon.label",
                  })}
                  onChange={(text) =>
                    onChange(
                      "longitude",
                      text.target?.value?.replace(/[^(\-)(\d+)\.(\d+)]/g, "")
                    )
                  }
                  value={data?.longitude}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <TextSpan apparence="s2">Zoom</TextSpan>
              <InputGroup fullWidth>
                <input
                  type="number"
                  min={0}
                  placeholder={`Zoom`}
                  onChange={(text) => onChange("zoom", text.target?.value)}
                  value={data?.zoom}
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

export default SetupFleet;
