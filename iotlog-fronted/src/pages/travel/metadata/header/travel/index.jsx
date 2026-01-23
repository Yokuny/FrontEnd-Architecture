import {
  Card,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
} from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { addDataVoyage } from "../../../../../actions";
import {
  DateTime,
  LabelIcon,
  SelectMachine,
  SelectPort,
  TextSpan,
} from "../../../../../components";
import { Crane, Vessel } from "../../../../../components/Icons";

const ColDate = styled(Col)`
  input {
    line-height: 1.1rem;
  }

  a svg {
    top: -7px;
    position: absolute;
    right: -5px;
  }
`;

const CardTitle = styled(CardHeader)`
  display: flex;
  align-items: center;
`;

const HeaderTravelMetadata = (props) => {
  const { data, addDataVoyage } = props;
  const intl = useIntl();
  const theme = useTheme();

  const onChange = (prop, value) => {
    addDataVoyage({
      ...data,
      [prop]: value,
    });
  };

  return (
    <>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <LabelIcon
          iconName="cube-outline"
          title={<FormattedMessage id="code.voyage" />}
        />
        <InputGroup fullWidth className="mt-1">
          <input
            value={data?.code}
            onChange={(e) => onChange("code", e.target.value)}
            type="text"
            placeholder={intl.formatMessage({ id: "code.voyage" })}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 9 }} className="mb-4 pt-1">
        <LabelIcon
          renderIcon={() => (
            <Vessel
              style={{
                height: 13,
                width: 13,
                color: theme.textHintColor,
                marginRight: 5,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
          )}
          title={<FormattedMessage id="vessel" />}
        />
        <div className="mt-1"></div>
        <SelectMachine
          value={
            data?.machine
              ? {
                  label: `${
                    data?.machine?.code ? `${data?.machine?.code} - ` : ""
                  }${data?.machine?.name}`,
                }
              : null
          }
          disabled
        />
      </Col>

      <Col breakPoint={{ md: 4 }}>
        <Card>
          <CardTitle>
            <EvaIcon
              name="arrow-circle-up"
              options={{ fill: theme.colorDanger500 }}
            />
            <TextSpan className="ml-2" apparence="s1">
              <FormattedMessage id="source" />
            </TextSpan>
          </CardTitle>
          <Col breakPoint={{ md: 12 }} className="mt-2 mb-4">
            <LabelIcon
              renderIcon={() => (
                <Crane
                  style={{
                    height: 13,
                    width: 13,
                    fill: theme.textHintColor,
                    marginRight: 5,
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                />
              )}
              title={<FormattedMessage id="port" />}
            />
            <SelectPort
              className="mt-1"
              value={data?.portPointStart}
              onChange={(e) => onChange("portPointStart", e)}
              placeholder="source"
              key={"pt_src"}
            />
          </Col>
          <ColDate breakPoint={{ md: 12 }} className="mb-4">
            <LabelIcon
              iconName="calendar-outline"
              title={<FormattedMessage id="datetime.out" />}
            />
            <DateTime
              className="mt-1"
              onChangeTime={(value) => onChange("dateTimeDepartureTime", value)}
              onChangeDate={(value) => onChange("dateTimeDepartureDate", value)}
              breakPointDate={{ md: 7 }}
              breakPointTime={{ md: 5 }}
              min={data?.dateTimeStart}
              date={data?.dateTimeDepartureDate}
              time={data?.dateTimeDepartureTime}
            />
          </ColDate>
        </Card>
      </Col>

      <Col breakPoint={{ md: 4 }}>
        <Card>
          <CardTitle>
            <EvaIcon
              name="arrow-circle-down"
              options={{ fill: theme.colorSuccess500 }}
            />
            <TextSpan className="ml-2" apparence="s1">
              <FormattedMessage id="destiny.port" />
            </TextSpan>
          </CardTitle>
          <Col breakPoint={{ md: 12 }} className="mt-2 mb-4">
            <LabelIcon
              renderIcon={() => (
                <Crane
                  style={{
                    height: 13,
                    width: 13,
                    fill: theme.textHintColor,
                    marginRight: 5,
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                />
              )}
              title={<FormattedMessage id="port" />}
            />
            <SelectPort
              className="mt-1"
              value={data?.portDestiny}
              onChange={(e) => onChange("portDestiny", e)}
              placeholder="destiny.port"
              key={"pt_dest"}
            />
          </Col>
          <ColDate breakPoint={{ md: 12 }} className="mb-4">
            <LabelIcon iconName="flag-outline" title="ETA" />
            <DateTime
              className="mt-1"
              onChangeTime={(value) => onChange("etaTime", value)}
              onChangeDate={(time) => onChange("etaDate", time)}
              min={data?.dateTimeStart}
              date={data?.etaDate}
              time={data?.etaTime}
              breakPointDate={{ md: 7 }}
              breakPointTime={{ md: 5 }}
            />
          </ColDate>
          {/* <ColDate breakPoint={{ md: 12 }} className="mb-4">
            <LabelIcon
              iconName="calendar-outline"
              title={<FormattedMessage id="datetime.in" />}
            />
            <DateTime
              className="mt-1"
              onChangeTime={(value) => onChange("dateTimeArrivalTime", value)}
              onChangeDate={(time) => onChange("dateTimeArrivalDate", time)}
              min={data?.dateTimeStart}
              date={data?.dateTimeArrivalDate}
              time={data?.dateTimeArrivalTime}
              breakPointDate={{ md: 7 }}
              breakPointTime={{ md: 5 }}
            />
          </ColDate> */}
        </Card>
      </Col>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.voyage.data,
});

const mapDispatchToProps = (dispatch) => ({
  addDataVoyage: (item) => {
    dispatch(addDataVoyage(item));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderTravelMetadata);
