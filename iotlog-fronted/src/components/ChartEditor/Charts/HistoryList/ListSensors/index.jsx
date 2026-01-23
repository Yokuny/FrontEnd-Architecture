import React from 'react';
import { Button, Checkbox, EvaIcon, InputGroup, List, ListItem } from "@paljs/ui";
import styled, { css } from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { debounce } from "underscore";
import TextSpan from "../../../../Text/TextSpan";
import { Fetch } from '../../../../Fetch';
import { SkeletonThemed } from '../../../../Skeleton';

const Content = styled.div`
  ${({ noMarginTop }) => noMarginTop ? 'margin-top: 0;' : 'margin-top: 35px;  height: 83%;'}


  input {
    line-height: 0.5rem;
  }
`

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

const ListStyled = styled(List)`
  overflow-y: auto;
  height: 70%;

  div {
    cursor: pointer;
  }

  ${({ theme }) => css`
    ::-webkit-scrollbar-thumb {
      background: ${theme.scrollbarColor};
      cursor: pointer;
    }
    ::-webkit-scrollbar-track {
      background: ${theme.scrollbarBackgroundColor};
    }
    ::-webkit-scrollbar {
    width: ${theme.scrollbarWidth};
    height: ${theme.scrollbarWidth};
    }
  `}
`

const sensorsNotAllowed = ["eta","destination","statusnavigation","currentport","nextport"];

export default function ListSensors(props) {

  const { idMachine, sensorsFilter, onRemove, onRemoveAll, onAdd, isLoadingData } = props;

  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [sensors, setSensors] = React.useState();
  const [search, setSearch] = React.useState();

  React.useEffect(() => {
    if (idMachine)
      getData(idMachine);

    return () => {
      setSensors([])
    }
  }, [idMachine])

  const getData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(
      `/machine/sensors?id=${idMachine}`
    )
      .then((res) => {
        setSensors(res.data
          ?.filter(x => x?.type !== "string" && x?.type !== "date" && !sensorsNotAllowed.includes(x?.sensorId?.toLowerCase()))
          ?.sort((a, b) => a?.sensor?.localeCompare(b?.sensor)));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false)
      });
  }

  const changeCheck = (e, sensorId) => {
    e.preventDefault();
    if (isLoadingData)
      return;
    const hasSelected = (sensorsFilter?.includes(sensorId));
    if (hasSelected) {
      onRemove(sensorId);
      return;
    }

    onAdd(sensorId);
  }

  const changeValueDebounced = debounce((value) => {
    setSearch(value)
  }, 500);

  const filterSensors = () => {
    if (search) {
      return sensors?.filter(x =>
        x?.sensor?.toUpperCase().includes(search.toUpperCase())
        ||
        x?.sensorId?.toUpperCase().includes(search.toUpperCase())
      )
    }

    return sensors;
  }

  return (<>
    <Content noMarginTop={!!props.noMarginTop}>
      <InputGroup fullWidth>
        <input
          type="text"
          disabled={isLoadingData}
          placeholder={intl.formatMessage({ id: "search" })}
          onChange={(e) => changeValueDebounced(e.target.value)}
        />
        <ContainerIcon onClick={() => { }}>
          <EvaIcon name="search-outline" status="Basic" />
        </ContainerIcon>
      </InputGroup>

      {!!sensorsFilter?.length && <>
        <Button className='mt-2 flex-between'
          onClick={onRemoveAll}
          disabled={isLoadingData}
          appearance='ghost'
          status="Danger"
          size="Tiny"
          style={{ padding: 2 }}>
          <EvaIcon name="close-square-outline" className='mr-1' />
          <FormattedMessage id="clear.checked.all" />
        </Button>
      </>}

      <ListStyled className="mt-1" style={props.styleList || {}}>
        {isLoading
          ? <>
            <ListItem className="p-2">
              <SkeletonThemed width={50} />
            </ListItem>
            <ListItem className="p-2">
              <SkeletonThemed width={50} />
            </ListItem>
            <ListItem className="p-2">
              <SkeletonThemed width={50} />
            </ListItem>
          </>
          : <>
            {filterSensors()?.map((x, i) =>
              <ListItem
                style={i === 0 ? { borderTop: 0 } : {}}
                className="p-2"
                key={`i-${i}`}
                onClick={(e) => isLoadingData ? () => { } : changeCheck(e, x?.sensorId)}>
                <Checkbox
                  disabled={isLoadingData}
                  checked={sensorsFilter?.includes(x?.sensorId)}
                  onChange={(e) => changeCheck(e, x?.sensorId)} />
                <TextSpan apparence="s2" className="ml-2">
                  {x?.sensor}
                </TextSpan>
              </ListItem>)}
          </>
        }
      </ListStyled>
    </Content>
  </>)
}
