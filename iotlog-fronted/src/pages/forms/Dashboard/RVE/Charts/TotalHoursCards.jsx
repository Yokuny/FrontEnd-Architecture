import { Button, Card, CardHeader, Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { CardNoShadow, TextSpan } from "../../../../../components";
import { floatToStringExtendDot } from "../../../../../components/Utils";


const StatsCard = styled(CardNoShadow)`
  h2, h3 {
    margin: 0.5rem 0;
    font-weight: 600;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.5rem;
  }

  display: flex;
  width: 100%;
  border-bottom: 0;

  ${({ theme, statusAccent }) => css`
    border-left: 6px solid ${theme[`color${statusAccent}500`] || theme.backgroundBasicColor4};
  `}
`;

const TotalHoursCards = ({ data }) => {

  const getTotalHours = (prefix) => {
    return data?.filter(x => prefix ? x.codigo?.value?.slice(0, 2) === prefix : true)?.reduce((sum, item) => sum + (item?.totalHoras || 0), 0);
  }

  const MAP_STATUS = {
    "OM": "Success",
    "NV": "Info",
    "PM": "Primary",
    "AM": "Warning",
    "IN": "Danger",
  }

  const getTypesStatus = () => {
    const types = data?.map(x => x.codigo?.value?.slice(0, 2)) || [];
    return [...new Set(types)];
  }

  const totalHours = getTotalHours("");

  return (<>
    <Row style={{ flexWrap: 'nowrap', overflowX: 'auto' }} className="m-0">
      <StatsCard statusAccent="Basic">
        <CardHeader>
          <TextSpan apparence="s2" hint>
            <FormattedMessage id="total.time" />
          </TextSpan>

          <Row className="m-0 pl-3 pt-2" end="xs" center="xs">
            {floatToStringExtendDot(totalHours, 2)} h
          </Row>
        </CardHeader>
      </StatsCard>
      {getTypesStatus().map((type) => (
        <StatsCard statusAccent={MAP_STATUS[type] || "Basic"} className="ml-3">
          <CardHeader>
            <TextSpan apparence="s2" hint>
              {type}
            </TextSpan>

            <Row className="m-0 pt-2" between="xs" center="xs">
              <Button
                appearance="outline"
                status={MAP_STATUS[type] || "Basic"}
                style={{ padding: '0.2rem 0.3rem', border: 0 }}
                size="Small">
                <TextSpan apparence="p2">
                  {floatToStringExtendDot((getTotalHours(type) * 100) / totalHours, 2)}%
                </TextSpan>
              </Button>
              <TextSpan apparence="s1" className="mr-1">
                {floatToStringExtendDot(getTotalHours(type), 2)} h
              </TextSpan>
            </Row>
          </CardHeader>
        </StatsCard>
      ))}
    </Row>
  </>)
}

export default TotalHoursCards;
