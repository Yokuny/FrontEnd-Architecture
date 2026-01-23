import React from "react";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui";
import { TextSpan } from "../../../../components";
import { TD, TR } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { ListType } from "../../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";


const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;


const RowEnd = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  margin-bottom: 2px;
  align-content: center;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;


const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
`;

const TDFirst = styled(TD)`
  position: sticky;
  left: 0;
  z-index: 1;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  padding-left: 1rem;
  min-width: 200px;
`;

const TDLast = styled(TD)`
  position: sticky;
  right: 0;
  z-index: 1;
  background: ${props => (props.isEvenColor ? props.theme.backgroundBasicColor1 : props.theme.backgroundBasicColor2)};
  min-width: 150px;
  padding-right: 1rem;
`;


const ItemRowStatistic = (props) => {


  const { item, onClick, index, unit } = props;

  const totalMinutes = item?.listTimeStatus?.reduce(
    (a, b) => a + ((b?.minutes || 0) / 60),
    0
  );

  const totalConsumption = item?.listTimeStatus?.reduce(
    (a, b) => a + ((b?.consumption || 0)),
    0
  );



  return (
    <>
      <TR
        isEvenColor={index % 2 === 0}
        onClick={() => { if (onClick) onClick() }}
        style={onClick && { cursor: 'pointer' }}>
        <TDFirst textAlign="center" isEvenColor={index % 2 === 0}>
          <Row className="pl-2 pt-2 pb-2">
            {item?.machine?.image?.url ? (
              <Img src={item?.machine?.image?.url} alt={item?.machine?.name} />
            ) : (
              <div style={{ minHeight: 50 }} />
            )}
            <TextSpan apparence="s2" className="ml-2"
            style={{ textAlign: 'left' }}
            >{item?.machine?.name}</TextSpan>
          </Row>
        </TDFirst>
        {ListType?.map((x, i) => {

          const itemStatus = item?.listTimeStatus?.find(
            (z) => x.accept.includes(z.status?.toLowerCase())
          );

          const percentual = itemStatus?.minutes ? ((itemStatus.minutes / 60) * 100) / totalMinutes : 0;

          return (
            <>
              <TD key={`bIz-${i}`} style={{ minWidth: 180 }}>
                <Col>
                  <RowEnd>
                    <TextSpan apparence="p3" hint>
                      {`${floatToStringExtendDot(percentual, 0)}`}%
                    </TextSpan>
                  </RowEnd>
                  <RowEnd>
                    <TextSpan apparence="p2">{`${floatToStringExtendDot((itemStatus?.minutes || 0) / 60, 1)}`}
                      <TextSpan apparence="p3" className="ml-1" hint>HR</TextSpan>
                    </TextSpan>
                    <div style={{ paddingTop: `0.3rem` }} className="m-0">
                      <EvaIcon className="ml-1" name={"clock-outline"} status="Basic"
                        options={{ height: 17 }} />
                    </div>
                  </RowEnd>

                  <RowEnd className="pb-2">
                    <TextSpan apparence="s2">{floatToStringExtendDot(itemStatus?.consumption, 2)}
                      <TextSpan apparence="p3" className="ml-1" hint>{unit}</TextSpan>
                    </TextSpan>
                    <div style={{ paddingTop: `0.3rem` }} className="m-0">
                      <EvaIcon className="ml-1" name={"droplet"}
                      status="Primary" options={{ height: 17 }} />
                    </div>
                  </RowEnd>
                </Col>
              </TD>
            </>
          );
        })}
        <TDLast textAlign="center" isEvenColor={index % 2 === 0}>
          <RowEnd>
            <TextSpan apparence="p2">
              {floatToStringExtendDot(totalMinutes,1)}
              <TextSpan apparence="p3" hint className="ml-1">HR</TextSpan>
            </TextSpan>
            {/* <EvaIcon name={"clock-outline"} status="Basic" options={{height: 16 }} /> */}
          </RowEnd>

          <RowEnd>
            <TextSpan apparence="s1">{floatToStringExtendDot(totalConsumption, 1)}
              <TextSpan apparence="p3" hint className="ml-1">{unit}</TextSpan>
            </TextSpan>
            {/* <EvaIcon name={"droplet"} status="Basic" options={{height: 16 }} /> */}
          </RowEnd>
        </TDLast>
      </TR >
    </>
  );
};

export default ItemRowStatistic;
