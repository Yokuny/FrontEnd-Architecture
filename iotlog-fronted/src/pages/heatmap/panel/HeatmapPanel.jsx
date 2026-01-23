import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { EvaIcon } from "@paljs/ui/Icon";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import styled from 'styled-components';
import { Fetch, SpinnerFull, TextSpan, Tracker } from '../../../components';
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from '../../../components/Table';
import ModalListItens from './ModalListItens';
import Benchmark from './Benchmark';

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
  border-right-width: 1px;
  border-right-color: ${props => props.theme.backgroundBasicColor4};
  border-right-style: solid;
`;

const TDFirst = styled(TD)`
  position: sticky;
  left: -1.5rem;
  z-index: 1;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  padding-left: 2rem;
  border-right-width: 1px;
  border-right-color: ${props => props.theme.backgroundBasicColor4};
  border-right-style: solid;
  width: 200px;
`;

const HeatmapPanel = (props) => {

  const [data, setData] = useState({
    columns: [],
    data: []
  });
  const [isLoading, setIsLoading] = useState();
  const [dataShowModal, setDatashowModal] = useState();

  const { enterprises, isReady } = props;

  useEffect(() => {
    const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : "";
    if (isReady && idEnterprise) {
      onGet(idEnterprise);
    }
  }, [enterprises, isReady])


  const onGet = (idEnterprise) => {
    let url = `/heatmap/panel?idEnterprise=${idEnterprise}`

    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card className="mb-0">
        <CardHeader>
          <Col>
            <Row between="xs" middle='xs'>
              <TextSpan apparence='s1'>
                <FormattedMessage id="panel.heatmap" />
              </TextSpan>
              <Row middle='xs' className='m-0'>
                <EvaIcon name="clock-outline" status="Basic" options={{ height: 17 }} />
                <TextSpan apparence='c2'>
                  <TextSpan apparence='p2' hint className="mr-1">
                    <FormattedMessage id="last.date.acronym" />:
                  </TextSpan>
                  {data?.lastUpdate ? moment(data?.lastUpdate).format("DD MMM, HH:mm") : '-'}
                </TextSpan>
              </Row>
            </Row>
          </Col>
        </CardHeader>
        <CardBody>
          <Benchmark
            total={data?.total}
          />
        </CardBody>
        <CardBody style={{ padding: 0 }}>

          {!!data?.columns?.length && <TABLE style={{ minWidth: 1280 }}>
            <THEAD>
              <TRH>
                {!!data?.columns?.length && (
                  <THFirst textAlign="center"
                    isEvenColor={true}>
                    <TextSpan apparence='s1'>
                      <FormattedMessage id="vessel" />
                    </TextSpan>
                  </THFirst>
                )}
                {data?.columns.map((col, index) => {
                  return (
                    <TH textAlign="center" style={{
                      minWidth: 50,
                      maxWidth: 90,
                    }}>
                      <TextSpan apparence='s1' style={{
                        wordSpacing: '100vw'
                      }}>
                        {col.name}
                      </TextSpan>
                      <br />
                      <TextSpan apparence='s2' hint>
                        {col.subgroups?.map((x, i) => <span className="pl-1 pr-2">{x?.option}{i < (col.subgroups?.length - 1) && <></>}</span>)}
                      </TextSpan>
                    </TH>
                  )
                })}
              </TRH>
            </THEAD>
            <TBODY>
              {data?.data?.map((fleet, i) => (
                <TR key={i} isEvenColor={i % 2 === 0}>
                  <TDFirst isEvenColor={i % 2 === 0}>
                    <RowContent>
                      {fleet?.machine.image?.url ? (
                        <Img src={fleet?.machine.image?.url} alt={fleet?.machine.name} className='mt-1 mb-1' />
                      ) : (
                        <div style={{ minHeight: 50 }}></div>
                      )}
                      <TextSpan apparence='s2' className="ml-2">
                        {fleet.machine?.name}
                      </TextSpan>
                    </RowContent>
                  </TDFirst>
                  {data?.columns?.map((col, index) => {

                    const dataColumn = fleet?.groups?.find(x => x.code === col.code);

                    if (dataColumn) {
                      return (
                        <TD textAlign="center">
                          <Tracker
                            onClick={(item, index) => setDatashowModal(item)}
                            itens={dataColumn?.subgroups?.map((subg) => {
                              return (!subg?.status)
                                ? {
                                  isEmpty: true,
                                }
                                : {
                                  status: subg.status,
                                  tooltip: subg.name,
                                  data: subg,
                                  machine: fleet.machine,
                                }
                            })} />
                        </TD>)
                    }
                    else
                      return (<TD textAlign="center">
                      </TD>)
                  })}
                </TR>
              ))}
            </TBODY>
          </TABLE>}
        </CardBody>
        <SpinnerFull isLoading={isLoading} />
      </Card>
      <ModalListItens
        show={!!dataShowModal}
        onClose={() => setDatashowModal(undefined)}
        itemSelected={dataShowModal}
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

export default connect(mapStateToProps, undefined)(HeatmapPanel);
