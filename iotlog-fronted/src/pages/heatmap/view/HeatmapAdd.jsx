import React from 'react';
import { useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import styled, { css, useTheme } from "styled-components";
import { Button, CardFooter, Row, InputGroup, Col, List, ListItem, Card, CardBody, CardHeader, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmation, Fetch, LabelIcon, SelectEnterprise, SpinnerFull, TextSpan } from "../../../components";
import { Vessel } from "../../../components/Icons";
import { ContainerRow } from "../../../components/Inputs";
import { SelectMachineEnterprise } from "../../../components/Select";
import { Equipments } from "../Equipments";
import ConfigSensors from "./ConfigSensors";

const Column = styled(Col)`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ListItemStyled = styled(ListItem)`

  ${({ theme, isSelected }) => css`
  width: 100%;
  cursor: pointer;

  ${isSelected &&
    `background-color: ${theme.backgroundBasicColor3};
  `}

  &:hover {
    background-color: ${theme.backgroundBasicColor2};
  }
`}
`

const ListItemNoHoverStyled = styled(ListItem)`

  ${({ theme, isSelected }) => css`
  width: 100%;
  cursor: pointer;

`}
`

const HeatmapAdd = (props) => {
  const theme = useTheme();
  const intl = useIntl();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(undefined);
  const [selectedSubgroupIndex, setSelectedSubgroupIndex] = useState(undefined);
  const [machine, setMachine] = useState();
  const [sensors, setSensors] = useState([]);
  const [equipmentList, setEquipmentList] = React.useState([]);
  const [enterprise, setEnterprise] = React.useState();

  const hasPermissionDelete = props.items?.some((x) => x === "/heatmap-fleet-delete");

  const idEdit = new URL(window.location.href).searchParams.get("id");

  useLayoutEffect(() => {
    verifyEdit();
  }, []);

  useLayoutEffect(() => {
    if (machine?.value)
      getSensors(machine?.value);
  }, [machine?.value]);

  const verifyEdit = () => {
    if (!!idEdit) {
      getEditEntity(idEdit);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    Fetch.get(`/machineheatmap/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          const fleet = response.data;
          if (fleet.enterprise) {
            setEnterprise({
              label: fleet.enterprise.name,
              value: fleet.enterprise.id,
            });
          }
          if (fleet?.machine)
            setMachine({
              label: fleet.machine.name,
              value: fleet.machine.id,
            });

          if (fleet.equipments?.length)
            setEquipmentList(fleet.equipments || [])
          setIsLoading(false);
          setIsEdit(true);
        }
        else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getSensors = (idMachine) => {
    Fetch.get(`/machine/sensors?id=${idMachine}`)
      .then((response) => {
        setSensors(response.data || []);
      })
      .catch((e) => {
      });
  }

  const onChangeSubgroup = (equipmentFiltered, indexSubgroup, listChange) => {
    if (!equipmentFiltered || indexSubgroup === undefined || !listChange?.length) {
      return;
    }

    let equipments = equipmentList || []
    let equipmentToUpdate = equipments.find((eqp) => eqp.code === equipmentFiltered.code)
    if (!equipmentToUpdate) {
      equipmentToUpdate = {
        name: equipmentFiltered.name,
        code: equipmentFiltered.code,
        subgroups: []
      };
      equipments.push(equipmentToUpdate);
    }

    if (!equipmentToUpdate.subgroups) {
      equipmentToUpdate.subgroups = [];
    }

    // Garante que o array de subgrupos tenha o tamanho necessário
    while (equipmentToUpdate.subgroups.length <= indexSubgroup) {
      const templateSubgroup = equipmentFiltered.subgroups[equipmentToUpdate.subgroups.length];
      equipmentToUpdate.subgroups.push({
        subgroupName: templateSubgroup?.subgroupName || "",
        index: equipmentToUpdate.subgroups.length
      });
    }

    const subgroupToUpdate = equipmentToUpdate.subgroups[indexSubgroup]
    listChange.forEach((item) => {
      subgroupToUpdate[item.prop] = item.value;
      subgroupToUpdate.index = indexSubgroup;
    })

    setEquipmentList([...equipments])
  }

  const onChangeSensors = (sensors, equipment, indexSubgroup) => {
    onChangeSubgroup(equipment, indexSubgroup, [{ prop: "sensors", value: sensors }])
  }

  const onChangeSensorOnOff = (sensorOnOff, equipment, indexSubgroup) => {
    onChangeSubgroup(equipment, indexSubgroup, [{ prop: "sensorOnOff", value: sensorOnOff }, { prop: "idSensorOnOff", value: sensorOnOff?.value }])
  }

  const onSave = () => {
    const equipments = equipmentList?.map((eqp) => {
      return {
        name: eqp.name,
        code: eqp.code,
        subgroups: eqp.subgroups?.map((subgroup) => {
          return {
            index: subgroup.index,
            subgroupName: subgroup.subgroupName,
            idSensorOnOff: subgroup.idSensorOnOff,
            sensors: subgroup.sensors?.map((sensor) => {
              return {
                sensorKey: sensor.value ? sensor.value : sensor.sensorKey
              }
            })
          }
        })
      }
    })
    const heatmapMachine = {
      id: idEdit,
      idEnterprise: enterprise.value,
      idMachine: machine.value,
      equipments
    }
    if (isEdit)
      Fetch.put("/machineheatmap", heatmapMachine)
        .then(() => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          navigate(-1);
        })
    else
      Fetch.post("/machineheatmap", heatmapMachine)
        .then(() => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          navigate(-1);
        })
  }

  const onDelete = (id) => {
    setIsLoading(true);
    Fetch.delete(`/machineheatmap?id=${id}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSelectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setSelectedSubgroupIndex(undefined)
  }

  const onSelectedSubgroup = (e, index) => {
    e.stopPropagation();
    setSelectedSubgroupIndex(index)
  }

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card className="pl-4 pr-4">
            <CardHeader>
              <FormattedMessage id={!!isEdit ? "machine.edit" : "add.machine"} />
            </CardHeader>
            <Row style={{ margin: 0 }} className="mt-2">
              <Col breakPoint={{ md: 6 }} className='mb-4'>
                <LabelIcon
                  iconName="home-outline"
                  title={<><FormattedMessage id="enterprise" /> *</>}
                />
                <SelectEnterprise
                  onChange={(value) => setEnterprise(value)}
                  value={enterprise}
                  oneBlocked
                  disabled={!!idEdit}
                />
              </Col>
              <Col breakPoint={{ md: 6 }} className='mb-4'>
                <LabelIcon
                  renderIcon={() => (
                    <Vessel
                      style={{
                        height: 13,
                        width: 13,
                        color: theme.textHintColor,
                        marginRight: 5,
                        marginTop: 2,
                        marginBottom: 2,
                      }}
                    />
                  )}
                  title={<FormattedMessage id="vessel" />}
                />
                <div style={{ marginTop: 2.1 }}></div>
                <SelectMachineEnterprise
                  idEnterprise={enterprise?.value}
                  onChange={(value) => setMachine(value)}
                  placeholder="machine.placeholder"
                  value={machine}
                  disabled={!!idEdit}
                />
              </Col>

              {machine?.value && <Col breakPoint={{ md: 12 }}>
                <Card>
                  <CardHeader>
                    <LabelIcon
                      iconName="settings-outline"
                      title={<><FormattedMessage id="machine.equipment" /> *</>}
                    />
                  </CardHeader>
                  <CardBody style={{ padding: 0 }}>
                    <List style={{ padding: 0 }}>
                      <>
                        {Equipments?.map((equipment, idxEqp) => {

                          const isSelected = equipment.code === selectedEquipment?.code;

                          return <ListItemStyled
                            key={`${idxEqp}-o`}
                            isSelected={isSelected}
                            onClick={() => onSelectEquipment(isSelected ? undefined : equipment)}
                          >
                            <Column>

                              <Row className="m-0" between="xs" style={{ width: '100%' }}>
                                <TextSpan apparence="s1" hint={isSelected}>{equipment.name}</TextSpan>
                                <EvaIcon
                                  status={isSelected && 'Basic'}
                                  name={`arrow-ios-${isSelected ? 'upward' : 'downward'}-outline`} />
                              </Row>

                              {selectedEquipment?.code === equipment.code &&
                                <Card className="mt-4 mb-3">
                                  <CardBody style={{ padding: 0 }}>

                                    <List style={{ padding: 0 }}>
                                      {equipment?.subgroups?.map((subgroup, idxSubgroup) => {

                                        const equipmentData = equipmentList?.find((eqp) => eqp.code === equipment.code)

                                        const isSelectedSub = selectedSubgroupIndex !== undefined && selectedSubgroupIndex === idxSubgroup;

                                        return <ListItemNoHoverStyled
                                          key={`${idxEqp}-${idxSubgroup}-e`}
                                          onClick={(e) => onSelectedSubgroup(e, idxSubgroup)}>

                                          <Column>
                                            <Row between='xs' className='m-0' onClick={(e) => onSelectedSubgroup(e,
                                              isSelectedSub ? undefined : idxSubgroup
                                            )}>
                                              <TextSpan
                                                hint={isSelectedSub}
                                                apparence={isSelectedSub ? "s1" : "s2"}>
                                                {subgroup?.subgroupName}
                                              </TextSpan>
                                              <EvaIcon

                                                status={isSelectedSub && 'Basic'}
                                                name={`arrow-ios-${isSelectedSub ? 'upward' : 'downward'}-outline`} />
                                            </Row>

                                            {isSelectedSub &&
                                              <ConfigSensors
                                                sensors={sensors}
                                                data={equipmentData?.subgroups?.length ? equipmentData.subgroups[idxSubgroup] : undefined}
                                                onChangeSensorOnOff={(value) => onChangeSensorOnOff(value, equipment, idxSubgroup)}
                                                onChangeSensors={(value) => onChangeSensors(value, equipment, idxSubgroup)}
                                              />}

                                          </Column>

                                        </ListItemNoHoverStyled>

                                      })}
                                    </List>

                                  </CardBody>
                                </Card>
                              }
                            </Column>
                          </ListItemStyled>
                        })}
                      </>
                    </List>
                  </CardBody>
                </Card>
              </Col>}
            </Row>
            <CardFooter>
              <Row between="xs" className="ml-1 mr-1">
                {(!!isEdit && hasPermissionDelete) ? (
                  <DeleteConfirmation
                    message={intl.formatMessage({ id: "delete.message.default" })}
                    onConfirmation={() => onDelete(new URL(window.location.href).searchParams.get("id"))}
                  />
                ) : (
                  <div></div>
                )}
                <Button size="Small" onClick={onSave} disabled={!enterprise?.value || !machine?.value}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  )
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(HeatmapAdd);
