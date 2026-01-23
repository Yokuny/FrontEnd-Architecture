import { Col, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import { DateDiff } from "../../../../components/Date/DateDiff";
import { useFormatDecimal } from "../../../../components/Formatter";
import { Ocean, Tacometer } from "../../../../components/Icons";
import { SkeletonThemed } from "../../../../components/Skeleton";
import { TYPE_MACHINE } from "../../../../constants";

export default function DataIcons(props) {
    const { data, item, isLoading } = props;

  const theme = useTheme();
  const intl = useIntl();
  const { format } = useFormatDecimal();

  return (
    <>
      <Row className="mt-4 mb-2">
        <Col
          breakPoint={
            item?.modelMachine?.typeMachine !== TYPE_MACHINE.TRUCK
              ? { md: 4, xs: 4 }
              : { md: 12, xs: 12 }
          }
          className="col-flex-center"
        >
          <Tacometer
            style={{
              height: 25,
              width: 25,
              fill: theme.colorDanger700,
              color: theme.colorDanger700,
            }}
          />
          <TextSpan
            apparence="s2"
            className="mt-1"
            style={{
              lineHeight: "8px",
              color: theme.colorDanger700,
              whiteSpace: "nowrap",
            }}
          >
            {isLoading ? (
              <SkeletonThemed width={50} />
            ) : data?.data?.speed !== undefined ? (
              `${format(data?.data?.speed, 1)} ${
                data?.data?.unitySpeed ??
                intl.formatMessage({
                  id: "kn",
                })
              }`
            ) : (
              "-"
            )}
          </TextSpan>
          <TextSpan
            style={{ color: theme.colorDanger700 }}
            apparence="p3"
            className="mt-1"
          >
            <FormattedMessage id="speed" />
          </TextSpan>
        </Col>
        {item?.modelMachine?.typeMachine !== TYPE_MACHINE.TRUCK ? (
          <Col breakPoint={{ md: 4, xs: 4 }} className="col-flex-center">
            <Ocean
              style={{
                height: 25,
                width: 21,
                fill: theme.colorPrimary500,
              }}
            />

            <TextSpan
              apparence="s2"
              className="mt-1"
              style={{
                color: theme.colorPrimary500,
                lineHeight: "8px",
                whiteSpace: "nowrap",
              }}
            >
              {isLoading ? (
                <SkeletonThemed width={50} />
              ) : data?.data?.draught !== undefined ? (
                `${format(data?.data?.draught, 1)} m`
              ) : (
                "-"
              )}
            </TextSpan>
            <TextSpan
              style={{ color: theme.colorPrimary500 }}
              apparence="p3"
              className="mt-1"
            >
              <FormattedMessage id="draught" />
            </TextSpan>
          </Col>
        ) : (
          ""
        )}
        {item?.modelMachine?.typeMachine !== TYPE_MACHINE.TRUCK ? (
          <Col breakPoint={{ md: 4, xs: 4 }} className="col-flex-center">
            <EvaIcon
              name="compass-outline"
              options={{
                height: 27,
                width: 25,
                fill: theme.textBasicColor,
              }}
            />
            <TextSpan
              apparence="s2"
              className="mt-3"
              style={{
                color: theme.textBasicColor,
                lineHeight: "8px",
                whiteSpace: "nowrap",
              }}
            >
              {isLoading ? (
                <SkeletonThemed width={50} />
              ) : data?.data?.course !== undefined ? (
                `${format(data?.data?.course, 1)} º`
              ) : (
                "-"
              )}
            </TextSpan>
            <TextSpan
              style={{ color: theme.textBasicColor }}
              apparence="p3"
              className="mt-1"
            >
              <FormattedMessage id="course" />
            </TextSpan>
          </Col>
        ) : (
          ""
        )}
        <Col breakPoint={{ md: 12 }} className="col-flex-center mt-4">
          <Row center middle>
            <LabelIcon
              iconName="radio-outline"
              title={<FormattedMessage id="last.date.acronym" />}
            />
            <TextSpan apparence="s2" className="ml-1">
              {isLoading ? (
                <SkeletonThemed />
              ) : data?.data?.lastUpdate ? (
                <DateDiff dateInitial={data.data.lastUpdate} />
              ) : (
                "-"
              )}
            </TextSpan>
          </Row>
        </Col>
      </Row>
    </>
  );
}
