import { useState, useEffect, useCallback } from 'react'
import { Button, Card, CardBody, CardHeader, CardFooter, ContextMenu, EvaIcon } from "@paljs/ui";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Fetch, LabelIcon, SpinnerFull, TextSpan, Tracker } from '../../../components';
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from '../../../components/Table';
import ModalListDashboard from '../dashboard/ModalListDashboard';
import { Equipments, getAvailableEquipments } from '../Equipments';

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const RowContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const THFirst = styled(TH)`
  position: sticky;
  left: -1.5rem;
  z-index: 1;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  padding-left: 1rem;
`;

const TDFirst = styled(TD)`
  position: sticky;
  left: -1.5rem;
  z-index: 1;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  padding-left: 1rem;
`;

const HeatmapView = (props) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const [filterShowModal, setFilterShowModal] = useState();
  const [availableEquipments, setAvailableEquipments] = useState([]);

  const { enterprises, isReady } = props;

  const hasPermissionAdd = props.items?.some((x) => x === "/heatmap-fleet-add");


  const columns = [
    { index: 0, id: 'machine' },
    ...availableEquipments.map((eqp) => ({
      label: eqp.name,
      code: eqp.code,
      options: eqp.options,
      index: eqp.index
    }))
  ]

  const onGet = useCallback(() => {
    let url = `/machineheatmap`
    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : localStorage.getItem('id_enterprise_filter');
    if (idEnterpriseFilter) {
      url += `?idEnterprise=${idEnterpriseFilter}`;
    }

    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        setData(response.data);

        const filteredEquipments = getAvailableEquipments(response.data);
        setAvailableEquipments(filteredEquipments);

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [props.enterprises]);

  useEffect(() => {
    if (isReady) {
      onGet();
    }
  }, [enterprises, isReady, onGet])

  return (
    <>
      <Card className="mb-0">
        <CardHeader>
          <Col>
            <Row between="xs">
              <FormattedMessage id="heatmap" />
              {hasPermissionAdd && (
                <Button size="Tiny" status="Primary" className="flex-between" onClick={() => navigate(`/heatmap-fleet-add`)}>
                  <EvaIcon name="plus-outline" className='mr-1' />
                  <FormattedMessage id="view.heatmap.add" />
                </Button>
              )}
            </Row>
          </Col>
        </CardHeader>
        <CardBody>
          <TABLE style={{ minWidth: 1280 }}>
            <THEAD>
              <TRH>
                {columns.map((col, index) => {
                  if (index === 0)
                    return (
                      <>
                        <THFirst
                          style={index === 0 ? { minWidth: 90, maxWidth: 120 } : {}}
                          textAlign="center" isEvenColor={index % 2 === 0}>
                          <TextSpan apparence='s1'>
                            <FormattedMessage id={col.id} />
                          </TextSpan>
                        </THFirst>
                      </>
                    )
                  else
                    return (
                      <>
                        <TH textAlign="center" style={{
                          minWidth: 100,
                        }}>
                          <TextSpan apparence='s1'>
                            {col.label}
                          </TextSpan>
                          <br />
                          <TextSpan apparence='s2' hint>
                            {/* {col.options
                            ? col.options.map((x, i) => <>{x}{i < (col.options?.length - 1) && <>, &nbsp;</>}</>)
                            : <></>} */}
                          </TextSpan>
                        </TH>
                      </>
                    )
                })}
              </TRH>
            </THEAD>
            <TBODY>
              {data?.sort((a, b) => a.machine.name?.localeCompare(b.machine.name))?.map((fleet, i) =>
                <TR key={i} isEvenColor={i % 2 === 0}>
                  {columns.map((col, indexCol) => {
                    if (col.index === 0) {
                      return (
                        <>
                          <TDFirst
                            style={indexCol === 0 ? { minWidth: 90, maxWidth: 120 } : {}}
                            isEvenColor={i % 2 === 0}>
                            <RowContent>
                              {fleet?.machine.image?.url ? (
                                <Img src={fleet?.machine.image?.url} alt={fleet?.machine.name} className='mt-1 mb-1' />
                              ) : (
                                <div style={{ minHeight: 50 }}></div>
                              )}
                              <TextSpan apparence='s2' className="ml-2">
                                {fleet.machine.name}
                                <br />
                                <TextSpan apparence='c2' hint>
                                  {fleet.lastUpdate ? moment(fleet.lastUpdate).format("DD/MMM HH:mm:ss") : '-'}
                                </TextSpan>
                              </TextSpan>
                            </RowContent>
                          </TDFirst></>);
                    }
                    let equipment = fleet.equipments.find((eqp) => eqp.code === col.code);
                    if (equipment) {
                      let subgroups = equipment.subgroups.sort((a, b) => a.subgroupName.localeCompare(b.subgroupName))
                      return (
                        <>
                          <TD
                            style={{
                              minWidth: 100,
                            }}
                            textAlign="center">
                            <Tracker
                              onClick={(item, index) => setFilterShowModal({ fleet, equipment, item, index })}
                              itens={subgroups.map((subg) => {
                                let status = 'Success';
                                if (!subg.idSensorOnOff)
                                  return { }
                                else if (subg.isDanger)
                                  status = 'Danger';
                                else if (subg.isWarning)
                                  status = 'Warning'
                                else if (fleet.lastUpdate && moment().diff(moment(fleet.lastUpdate), 'hours') >= 24)
                                  status = 'Basic'

                                if (subg.isOn)
                                  return { status, tooltip: subg.subgroupName }
                                return { status, tooltip: subg.subgroupName, onlyBorder: true }
                              })} />
                          </TD>
                        </>)
                    }
                    else
                      return (
                        <>
                          <TD textAlign="center">
                          </TD>
                        </>)
                  })}
                  {hasPermissionAdd && (
                    <TD textAlign="center">
                      <ContextMenu
                        className="inline-block mr-1 text-start"
                        placement="left"
                        items={[
                          {
                            icon: "edit-outline",
                            title: intl.formatMessage({ id: "edit" }),
                            link: { to: `/heatmap-fleet-add?id=${fleet.id}` },
                          },
                          {
                            icon: "bell-outline",
                            title: intl.formatMessage({ id: "notifications" }),
                            link: { to: `/heatmap-fleet-alerts?id=${fleet.id}` },
                          }
                        ]}
                        Link={Link}
                      >
                        <Button size="Tiny" status="Basic">
                          <EvaIcon name="more-vertical" />
                        </Button>
                      </ContextMenu>
                    </TD>
                  )}
                </TR>)}
            </TBODY>
          </TABLE>
        </CardBody>
        <CardFooter>
          <Row>
            <Col breakPoint={{ xs: 12, md: 12 }}>
              <TextSpan apparence='p2' hint>
                <FormattedMessage id="legend" />
              </TextSpan>
            </Col>
            <Col breakPoint={{ xs: 12, md: 6 }} className="pl-2">
              <LabelIcon iconName="flash"
                titleApparence="s2"
                title={<FormattedMessage id="active.mode" />} />
              <div className="ml-2 pt-1 pb-3" style={{ display: "flex" }}>
                <Tracker
                  showLegend
                  itens={[
                    { status: 'Success', tooltip: 'OK' },
                    { status: 'Warning', tooltip: intl.formatMessage({ id: "in.progress" }) },
                    { status: 'Danger', tooltip: intl.formatMessage({ id: "in.warning" }) },
                    { status: 'Basic', tooltip: intl.formatMessage({ id: "no.connected.hours" }).replace('{0}', '24HR') }
                  ]}
                />
              </div>
            </Col>
            <Col breakPoint={{ xs: 12, md: 6 }} className="pl-2">
              <LabelIcon iconName="flash-off-outline"
                titleApparence="s2"
                title={<FormattedMessage id="power.off" />} />
              <div className="ml-2 pt-1" style={{ display: "flex" }}>
                <Tracker
                  showLegend
                  itens={[
                    { status: 'Success', tooltip: 'OK', onlyBorder: true },
                    { status: 'Warning', tooltip: intl.formatMessage({ id: "in.progress" }), onlyBorder: true },
                    { status: 'Danger', tooltip: intl.formatMessage({ id: "in.warning" }), onlyBorder: true },
                    { status: 'Basic', tooltip: intl.formatMessage({ id: "no.connected.hours" }).replace('{0}', '24HR'), onlyBorder: true }
                  ]}
                />
              </div>
            </Col>
          </Row>
        </CardFooter>
        <SpinnerFull isLoading={isLoading} />
      </Card>
      <ModalListDashboard
        show={!!filterShowModal}
        onClose={() => setFilterShowModal(undefined)}
        itemSelected={filterShowModal}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(HeatmapView);
