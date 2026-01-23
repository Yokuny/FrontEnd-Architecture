import { Col, Row, EvaIcon, Badge } from "@paljs/ui";
import moment from "moment";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { TextSpan, UserImage } from "../../../components";
import { ListItemStyle } from "./Base";
import { calculateValueBetweenDates } from "../../travel/Utils";
import { FormattedMessage } from "react-intl";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .progress-container {
    height: 0.2rem;
  }
`;

const ColEnd = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ColFlexStart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const ColFlexEnd = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  span {
    text-align: right;
  }
`

const BadgeTransparent = styled.div`
  ${({ theme, status }) => css`
    background-color: ${theme[`color${status}100`]};
    padding: 0.05rem 0.4rem;
    border-radius: 0.125rem;
  `}
`

const ItemStatusHistory = (props) => {
  const { item, onClick } = props;

  const getStatusAndValue = (voyage) => {
    if (!voyage) {
      return {
        status: "Basic",
        value: 0,
        text: "empty.information"
      };
    }
    if (voyage?.dateTimeEnd) {
      return {
        status: "Success",
        value: 100,
        text: "finished.travel"
      };
    }

    if (voyage?.metadata?.eta) {
      const late = new Date() > new Date(voyage.metadata.eta);
      return {
        status: late ? "Danger" : "Primary",
        value: late
          ? 90
          : calculateValueBetweenDates(
            voyage.dateTimeStart,
            voyage.metadata.eta
          ),
        text: late ? "late" : "scheduled"
      };
    }

    return {
      status: "Warning",
      value: 5,
      text: "in.progress"
    };
  };

  const isSelected = props.travelDetailsSelected?.id === item?.id;

  const portFinal = item?.portPointDestiny || item?.portPointEnd;
  const statusProps = getStatusAndValue(item);

  return (
    <>
      <ListItemStyle isSelected={isSelected} onClick={onClick}>
        <ColCenter breakPoint={{ md: 12 }} className="pt-2 pb-2 focus-in-hover">
          <Row between="xs" middle="xs" className="mb-3">
            <UserImage
              image={item?.machine?.image?.url}
              size="Small"
              name={item?.code}
              title={item?.machine?.name}
            />
            <BadgeTransparent
              status={statusProps.status}
            >
              <TextSpan
                status={statusProps.status}
                style={{ textTransform: "uppercase", fontWeight: "600", fontSize: "0.6rem" }}
              >
                <FormattedMessage id={statusProps.text} />
              </TextSpan>
            </BadgeTransparent>
          </Row>

          <Row between="xs" middle="xs" className="mt-2">
            <Col breakPoint={{ md: 5, xs: 5 }}>
              <RowRead>
                <EvaIcon
                  name="arrow-circle-up-outline"
                  status="Basic"
                  className="mt-1 mr-1"
                  options={{ height: 18, width: 18 }}
                />
                <ColFlexStart>
                  {!!item?.portPointStart && (
                    <>
                      {!!item?.portPointStart?.code && (
                        <TextSpan apparence="s2">
                          {item?.portPointStart?.code}
                        </TextSpan>
                      )}
                    </>
                  )}
                  <TextSpan apparence="p3" hint>
                    {`${moment(
                      item.metadata?.dateTimeArrival || item.dateTimeStart
                    ).format("DD MMM YYYY")}`}
                  </TextSpan>
                  <TextSpan apparence="p3" hint>
                    {`${moment(
                      item.metadata?.dateTimeArrival || item.dateTimeStart
                    ).format("HH:mm")}`}
                  </TextSpan>
                </ColFlexStart>
              </RowRead>
            </Col>
            <Col breakPoint={{ md: 2, xs: 2 }}>
              <EvaIcon
                name="arrow-forward-outline"
                status="Basic"
                options={{ height: 23, width: 23 }}
              />
            </Col>
            <ColEnd breakPoint={{ md: 5, xs: 5 }}>

              {!!item?.metadata?.eta && (
                <RowRead>
                  <ColFlexEnd>
                    {!!portFinal && (
                      <>
                        {!!portFinal?.code && (
                          <TextSpan apparence="s2">{portFinal?.code}</TextSpan>
                        )}
                      </>
                    )}
                    <TextSpan apparence="p3" hint>
                      <strong>ETA </strong>
                      {`${moment(item?.metadata?.eta).format("DD MMM YYYY")}`}
                    </TextSpan>
                    <TextSpan apparence="p3" hint>
                      {`${moment(item?.metadata?.eta).format("HH:mm")}`}
                    </TextSpan>
                  </ColFlexEnd>
                  <EvaIcon
                    name="flag-outline"
                    status="Basic"
                    className="mt-1 ml-1"
                    options={{ height: 18, width: 18 }}
                  />
                </RowRead>
              )}

              {!!(item?.metadata?.dateTimeArrival || item.dateTimeEnd) && (
                <RowRead>
                  <ColFlexEnd>
                    {!!portFinal && (
                      <>
                        {!!portFinal?.code && (
                          <TextSpan apparence="s2">{portFinal?.code}</TextSpan>
                        )}
                      </>
                    )}
                    <TextSpan apparence="p3" hint>
                      {`${moment(
                        item?.metadata?.dateTimeArrival || item.dateTimeEnd
                      ).format("DD MMM YYYY")}`}
                    </TextSpan>
                    <TextSpan apparence="p3" hint>
                      {`${moment(
                        item?.metadata?.dateTimeArrival || item.dateTimeEnd
                      ).format("HH:mm")}`}
                    </TextSpan>
                  </ColFlexEnd>
                  <EvaIcon
                    name="arrow-circle-down-outline"
                    status="Basic"
                    className="mt-1 ml-1"
                    options={{ height: 18, width: 18 }}
                  />
                </RowRead>
              )}
            </ColEnd>
          </Row>
        </ColCenter>
      </ListItemStyle>
    </>
  );
};

const mapStateToProps = (state) => ({
  travelDetailsSelected: state.fleet.travelDetailsSelected,
});

export default connect(mapStateToProps, undefined)(ItemStatusHistory);
