import { CardBody, Col, InputGroup, Row } from "@paljs/ui";
import {  useIntl } from "react-intl";
import { connect } from "react-redux";
import { CardNoShadow, LabelIcon } from "../../../components";
import InOutFence from "./events/InOutFence";
import PlatformProximity from "./events/PlatformProximity";
import LostConnectionSensor from "./events/LostConnection";
import StatusDistancePort from "./events/StatusDistancePort";

const Events = (props) => {
  const { idEnterprise, onChange, onActiveEvent, event } = props;

  const intl = useIntl();

  const hasPermissionViewPlatform = props.items?.some(
    (x) => x === "/view-platform-map"
  );

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 12 }} className="pt-4">
          <InOutFence
            idEnterprise={idEnterprise}
            onChange={onChange}
            onActiveEvent={onActiveEvent}
            event={event}
          />
          {hasPermissionViewPlatform && <PlatformProximity
            idEnterprise={idEnterprise}
            onChange={onChange}
            onActiveEvent={onActiveEvent}
            event={event}
          />}
          <LostConnectionSensor
            idEnterprise={idEnterprise}
            onChange={onChange}
            onActiveEvent={onActiveEvent}
            event={event}
          />
          <StatusDistancePort
            idEnterprise={idEnterprise}
            onChange={onChange}
            onActiveEvent={onActiveEvent}
            event={event}
          />
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <CardNoShadow style={{ marginBottom: 0 }}>
            <CardBody>
              <LabelIcon
                iconName="message-circle-outline"
                title={`${intl.formatMessage({ id: "description" })} *`} />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "message.description.placeholder",
                  })}
                  onChange={(text) =>
                    onChange("", "description", text.target.value)
                  }
                  value={event?.description}
                  maxLength={150}
                />
              </InputGroup>
            </CardBody>
          </CardNoShadow>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(Events);
