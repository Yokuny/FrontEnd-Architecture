import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  Row,
  Spinner,
} from "@paljs/ui";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { Divide, Fetch, ItemInfoView, TextSpan } from "../../../components";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { getDiffDateString } from "../../travel/Utils";
import MetadataDetails from "./Metadata";
import { floatToStringFixedNormalize } from "../../../components/Utils";
import { TYPE_MACHINE } from "../../../constants";
import TimelineTravelStatus from "./StatusAsset/TimelineStatus/TimelineTravelStatus";
import { SkeletonThemed } from "../../../components/Skeleton";
import { setTravelDetailsSelected } from "../../../actions";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DetailsTravel = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState(false);
  const [analytics, setAnalytics] = React.useState();
  const [data, setData] = React.useState(false);

  const theme = useTheme();
  const intl = useIntl();

  const { item, isShowList } = props;

  React.useEffect(() => {
    getData(item.id);
  }, []);

  React.useEffect(() => {
    if (!data.dateTimeEnd && !data.analytics?.length && data.machine && data.dateTimeStart) {
      setIsLoadingAnalytics(true);
      Fetch.get(`/travel/fleet/unfinishedanalytics?idMachine=${data.machine?.id}&dateTimeStart=${data.dateTimeStart}&idTravel=${data.id}`)
        .then((response) => {
          setAnalytics(response.data)
          setIsLoadingAnalytics(false);
        })
        .catch((e) => {
          setIsLoadingAnalytics(false);
        });
    }
  }, [data])

  const getData = (idTravel) => {
    setIsLoading(true);
    Fetch.get(`/travel/details?id=${idTravel}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getDataAnalyticsList = () => {
    return (analytics?.data)?.length
      ? analytics?.data
      : data?.analytics?.data
  }

  const onClose = () => {
 props.setTravelDetailsSelected(undefined);
  }

  const analyticsList = getDataAnalyticsList();

  return (
    <>
      {isLoading ? (
        <div style={{ height: "100%" }}>
          <Spinner
            status="Primary"
            style={{ backgroundColor: theme.backgroundBasicColor1 }}
          />
        </div>
      ) : (
        <Card style={{ boxShadow: "none" }}>
          <CardHeader>
            <Row between="xs">
              <TextSpan apparence="s1" className="ml-4">
              {data.code}
              </TextSpan>
              <Button
                size="Small"
                status="Danger"
                appearance="ghost"
                style={{ marginTop: -6 }}
                onClick={onClose}
              >
                <EvaIcon name="close-outline" />
              </Button>
            </Row>
          </CardHeader>
          <CardBody>
            <Row>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <RowRead>
                  <EvaIcon
                    name="calendar-outline"
                    className="mt-1"
                    options={{
                      height: 17,
                      width: 16,
                      fill: theme.colorBasic600,
                    }}
                  />
                  <TextSpan
                    apparence="p2"
                    style={{ color: theme.colorBasic600, marginTop: 1.8 }}
                  >
                    <FormattedMessage id="departure" />
                  </TextSpan>
                </RowRead>
                <TextSpan apparence="s1">
                  {moment(data.dateTimeStart).format("DD MMM, HH:mm")}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <RowRead>
                  <EvaIcon
                    name="flag-outline"
                    className="mt-1"
                    options={{
                      height: 17,
                      width: 16,
                      fill: theme.colorBasic600,
                    }}
                  />
                  <TextSpan
                    apparence="p2"
                    style={{ color: theme.colorBasic600, marginTop: 1.8 }}
                  >
                    ETA
                  </TextSpan>
                </RowRead>
                <TextSpan apparence="s1">
                  {data?.metadata?.eta
                    ? `${moment(data.metadata.eta).format(
                      "DD MMM, HH:mm"
                    )}`
                    : `-`}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <RowRead>
                  <EvaIcon
                    name="arrow-circle-up-outline"
                    className="mt-1"
                    options={{
                      height: 17,
                      width: 16,
                      fill: theme.colorBasic600,
                    }}
                  />
                  <TextSpan
                    apparence="p2"
                    style={{ color: theme.colorBasic600, marginTop: 1.8 }}
                  >
                    <FormattedMessage id="source" />
                  </TextSpan>
                </RowRead>
                <TextSpan apparence="s1">
                  {`${data?.portPointStart?.code} - ${data?.portPointStart?.description}`}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <RowRead>
                  <EvaIcon
                    name="arrow-circle-down-outline"
                    className="mt-1"
                    options={{
                      height: 17,
                      width: 16,
                      fill: theme.colorBasic600,
                    }}
                  />
                  <TextSpan
                    apparence="p2"
                    style={{ color: theme.colorBasic600, marginTop: 1.8 }}
                  >
                    <FormattedMessage id="destiny.port" />
                  </TextSpan>
                </RowRead>
                <TextSpan apparence="s1">
                  {!!data.portPointDestiny
                    ? `${data?.portPointDestiny?.code} - ${data?.portPointDestiny?.description}`
                    : data.portPointEnd?.code
                      ? `${data?.portPointEnd?.code} - ${data?.portPointEnd?.description}`
                      : "-"}
                </TextSpan>
              </Col>
              {data?.dateTimeEnd && [
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <RowRead>
                    <EvaIcon
                      name="calendar-outline"
                      className="mt-1"
                      options={{
                        height: 17,
                        width: 16,
                        fill: theme.colorBasic600,
                      }}
                    />
                    <TextSpan
                      apparence="p2"
                      style={{
                        color: theme.colorBasic600,
                        marginTop: 1.8,
                      }}
                    >
                      <FormattedMessage id="arrival" />
                    </TextSpan>
                  </RowRead>
                  <TextSpan apparence="s1">
                    {`${moment(data?.dateTimeEnd).format(
                      "DD MMM, HH:mm"
                    )}`}
                  </TextSpan>
                </Col>,
                <Col breakPoint={{ md: 6 }}>
                  <RowRead>
                    <EvaIcon
                      name="clock-outline"
                      className="mt-1"
                      options={{
                        height: 17,
                        width: 16,
                        fill: theme.colorBasic600,
                      }}
                    />
                    <TextSpan
                      apparence="p2"
                      style={{
                        color: theme.colorBasic600,
                        marginTop: 1.8,
                      }}
                    >
                      <FormattedMessage id="duration" />
                    </TextSpan>
                  </RowRead>
                  <TextSpan apparence="s1">
                    {getDiffDateString(
                      data.dateTimeStart,
                      data.dateTimeEnd,
                      intl
                    )}
                  </TextSpan>
                </Col>,
              ]}
            </Row>
            {isLoadingAnalytics
              ? <>
                <Divide mh="-18px" />
                <Row center="xs" className="mt-4 mb-4">
                  <SkeletonThemed width={50} height={30} />
                  <div className="ml-4"></div>
                  <SkeletonThemed width={50} height={30} />
                  <div className="ml-4"></div>
                  <SkeletonThemed width={50} height={30} />
                </Row>
              </>
              : <>
                {!!analyticsList?.length && (
                  <>
                    <Divide mh="-18px" />
                    <Row middle="xs" center="xs" className="mt-4">
                      {analyticsList?.map((analytic, i) => (
                        <Col
                          key={`a-${i}`}
                          className="mb-4"
                          breakPoint={{ md: 6 }}
                        >
                          <ItemInfoView
                            title={analytic.description}
                            description={floatToStringFixedNormalize(
                              analytic.value
                            )}
                            footer={analytic.unit}
                          />
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </>
            }

            {!!data?.metadata &&
              (!data?.modelMachine?.typeMachine ||
                data?.modelMachine?.typeMachine !==
                TYPE_MACHINE.TRUCK) && (
                <>
                  <Divide mh="-18px" />
                  <MetadataDetails metadata={data?.metadata} />
                </>
              )}

            <Divide mh="-18px" />

            <TimelineTravelStatus
              key={`timeline_v_${props.item.id}_${data?.machine?.id}`}
              idMachine={data?.machine?.id}
              idTravel={props.item.id}
              dateMin={data?.dateTimeStart}
              dateMax={data?.dateTimeEnd}
            />
          </CardBody>
        </Card>
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setTravelDetailsSelected: (travel) => {
    dispatch(setTravelDetailsSelected(travel));
  },
});

export default connect(undefined, mapDispatchToProps)(DetailsTravel);
