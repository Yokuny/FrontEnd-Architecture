import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { LabelIcon, TextSpan } from "../../../../components";
import { TYPE_MACHINE } from "../../../../constants";

export default function DataTitle(props) {
  const { data, item } = props;
  return (
    <>
      <Row>
        <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
          <LabelIcon
            iconName="radio-outline"
            title={
              item?.modelMachine?.typeMachine === TYPE_MACHINE.TRUCK
                ? "ETA"
                : "ETA AIS"
            }
          />
          <TextSpan apparence="s1">
            {data?.data?.eta && moment(data?.data?.eta).isAfter(moment())
              ? `${moment(data?.data?.eta).format("DD MMM, HH:mm")}`
              : `-`}
          </TextSpan>
        </Col>
        <Col breakPoint={{ md: 6, xs: 6 }} className="mb-4">
          <LabelIcon
            iconName="radio-outline"
            title={
              <>
                <FormattedMessage id="destiny.port" />{" "}
                {item?.modelMachine?.typeMachine !== TYPE_MACHINE.TRUCK
                  ? "AIS"
                  : ""}
              </>
            }
          />
          <TextSpan apparence="s1">
            {data?.data?.eta &&
            moment(data?.data?.eta).isAfter(moment()) &&
            data?.data?.destiny
              ? data?.data?.destiny
              : "-"}
          </TextSpan>
        </Col>
      </Row>
    </>
  );
}
