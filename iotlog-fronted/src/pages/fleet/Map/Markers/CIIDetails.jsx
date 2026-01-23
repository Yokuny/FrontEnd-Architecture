import React from 'react'
import styled from 'styled-components';
import CIIRating, { getFactorByYear } from '../../../statistics/CII/CIIRating';
import { Fetch } from '../../../../components';
import { Tooltip } from '@paljs/ui';

const Content = styled.div`
position: fixed;
top: 68px;
right: 8px;
`

export default function CIIDetails(props) {

  const [data, setData] = React.useState({});

  React.useLayoutEffect(() => {
    if (props.idMachine)
      getData(props.idMachine);
  }, [])

  const getData = async (idMachine) => {
    try {
      const response = await Fetch.get(`/machine/cii?id=${idMachine}`);
      setData(response.data);
    }
    catch (error) {
    }
  }

  return <>
    <Content>
      {!!data?.cii &&
        <Tooltip
          placement="top"
          content={"2023 (5%)"}
          trigger="hint"
        >
          <CIIRating
            bordered
            dd={data?.dd}
            ciiAttained={data?.cii}
            ciiReq={data?.ciiRef * ((100 - getFactorByYear()) / 100)}
          />
        </Tooltip>}
    </Content>
  </>
}
