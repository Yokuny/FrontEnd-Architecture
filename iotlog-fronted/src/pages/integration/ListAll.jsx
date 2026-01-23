import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { ContainerRow } from "../../components/Inputs";
import { Fetch, LabelIcon, SpinnerFull, TextSpan, Toggle, UserImage } from "../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../components/Table";
import { optionsIntegrations } from "./OptionsIntegrations";

const Badge = styled.div`

  ${({ theme }) => css`
    background-color: ${theme.colorBasic500};
    color: #fff;
    padding: 0 5px;
    font-size: 11px;
    text-transform: uppercase;
    border-radius: 3px;
    font-weight: 700;
    display: flex;
    align-items: center;
    align-content: center;
  `}
`

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`

const MachineIntegrationListAll = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const intl = useIntl();

  useEffect(() => {
    if (props.enterprises?.length)
      getData(props.enterprises);
  }, [props.enterprises]);

  function getData(enterprises) {
    setIsLoading(true);
    const idEnterprise = enterprises[0]?.id;
    Fetch.get(`/machine-integration/list?idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (!response.data?.length) return

        const machines = response.data
          ?.map((data) => (
            {
              id: data.id,
              name: data.name,
              image: data.image,
              type: data.machineIntegration?.type || null,
              idMoon: data.machineIntegration?.idMoon || null,
              imo: data.machineIntegration?.imo || data.dataSheet?.imo,
              mmsi: data.machineIntegration?.mmsi || data.dataSheet?.mmsi,
              disabled: data.machineIntegration?.disabled || false,
              updateTime: data.machineIntegration?.updateTime || null,
            }
          ))
          ?.sort((a, b) => a.name.localeCompare(b.name));

        setData(machines);
      })
      .catch((error) => {
        return
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleChange(index, name, value) {
    const newData = [...data];
    newData[index][name] = value;

    setData(newData);
  }

  function handleSave() {
    setIsLoading(true);

    const machines = data.map((item) => (
      {
        id: item.id,
        idEnterprise: props.enterprises[0]?.id,
        type: item.type,
        updateTime: item.updateTime,
        idMoon: item.idMoon ? parseInt(item.idMoon) : null,
        imo: item.imo ? parseInt(item.imo) : null,
        mmsi: item.mmsi ? parseInt(item.mmsi) : null,
        disabled: item.disabled
      }
    ));

    Fetch.put("/machine-integration/list", machines)
      .then((response) => {
        if (response.data) {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
        }
      })
      .catch((error) => {
        toast.error(intl.formatMessage({ id: "error.save" }));
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
        <Col breakPoint={{ md: 12, xs: 12 }}>
          <Card>
            <CardHeader><FormattedMessage id="integration" /> AIS</CardHeader>

            <CardBody>
              <TABLE>
                <THEAD>
                  <TRH>
                    <TH style={{ width: 70 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="image" />
                      </TextSpan>
                    </TH>
                    <TH style={{ width: 250 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="name" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center" style={{ width: 160 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="type" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center" style={{ width: 120 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="interval" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="options" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center" style={{ width: '4rem' }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="active" />
                      </TextSpan>
                    </TH>
                  </TRH>
                </THEAD>
                <TBODY>
                  {data.map((item, index) => (
                    <TR key={item.id}
                      isEvenColor={index % 2 === 0}
                    >
                      <TD>
                        <UserImage
                          size="Large"
                          image={item.image?.url}
                        />
                      </TD>
                      <TD>
                        <Row className="m-0 pl-2">
                          <TextSpan apparence="s2" hint={item.disabled}>
                            {item.name}
                          </TextSpan>
                          {!!item.disabled && <Badge className="ml-4 flex-between">
                            <EvaIcon
                              name="wifi-off-outline"
                              className="mt-1"
                              options={{ height: "15px", width: "15px" }}
                            />
                            <FormattedMessage id="deactivate" />
                          </Badge>}
                        </Row>
                      </TD>
                      <TD>
                        <Select
                          options={optionsIntegrations}
                          isOptionDisabled={(option) => !!option.disabled}
                          isDisabled={!!item.disabled}
                          placeholder={<FormattedMessage id="type" />}
                          onChange={(e) => handleChange(index, "type", e.value)}
                          value={item.type ? optionsIntegrations?.find((option) => option.value === item.type) : null}
                        />
                      </TD>
                      <TD>
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
                          isDisabled={!!item.disabled}
                          placeholder={<FormattedMessage id="interval" />}
                          onChange={(e) => handleChange(index, "updateTime", e.value)}
                          value={item.updateTime ? { value: item.updateTime, label: `${item.updateTime / 60000} min` } : null}
                        />
                      </TD>
                      <TD style={{ maxWidth: 70 }}>
                        <Row className="m-0">
                          {item.type === "MOON" &&
                            <InputGroup fullWidth>
                              <input
                                type="text"
                                disabled={!!item.disabled}
                                placeholder="ID"
                                value={item.idMoon}
                                onChange={(e) => handleChange(index, "idMoon", e.target.value)}
                              />
                            </InputGroup>
                          }
                          {(item.type === "OPT" ||
                            item.type === "SP_OPT")
                            &&
                            <>
                              <ColFlex>
                                <LabelIcon
                                  title="IMO"
                                />
                                <InputGroup fullWidth>
                                  <input
                                    type="number"
                                    disabled={!!item.disabled}
                                    placeholder="IMO"
                                    value={item.imo}
                                    onChange={(e) => handleChange(index, "imo", e.target.value)}
                                  />
                                </InputGroup>
                              </ColFlex>
                            </>
                          }
                          {!!["VF", "VT", "HF", "SF", "EL", "SP", "SP_OPT"]?.some(itemtype => itemtype === item?.type) &&
                            <>
                              <ColFlex
                                className={
                                  item.type === "SP_OPT" ?
                                    "ml-3" :
                                    ""
                                }
                              >
                                <LabelIcon
                                  title="MMSI"
                                />
                                <InputGroup fullWidth>
                                  <input
                                    type="number"
                                    disabled={!!item.disabled}
                                    placeholder="MMSI"
                                    value={item.mmsi}
                                    onChange={(e) => handleChange(index, "mmsi", e.target.value)}
                                  />
                                </InputGroup>
                              </ColFlex>
                            </>
                          }
                        </Row>
                      </TD>
                      <TD style={{ maxWidth: 18 }}>
                        {!!item.type && <Toggle
                          onChange={(e) => handleChange(index, "disabled", !item.disabled)}
                          checked={!item.disabled}
                        />}
                      </TD>
                    </TR>
                  ))}
                </TBODY>
              </TABLE>
            </CardBody>

            <CardFooter>
              <Row
                className="m-0"
                end={"xs"}
              >
                <Button
                  disabled={isLoading}
                  size="Small"
                  onClick={handleSave}>
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
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(MachineIntegrationListAll);
