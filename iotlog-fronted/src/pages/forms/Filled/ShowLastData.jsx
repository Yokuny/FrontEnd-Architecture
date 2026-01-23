import React from 'react'
import { Col, Row } from "@paljs/ui";
import styled from "styled-components";
import moment from 'moment';
import { connect } from 'react-redux';
import { setLastFilledForm } from '../../../actions';
import { Fetch, LabelIcon, TextSpan } from "../../../components";
import { useIntl } from 'react-intl';

const DivBorder = styled.div`
  ${({ theme }) => `
    border: 1px solid ${theme.orderBasicColor4};
    border-radius: 2px;
    background-color: ${theme.backgroundBasicColor2};
  `}
`

function ShowLastData(props) {

  const { idMachine, dateEnd, lastFilled } = props;

  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (idMachine) {
      getLastData(idMachine)
    } else {
      props.setLastFilledForm(undefined);
    }

    return () => {
      props.setLastFilledForm(undefined);
    }
  }, [idMachine])


  const getLastData = (idMachine) => {
    Fetch.get(`/formdata/last?idMachine=${idMachine}`)
      .then(response => {
        props.setLastFilledForm(response.data)
      })
      .catch(e => {

      });
  }

  return (
    <>
      {lastFilled && <Col breakPoint={{ md: 12 }} className="mb-4">
        <DivBorder className="pl-3 pr-3 pt-2 pb-1">
          <LabelIcon
            title={<TextSpan apparence="s2">Último registro</TextSpan>}
          />
          <Row className="mb-2">
            <Col breakPoint={{ md: 2 }} className="pl-4">
              <LabelIcon
                title={"Atendimento"}
              />
              <TextSpan apparence="s1">{lastFilled?.atendimento}</TextSpan>
            </Col>
            <Col breakPoint={{ md: 4 }}>
              <LabelIcon
                title={"Escala"}
              />
              <TextSpan apparence="s1">{lastFilled?.escala?.label}</TextSpan>
            </Col>
            <Col breakPoint={{ md: 2 }}>
              <LabelIcon
                title={"Operação"}
              />
              <TextSpan apparence="s1">{lastFilled?.codigoOperacional?.value}</TextSpan>
            </Col>
            <Col breakPoint={{ md: 4 }}>
              <LabelIcon
                title={"Data fim"}
              />
              <TextSpan apparence="s1">{
                lastFilled?.dataHoraFim
                  ? moment(lastFilled?.dataHoraFim).format("DD/MM/YYYY HH:mm")
                  : dateEnd
                    ? `${intl.formatMessage({ id: 'will.be.filled' })}: ${moment(dateEnd).format("DD/MM/YYYY HH:mm")}`
                    : '-'}</TextSpan>
            </Col>
          </Row>
        </DivBorder>
      </Col>}
    </>
  )
}


const mapStateToProps = (state) => ({
  lastFilled: state.formBoard.lastFilled,
});

const mapDispatchToProps = (dispatch) => ({
  setLastFilledForm: (fields) => {
    dispatch(setLastFilledForm(fields));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowLastData);
