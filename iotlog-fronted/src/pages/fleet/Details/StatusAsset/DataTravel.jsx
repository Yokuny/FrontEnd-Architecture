import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { LabelIcon, TextSpan } from "../../../../components";
import { getLatLonNormalize } from "../../../../components/Utils";
import { SkeletonThemed } from "../../../../components/Skeleton";
import Proximity from "../../Proximity";

export default function DataTravel(props) {
  const { data, idMachine } = props;

  const getPortCodeName = (port) => {
    return `${port?.code} - ${port?.description}`;
  };

  const getDestinyPreference = (detailsInternal) => {
    if (detailsInternal?.travel?.portPointDestiny) {
      return getPortCodeName(detailsInternal?.travel?.portPointDestiny);
    }

    if (detailsInternal?.travel?.portPointEnd) {
      return getPortCodeName(detailsInternal?.travel?.portPointEnd);
    }

    return " -";
  };

  return (
    <>
      <Row className={data?.travel && "mt-4"}>
        {data?.travel && [
          <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName="cube-outline"
              title={<FormattedMessage id="travel" />}
            />
            <TextSpan apparence="s1">{data.travel?.code || "-"}</TextSpan>
          </Col>,
          <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName="calendar-outline"
              title={<FormattedMessage id="departure" />}
            />
            <TextSpan apparence="s1">
              {data?.travel?.dateTimeStart
                ? moment(data?.travel?.dateTimeStart).format("DD MMM, HH:mm")
                : "-"}
            </TextSpan>
          </Col>,
          <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
            <LabelIcon iconName="flag-outline" title="ETA" />
            <TextSpan apparence="s1">
              {data?.travel?.metadata?.eta
                ? `${moment(data?.travel?.metadata.eta).format("DD MMM, HH:mm")}`
                : `-`}
            </TextSpan>
          </Col>,
          <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName="arrow-circle-up-outline"
              title={<FormattedMessage id="source" />}
            />
            <TextSpan apparence="s1">
              {data?.travel?.portPointStart
                ? `${data?.travel?.portPointStart?.code} - ${data?.travel?.portPointStart?.description}`
                : "-"}
            </TextSpan>
          </Col>,
          <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName="navigation-2-outline"
              title={<FormattedMessage id="destiny.port" />}
            />
            <TextSpan apparence="s1">{getDestinyPreference(data)}</TextSpan>
          </Col>,
        ]}
        <Col
          breakPoint={data?.travel ? { md: 6, xs: 6 } : { md: 12, xs: 12 }}
          className="mb-4"
        >
          <LabelIcon
            iconName="pin-outline"
            title={<FormattedMessage id="proximity" />}
          />
          <TextSpan apparence="s1">
            {data?.data?.position ? (
              <Proximity
                id={idMachine}
                latitude={getLatLonNormalize(data.data.position)[0]}
                longitude={getLatLonNormalize(data.data.position)[1]}
                showFlag={true}
              />
            ) : (
              <SkeletonThemed />
            )}
          </TextSpan>
        </Col>
      </Row>
    </>
  );
}
