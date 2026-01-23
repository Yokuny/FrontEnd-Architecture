import React from 'react';
import { Button, CardFooter, Checkbox, EvaIcon, InputGroup, List, ListItem, Row, Tooltip } from "@paljs/ui";
import styled, { css } from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { debounce } from "underscore";
import { Fetch, Modal, TextSpan } from '../../components';
import { SkeletonThemed } from '../../components/Skeleton';


const Content = styled.div`

  input {
    line-height: 0.5rem;
  }

  input svg {
    margin-top: -3px;
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

const sensorsNotAllowed = ["eta", "destination", "statusnavigation", "currentport", "nextport"];

export default function ListSensors(props) {

  const { idMachine, onAddManySensors, isLoadingData } = props;

  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [sensors, setSensors] = React.useState();
  const [search, setSearch] = React.useState();
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [sensorsFilter, setSensorsFilter] = React.useState(props.sensorsFilter || []);

  React.useEffect(() => {
    if (idMachine)
      getData(idMachine);

    return () => {
      setSensors([])
    }
  }, [idMachine])

  const getData = (idMachine) => {
    setIsLoading(true);
    setSensorsFilter([]);
    Fetch.get(
      `/sensor/asset/${idMachine}`
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
    setSensorsFilter(prevState => [...prevState, sensorId]);
    // onAdd(sensorId);
  }

  const onRemove = (idSensor) => {
    setSensorsFilter(prevState => prevState?.filter(x => x !== idSensor) || []);
  }

  const onRemoveAll = () => {
    setSensorsFilter([]);
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

  const onSave = () => {
    setSearch("");
    onAddManySensors(sensorsFilter);
    setIsOpenModal(false);
  }

  const onCloseModal = () => {
    setSearch("");
    setIsOpenModal(false);
    setSensorsFilter(props.sensorsFilter || []);
  }

  return (<>
    <Content className="mb-2">
      <Row center='xs'>
        <Button
          size="Tiny"
          appearance="outline"
          className={`flex-between mt-2 ${!props?.sensorsFilter?.length ? "mb-2" : ""}`}
          onClick={() => setIsOpenModal(!isOpenModal)}
        >
          <EvaIcon name="flash-outline" />
          <FormattedMessage id="select.sensors" />
        </Button>
      </Row>
      {!!props?.sensorsFilter?.length &&
        <Tooltip
          placement='left'
          status='Basic'
          content={<ul>
            {sensorsFilter?.map(x => <li key={x}>
              <TextSpan apparence='p2'>
                {sensors?.find(s => s.sensorId === x)?.sensor || x}
              </TextSpan>
            </li>)
            }
          </ul>}
          trigger='hover'
        >
          <Row className="mb-2 pt-2" middle='xs' center='xs'>
            <TextSpan apparence='s2' style={{ marginTop: 2 }}>
              {props?.sensorsFilter?.length > 0 ? props?.sensorsFilter?.length : 0}
            </TextSpan>
            <TextSpan apparence='p2' className="ml-1">
              <FormattedMessage id={props?.sensorsFilter?.length > 1 ? "selecteds" : "selected"} />
            </TextSpan>
          </Row></Tooltip>}
      <Modal show={isOpenModal}
        title={intl.formatMessage({ id: "select.sensors" })}
        onClose={() => onCloseModal()}
        renderFooter={() => <CardFooter>
          <Row between="xs" className="m-0">
            <Button
              appearance="ghost"
              status="Basic"
              size="Tiny"
              className="flex-between"
              onClick={() => onCloseModal()}
              disabled={isLoadingData}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage id="cancel" />
            </Button>
            {!!sensorsFilter?.length && <>
              <Button className='mt-2 flex-between'
                onClick={onRemoveAll}
                disabled={isLoadingData}
                appearance='ghost'
                status="Warning"
                size="Tiny"
                style={{ padding: 2 }}>
                <EvaIcon name="close-square-outline" className='mr-1' />
                <FormattedMessage id="clear.checked.all" />
              </Button>
            </>}
            <Button
              status="Info"
              size="Small"
              className="flex-between"
              onClick={() => onSave()}
              disabled={isLoadingData}
            >
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>}
      >
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
              {filterSensors()
                ?.sort((a, b) => {
                  const aChecked = sensorsFilter?.includes(a?.sensorId);
                  const bChecked = sensorsFilter?.includes(b?.sensorId);

                  if (aChecked !== bChecked) {
                    return aChecked ? -1 : 1;
                  }

                  return a.sensor.localeCompare(b.sensor);
                })
                ?.map((x, i) =>
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
      </Modal>
    </Content>

  </>)
}
