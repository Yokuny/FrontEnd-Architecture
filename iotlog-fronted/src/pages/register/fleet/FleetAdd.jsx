import React from "react";
import { Fetch, SpinnerFull, LabelIcon, SelectEnterprise } from "../../../components";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "underscore";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  /* Increase spacing between columns on mobile */
  @media (max-width: 768px) {
    [class*='col-'] {
      margin-bottom: 24px;
    }
  }
`;

const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

const ContainerColor = styled(InputGroup)`
  display: flex !important;
  align-items: center !important;
`;

const FleetAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fleetId = searchParams.get("id");
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState("");
  const [data, setData] = React.useState({
    description: "",
    color: "#000000",
  });

  React.useEffect(() => {
    const loadFleetData = async () => {
      if (fleetId) {
        setIsLoading(true);
        try {
          const response = await Fetch.get(`/machinefleet/${fleetId}`);
          setData({
            description: response.data.description,
            color: response.data.color,
            idEnterprise: response.data.idEnterprise
          });
          setEnterprise({
            label: response.data.enterprise?.name,
            value: response.data.enterprise?.id
          });
        } catch (error) {
          toast.error(intl.formatMessage({ id: "error.loading.data" }));
        }
        setIsLoading(false);
      }
    };

    loadFleetData();
  }, [fleetId, intl]);

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  React.useEffect(() => {
    if (props.enterprises?.length) {
      setData(prev => ({
        ...prev,
        idEnterprise: props.enterprises[0].id
      }));
    }
  }, [props.enterprises]);

  const onDelete = async () => {
    if (!fleetId) return;

    setIsLoading(true);
    try {
      await Fetch.delete(`/machinefleet/${fleetId}`);
      toast.success(intl.formatMessage({ id: "delete.successfull" }));
      setIsLoading(false);
      navigate(-1);
    } catch (e) {
      toast.error(intl.formatMessage({ id: "error.delete" }));
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    if (!data.description) {
      toast.warn(intl.formatMessage({ id: "fleet.description.required" }));
      return;
    }

    if (!data.color) {
      toast.warn(intl.formatMessage({ id: "color.required" }));
      return;
    }

    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    setIsLoading(true);
    try {
      if (fleetId) {
        await Fetch.put(`/machinefleet/${fleetId}`, {
          id: fleetId,
          description: data.description,
          color: data.color,
          idEnterprise: enterprise?.value
        });
      } else {
        await Fetch.post("/machinefleet", {
          description: data.description,
          color: data.color,
          idEnterprise: enterprise?.value
        });
      }
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setIsLoading(false);
      navigate(-1);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const changeValueDebounced = debounce((prop, value) => {
    onChange(prop, value);
  }, 500);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id={fleetId ? "fleet.edit" : "fleet.new"} />
            </CardHeader>

            <Row className="p-4">
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  iconName="home-outline"
                  title={<><FormattedMessage id="enterprise" /> *</>}
                />
                <div className="mt-1"></div>
                <SelectEnterprise
                  onChange={(value) => setEnterprise(value)}
                  value={enterprise}
                  oneBlocked
                />
              </Col>
              <Col breakPoint={{ xs: 12, md: 11 }} style={{ marginBottom: '12px' }}>
                <LabelIcon
                  iconName="text-outline"
                  title={<FormattedMessage id="description" />}
                />
                <div className="mt-1"></div>
                <InputGroup fullWidth>
                  <input
                    type="text"
                    value={data.description}
                    onChange={(e) => onChange("description", e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ xs: 12, md: 1 }}>
                <LabelIcon
                  iconName="color-palette-outline"
                  title={<FormattedMessage id="color" />}
                />
                <ContainerColor className="mt-1">
                  <InputColor
                    type="color"
                    defaultValue={"#3366ff"}
                    value={data.color}
                    onChange={(e) =>
                      changeValueDebounced("color", e.target.value)
                    }
                  />
                </ContainerColor>
              </Col>
            </Row>
            <CardFooter>
              <Row style={{ margin: 0 }} between={fleetId && "xs"} end={!fleetId && "xs"}>
                {fleetId && (
                  <Button
                    appearance="ghost"
                    size="Small"
                    onClick={onDelete}
                    status="Danger"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <EvaIcon name="trash-2-outline" />
                    <FormattedMessage id="delete" />
                  </Button>
                )}
                <Button
                  size="Small"
                  onClick={onSave}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <EvaIcon name="save-outline" />
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default FleetAdd;
