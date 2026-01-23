import { Card, CardBody, CardFooter, CardHeader, Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import React from "react";
import { connect } from "react-redux";
import { Fetch, SpinnerFull, TextSpan } from "../../../components";
import Benchmark from "./Benchmark";
import { getStatus } from "./Utils";
import InputFileCsv from "./InputFileCsv";
import LoadingRows from "./LoadingRows";
import ModalAnomaly from "./ModalAnomaly";
import FabricAnomaly from "./FabricAnomaly";

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

const PKC_ID = "02bad20d-039e-4abf-8aeb-5308c41ffee4"

const AnomalyDetectorAI = (props) => {

  const theme = useTheme();

  const [showDetails, setShowDetails] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [modalSensors, setModalSensors] = React.useState(false);



  React.useEffect(() => {
    if (props.isReady && props.enterprises?.length) {
      const idEnterprise = props.enterprises[0].id;
      if (idEnterprise !== PKC_ID) {
        getData(idEnterprise);
      }
    }
    else {
      setData([]);
    }
  }, [props.isReady, props.enterprises]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/ai/assets/last?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(response.data);
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
    //Parado, Manobras, Reboque, Navegação

    return data
      ?.map((x) => {
        // if (x?.asset?.name === "WS CASTOR") {
        //   x.operation = "Navegação";
        //   x.status = "anomaly";
        //   x.order = 1;
        // }

        return {
          asset: x?.asset,
          operation: x?.operation,
          status: x.is_anomaly !== undefined
            ? x.is_anomaly ? "anomaly" : "ok"
            : "off",
          is_anomaly: x.is_anomaly,
          important_features: x.important_features,
          anomaly_score: 0
        }
      })
      ?.map((x) => ({
        ...x,
        order: x?.operation && x?.operation !== "-" ? 1 : 0,
      }));
  }

  const onHandleData = (data) => {

    Fetch.post(`/ai/classify`, {
      idEnterprise: props.enterprises[0].id,
      idMachine: "710006717",
      data: [data]
    })
      .then((response) => {
        if (!response.data?.length) {
          return;
        }
        setData(prev => {
          const itemIndexed = prev.findIndex(x => x.asset.name === "WS CASTOR");
          const item = prev[itemIndexed];
          item.anomaly_score = response.data[0].anomaly_score;
          item.operation = response.data[0].operation;
          item.is_anomaly = response.data[0].is_anomaly;
          item.important_features = response.data[0].important_features;
          return [
            ...prev.slice(0, itemIndexed),
            item,
            ...prev.slice(itemIndexed + 1)
          ]
        });
      });

  }

  const dataNormalized = normalizeDataStatus(data);


  if (!props.enterprises?.length) {
    return
  }

  const idEnterprise = props.enterprises[0].id;
  if (idEnterprise === PKC_ID) {
    return (<FabricAnomaly
      idEnterprise={idEnterprise}
    />);
  }

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
                    <Row className="m-0" middle="xs" center="xs" start="md">
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
                    <Row className="m-0" middle="xs" start="md" center="xs">
                      <TextSpan
                        hint={!assetData?.operation}
                        apparence={"s2"}>
                        {assetData?.operation || "-"}
                      </TextSpan>
                    </Row>
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
      {!isLoading && !!dataNormalized?.length && <CardFooter>
        <InputFileCsv
          onHandleData={onHandleData}
        />
      </CardFooter>}
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

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(AnomalyDetectorAI);
