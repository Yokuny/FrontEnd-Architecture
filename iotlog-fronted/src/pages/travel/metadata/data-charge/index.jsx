import { Card, CardHeader, Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { addDataVoyage } from "../../../../actions";
import {
  LabelIcon,
  SelectMachine,
  TextSpan,
  Toggle,
} from "../../../../components";
import {
  Container,
  ShipLoadFilled,
  Vessel,
} from "../../../../components/Icons";
import { InputDecimal } from "../../../../components/Inputs/InputDecimal";
import { getIsShowBarge } from "../common";

const RowContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const CardTitle = styled(CardHeader)`
  display: flex;
  align-items: center;
`;

const DataCharge = (props) => {
  const { data, addDataVoyage } = props;
  const theme = useTheme();
  const intl = useIntl();

  const onChangeData = (prop, value) => {
    addDataVoyage({
      load: {
        ...(data?.load || {}),
        [prop]: value,
      },
    });
  };

  const isShowBarge = getIsShowBarge(data?.machine?.model?.description);

  return (
    <>
      <Col breakPoint={{ md: 4 }}>
        <Card>
          <CardTitle>
            <ShipLoadFilled
              style={{
                height: 18,
                width: 16,
                fill: theme.textBasicColor,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <TextSpan className="ml-2" apparence="s1">
              <FormattedMessage id="load" />
            </TextSpan>
          </CardTitle>

          {isShowBarge && (
            <Col breakPoint={{ md: 12 }} className="mb-4 mt-2">
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
                title={<FormattedMessage id="barge" />}
              />
              <div className="mt-1"></div>
              <SelectMachine
                value={data?.load?.bargeLink ?? undefined}
                onChange={(value) => onChangeData("bargeLink", value)}
                filterQuery={`idModel[]=12caa050-407e-49bc-b340-7409a3c105b3`}
                placeholder={"select.barge"}
                key={`s_mo_123`}
              />
            </Col>
          )}
          <Col
            breakPoint={{ md: 12 }}
            className={`mb-4 ${!isShowBarge && `mt-2`}`}
          >
            <LabelIcon
              renderIcon={() => (
                <ShipLoadFilled
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
              title={`${intl.formatMessage({ id: "load" })}`}
            />
            <RowContent className="mt-4 mb-1 ml-1 mr-1">
              <TextSpan apparence="s2">
                <FormattedMessage id={"filled"} />
              </TextSpan>
              <Toggle
                checked={!!data?.load?.isFullLoad}
                onChange={() =>
                  onChangeData("isFullLoad", !data?.load?.isFullLoad)
                }
              />
            </RowContent>
          </Col>
          <Col breakPoint={{ md: 12 }} className="mb-4">
            <LabelIcon
              renderIcon={() => (
                <Container
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
              title={`${intl.formatMessage({ id: "load.weight" })} (t)`}
            />
            <InputGroup fullWidth className="mt-1">
              <InputDecimal
                value={data?.load?.loadWeight}
                onChange={(e) => onChangeData("loadWeight", e)}
                placeholder={`${intl.formatMessage({
                  id: "load.weight",
                })} (t)`}
              />
            </InputGroup>
          </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(DataCharge);
