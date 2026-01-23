import React from "react";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui";
import { TextSpan } from "../../../components";
import { TD, TR } from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";

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

const ItemRowStatistic = (props) => {


  const { item, listStatusAllow, onClick, index } = props;

  const totalMinutes = item?.listTimeStatus?.reduce(
    (a, b) => a + ((b?.minutes || 0) / 60),
    0
  );

  const totalDistance = item?.listTimeStatus?.reduce(
    (a, b) => a + ((b?.distance || 0)),
    0
  );


  return (
    <>
      <TR
        isEvenColor={index % 2 === 0}
        onClick={() => { if (onClick) onClick() }}
        style={onClick && { cursor: 'pointer' }}>
        <TD textAlign="center">
          <Row className="pl-2 pt-2 pb-2">
            {item?.machine?.image?.url ? (
              <Img src={item?.machine?.image?.url} alt={item?.machine?.name} />
            ) : (
              <div style={{ minHeight: 50 }} />
            )}
            <TextSpan apparence="s2" className="ml-2">{item?.machine?.name}</TextSpan>
          </Row>
        </TD>
        {listStatusAllow?.map((x, i) => {

          const itemStatus = item?.listTimeStatus?.find(
            (z) => z.status?.toLowerCase() === x
          );

          const percentual = itemStatus?.minutes ? ((itemStatus.minutes / 60) * 100) / totalMinutes : 0;

          return (
            <>
              <TD key={`bIz-${i}`}>
                <Col>
                  <RowEnd>
                    <TextSpan apparence="p3" hint>
                      {`${floatToStringExtendDot(percentual, 0)}`}%
                    </TextSpan>
                  </RowEnd>
                  <RowEnd>
                    <TextSpan apparence="p2">{`${floatToStringExtendDot((itemStatus?.minutes || 0) / 60, 2)}`}
                      <TextSpan apparence="p3" className="ml-1" hint>HR</TextSpan>
                    </TextSpan>
                    <EvaIcon className="ml-1" name={"clock-outline"} status="Basic" options={{ height: 17 }} />

                  </RowEnd>

                  <RowEnd>
                    <TextSpan apparence="s2">{floatToStringExtendDot(itemStatus?.distance, 2)}
                      <TextSpan apparence="p3" className="ml-1" hint>NM</TextSpan>
                    </TextSpan>
                    <EvaIcon className="ml-1" name={"pin-outline"} status="Basic" options={{ height: 17, width: 17 }} />
                  </RowEnd>
                </Col>
              </TD>
            </>
          );
        })}
        <TD textAlign="center">
          <RowEnd>
            <TextSpan apparence="p2">
              {floatToStringExtendDot(totalMinutes, 1)}
              <TextSpan apparence="p3" hint className="ml-1">HR</TextSpan>
            </TextSpan>
            {/* <EvaIcon name={"clock-outline"} status="Basic" options={{height: 16 }} /> */}
          </RowEnd>

          <RowEnd>
            <TextSpan apparence="s1">
              {floatToStringExtendDot(totalDistance, 1)}
              <TextSpan apparence="p3" hint className="ml-1">NM</TextSpan>
            </TextSpan>
            {/* <EvaIcon name={"droplet"} status="Basic" options={{height: 16 }} /> */}
          </RowEnd>
        </TD>
      </TR >
    </>
  );
};

export default ItemRowStatistic;
