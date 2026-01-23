import { Card, CardBody, CardFooter, CardHeader, Col, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import React from "react";
import { Fetch, SpinnerFull, TextSpan } from "../../../components";
import Benchmark from "./Benchmark";
import { getStatus } from "./Utils";
import LoadingRows from "./LoadingRows";
import ModalAnomaly from "./ModalAnomaly";
import { useNavigate } from "react-router-dom";

const Img = styled.img`
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  object-fit: cover;
`;

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  flex-wrap: nowrap;

  .rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`

const FabricAnomaly = (props) => {


  const { idEnterprise } = props;

  const [showDetails, setShowDetails] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [modalSensors, setModalSensors] = React.useState(false);

  const [lastState, setLastState] = React.useState([]);

  const theme = useTheme();
  const navigate = useNavigate();
  const idMachinesRef = data?.map(x => x?.asset?.id);

  React.useEffect(() => {
    getData(idEnterprise);
  }, [idEnterprise]);

  React.useEffect(() => {
    const inter = setInterval(() => {
      getLastState(data);
    }, 30000);
    return () => {
      clearInterval(inter);
    }
  }, []);

  const getLastState = () => {
    const idMachines = idMachinesRef.current;
    if (!idMachines?.length) {
      return;
    }

    Fetch.get(`/ai/laststates?idMachine=${idMachines.join(",")}&idEnterprise=${idEnterprise}`)
      .then((response) => {
        setLastState(response.data);
      })
      .finally(() => {
      });
  }

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/ai/assets/last?idEnterprise=${idEnterprise}`)
      .then((response) => {
        idMachinesRef.current = response.data?.map(x => x?.asset?.id);
        setData(response.data);
        getLastState();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const getStatusByScore = (score) => {
    if (score >= 0.5) {
      return 'anomaly';
    }
    if (score >= 0.1) {
      return 'warning';
    }

    return 'ok';
  }

  const normalizeDataStatus = (data) => {
    return data
      ?.map((x) => {
        const lastStateItem = lastState?.filter((y) => y.idMachine === x?.asset?.id);
        const is_anomaly = lastStateItem?.find(x => x.idSensor === "is_anomaly")?.value;
        return {
          asset: x?.asset,
          operation: lastStateItem?.find(x => x.idSensor === "operation")?.value,
          status: is_anomaly !== undefined
            ? is_anomaly ? "anomaly" : "ok"
            : "off",
          is_anomaly: is_anomaly,
          important_features: x.important_features,
          anomaly_score: 0
        }
      })
      ?.map((x) => ({
        ...x,
        order: x?.operation && x?.operation !== "-" ? 1 : 0,
      }));
  }

  const getOperation = (operation, status) => {
    if (!operation) {
      return <TextSpan>-</TextSpan>
    }
    return <>
      <Content>
        <EvaIcon
          options={{
            fill:
              status === "anomaly"
                ? theme.colorDanger500
                : operation === "operating" ? theme.colorSuccess700 : theme.colorBasic500
          }}
          className={operation === "operating" ? "rotate" : ""}
          name={operation === "operating" ? "settings-2-outline" : "stop-circle-outline"}
        />
        <TextSpan apparence="s3"
          style={{
            textTransform: 'uppercase',
            borderRadius: '0.25rem',
            padding: '0.15rem 0.3rem',
            color: status === "anomaly"
              ? theme.colorDanger500
              : operation === "operating" ? theme.colorSuccess700 : theme.colorBasic500
            // ...(isDark ? {} : {
            //   backgroundColor: operation === "operating"
            //     ? theme.colorPrimary100
            //     : theme.colorWarning100,
            // })
          }}
        >
          <FormattedMessage id={operation} />
        </TextSpan>
      </Content>
    </>
  }

  const dataNormalized = normalizeDataStatus(data);

  return (<>
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          NexAI Anomaly Detector
        </TextSpan>
      </CardHeader>
      <CardBody style={{
        marginBottom: 0,
        paddingBottom: 0
      }}>
        <Benchmark
          data={dataNormalized}
        />
        <Row middle="xs" center="xs" className="mt-4">
          <Col breakPoint={{ md: 4 }} className="pb-2">
            <Row start="md" center="xs" middle="xs" className="m-0">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="machine" />
              </TextSpan>
            </Row>
          </Col>
          <Col breakPoint={{ md: 4 }} className="pb-2">
            <Row middle="xs" start="md" center="xs" className="m-0">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="mode.operation" />
              </TextSpan>
            </Row>
          </Col>
          <Col breakPoint={{ md: 4 }} className="pb-2">
            <Row middle="xs" start="md" center="xs" className="m-0">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="status" />
              </TextSpan>
            </Row>
          </Col>
        </Row>
        {isLoading &&
          <>
            <LoadingRows />
          </>
        }
        {!isLoading && dataNormalized
          ?.sort((a, b) => b.order - a.order)
          ?.map((assetData, i) => {
            return <Card style={{
              boxShadow: 'none',
              border: "none",
              marginBottom: 0,
              padding: 0,
            }}
              key={i}
            >
              <header
                style={
                  i === data.length - 1
                    ? { borderBottom: `none` }
                    : {}}
              >
                <Row middle="xs">
                  <Col breakPoint={{ md: 4 }} className="pb-1 pt-1">
                    <Row className="m-0" middle="xs" center="xs" start="md"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/remote-ihm?idAsset=${assetData?.asset?.id}&name=${assetData.asset?.name}&type=DGs`)}
                    >
                      <Img
                        src={assetData?.asset?.image?.url}
                        alt={assetData?.asset?.name} />
                      <ColFlex className="ml-3">
                        <TextSpan
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            marginBottom: '-0.25rem'
                          }}
                        >
                          {assetData?.asset?.name}
                        </TextSpan>
                        <TextSpan
                          apparence="p3"
                          hint>
                          {assetData?.asset?.modelMachine?.description}
                        </TextSpan>
                      </ColFlex>
                    </Row>
                  </Col>
                  <Col breakPoint={{ md: 4 }} className="pb-1 pt-1">
                    {getOperation(assetData?.operation, assetData?.status)}
                  </Col>
                  <Col breakPoint={{ md: 4 }} className="pb-1 pt-1">
                    <Row className="m-0" middle="xs" start="md" center="xs"
                      onClick={() => setModalSensors(
                        assetData?.important_features
                      )}
                      style={assetData?.is_anomaly ? { cursor: "pointer" } : {}}
                    >
                      {getStatus(assetData?.status, theme)}
                    </Row>
                  </Col>
                  {/*<Col breakPoint={{ md: 1 }}>
                 <div onClick={() => setShowDetails(prev => !prev)}>
                  <EvaIcon
                    name={!showDetails
                      ? "arrow-ios-downward-outline"
                      : "arrow-ios-upward-outline"}
                    options={{ fill: theme.colorBasic600 }}
                  />
                </div>
              </Col>*/}
                </Row>
              </header>
              {showDetails && <CardBody>
                teste
              </CardBody>}
            </Card>
          })}
      </CardBody>
      <CardFooter />
    </Card>
    <ModalAnomaly
      show={!!modalSensors}
      onRequestClose={() => setModalSensors(null)}
      sensorsFeatures={modalSensors} />
    <SpinnerFull
      isLoading={isLoading}
    />
  </>)
}

export default FabricAnomaly;
