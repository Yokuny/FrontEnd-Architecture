import { Button, Card, CardBody, CardFooter, CardHeader, Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { ContainerRow } from "../../components/Inputs";
import { DeleteConfirmation, Fetch, LabelIcon, SpinnerFull, Toggle } from "../../components";
import { optionsIntegrations } from "./OptionsIntegrations";

const MachineIntegration = (props) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const intl = useIntl()
  const navigate = useNavigate();

  useEffect(() => {
    if (props.enterprises?.length)
      getData(props.enterprises);
  }, [props.enterprises]);

  function getData(enterprises) {
    const params = new URLSearchParams(window.location.search);
    const idMachine = params.get("id");
    const idEnterprise = enterprises[0]?.id;
    setIsLoading(true);
    Fetch.get(`/machine-integration?idMachine=${idMachine}&idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (!response.data) return

        setData({
          type: response.data.type,
          idMoon: response.data?.idMoon,
          imo: response.data?.imo,
          mmsi: response.data?.mmsi,
          disabled: !!response.data?.disabled,
          updateTime: { value: response.data.updateTime, label: `${response.data?.updateTime / 60000} min` },
        });
        setIsEdit(true);
      })
      .catch((error) => {

      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleChange(name, value) {
    setData({ ...data, [name]: value });
  }

  function handleSave() {
    const params = new URLSearchParams(window.location.search);
    const idMachine = params.get("id");
    setIsLoading(true);
    const machine = {
      idMachine,
      idEnterprise: props.enterprises[0]?.id,
      type: data.type,
      idMoon: data.idMoon ? parseInt(data.idMoon) : null,
      imo: data.imo ? parseInt(data.imo) : null,
      mmsi: data.mmsi ? parseInt(data.mmsi) : null,
      updateTime: data.updateTime.value,
      disabled: data.disabled,
    }

    if (isEdit) {
      Fetch.put("/machine-integration", machine)
        .then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          navigate(-1);
        })
        .catch((error) => {
        })
        .finally(() => {
          setIsLoading(false);
        });

      return
    }

    Fetch.post("/machine-integration", machine)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
      })
      .catch((error) => {
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleDelete() {
    const params = new URLSearchParams(window.location.search);
    const idMachine = params.get("id");
    setIsLoading(true);
    Fetch.delete(`/machine-integration?idMachine=${idMachine}&idEnterprise=${props.enterprises[0]?.id}`)
      .then((response) => {
        if (response.data) {
          toast.success(intl.formatMessage({ id: "delete.successfull" }));
          navigate(-1);
        }
      })
      .catch((error) => {

      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function minutesToMiliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card
          >
            <CardHeader>
              <FormattedMessage id="integration" /> AIS
            </CardHeader>

            <CardBody>
              <Row>
                <Col breakPoint={{ md: 4 }} className="mb-4">
                  <LabelIcon title={<FormattedMessage id="type" />} iconName="swap-outline" />
                  <Select
                    options={optionsIntegrations}
                    isOptionDisabled={(option) => !!option.disabled}
                    placeholder={<FormattedMessage id="type" />}
                    value={data?.type ? optionsIntegrations?.find((option) => option.value === data.type) : null}
                    menuPosition="fixed"
                    onChange={(e) => handleChange("type", e?.value)}
                  />
                </Col>

                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon title={<FormattedMessage id="interval" />} iconName="clock-outline" />
                  <Select
                    options={[
                      { value: minutesToMiliseconds(1), label: "1 min" },
                      { value: minutesToMiliseconds(2), label: "2 min" },
                      { value: minutesToMiliseconds(5), label: "5 min" },
                      { value: minutesToMiliseconds(10), label: "10 min" },
                      { value: minutesToMiliseconds(15), label: "15 min" },
                      { value: minutesToMiliseconds(30), label: "30 min" },
                      { value: minutesToMiliseconds(60), label: "60 min" },
                    ]}
                    placeholder={<FormattedMessage id="interval" />}
                    value={data?.updateTime}
                    menuPosition="fixed"
                    onChange={(e) => handleChange("updateTime", { label: e.label, value: e.value })}
                  />
                </Col>

                {data?.type === "MOON" && <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon title="ID" iconName="hash-outline" />
                  <InputGroup fullWidth>
                    <input
                      type="number"
                      placeholder="ID"
                      value={data?.idMoon}
                      onChange={(e) => handleChange("idMoon", e.target.value)}
                    />
                  </InputGroup>
                </Col>}


                {data?.type === "OPT" && <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon title="IMO" iconName="hash-outline" />
                  <InputGroup fullWidth>
                    <input
                      type="number"
                      placeholder="IMO"
                      value={data?.imo}
                      onChange={(e) => handleChange("imo", e.target.value)}
                    />
                  </InputGroup>
                </Col>}

                {!!["VF", "VT", "HF", "SF", "EL"]?.some(itemtype => itemtype === data?.type) && <Col breakPoint={{ md: 4 }} className="mb-4">
                  <LabelIcon title="MMSI" iconName="hash-outline" />
                  <InputGroup fullWidth>
                    <input
                      type="number"
                      placeholder="MMSI"
                      value={data?.imo}
                      onChange={(e) => handleChange("mmsi", e.target.value)}
                    />
                  </InputGroup>
                </Col>}

                <Col breakPoint={{ md: 2 }} className="mb-4">
                  <LabelIcon title={
                    <FormattedMessage id="active" />
                  } iconName="power-outline" />
                  <div className="mt-2"></div>
                  <Toggle
                    onChange={(e) => handleChange("disabled", !data.disabled)}
                    checked={!data?.disabled}
                  />
                </Col>
              </Row>
            </CardBody>

            <CardFooter>
              <Row
                style={{ margin: 0 }}
                end={"xs"}
                between={"xs"}
              >
                <DeleteConfirmation
                  message={"Deseja realmente excluir esta integração?"}
                  buttonActionMessage="Excluir"
                  onConfirmation={handleDelete}
                />

                <Button
                  size="Small"
                  onClick={handleSave}
                >
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
        <SpinnerFull isLoading={isLoading} />
      </ContainerRow>
    </>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(MachineIntegration);
