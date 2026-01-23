import styled from "styled-components";
import { TextSpan } from "../../../../components";
import { TD, TR } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const RowMiddle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  `;

export default function ItemRowCO2(props) {
  const { item } = props;

  const hasMoreTypeOIL = item?.oilDetails?.length > 1;

  return (
    <>
      <TR isEvenColor={props.index % 2 === 0}>
        <TD className="p-4">
          <RowMiddle>
            {item?.machine?.image?.url ? (
              <Img src={item?.machine?.image?.url} alt={item?.machine?.name} />
            ) : (
              <div style={{ minHeight: 50 }}></div>
            )}
            <TextSpan apparence="s2" className="ml-2">
              {`${item?.machine?.code ? `${item?.machine?.code} - ` : ""}${item?.machine?.name
                }`}
            </TextSpan>
          </RowMiddle>
        </TD>
        <TD textAlign="end" className="pr-4">
          {hasMoreTypeOIL
            ? item?.oilDetails?.map((oil, index) => (
              <div key={index}>
                <TextSpan apparence="s3" hint>
                  {oil?.type}
                </TextSpan>
                <TextSpan apparence="s2" className="ml-1">
                  {floatToStringExtendDot(oil?.consumption, 2)}
                  <TextSpan apparence="p3" hint className="ml-1">
                    {oil?.unit}
                  </TextSpan>
                </TextSpan>
              </div>
            ))
            : <TextSpan apparence="s2">
              <TextSpan apparence="s3" hint className="mr-1">
                  {item?.type}
                </TextSpan>
              {floatToStringExtendDot(item?.consumption, 2)}
              <TextSpan apparence="p3" hint className="ml-1">
                {item?.unit}
              </TextSpan>
            </TextSpan>}
        </TD>
        <TD textAlign="end" className="pr-4">
          {hasMoreTypeOIL
            ? <>
              {item?.oilDetails?.map((oil, index) => (
                <div key={index}>
                  <TextSpan apparence="s3" hint>
                    {oil?.type}
                  </TextSpan>
                  <TextSpan apparence="p2" className="ml-1">
                    {floatToStringExtendDot(oil?.co2, 2)}
                    <TextSpan apparence="p3" hint className="ml-1">
                      KG
                    </TextSpan>
                  </TextSpan>
                </div>))}
              <TextSpan className="ml-1" apparence="s2">
                {floatToStringExtendDot(
                  item?.oilDetails?.reduce((acc, curr) => acc + curr.co2, 0) || 0
                )}
                <TextSpan
                  apparence="p3"
                  className="ml-1"
                  hint
                >KG</TextSpan>
              </TextSpan>
            </>
            : <TextSpan className="ml-1" apparence="s2">
                           <TextSpan apparence="s3" hint className="mr-1">
                    {item?.type}
                  </TextSpan>
              {floatToStringExtendDot(
                item.co2 || 0
              )}
              <TextSpan
                apparence="p3"
                className="ml-1"
                hint
              >KG</TextSpan>
            </TextSpan>}
        </TD>
        <TD textAlign="end" className="pr-4">
          {hasMoreTypeOIL
            ? <>
              {item?.oilDetails?.map((oil, index) => (
                <div key={index}>
                  <TextSpan apparence="s3" hint>
                    {oil?.type}
                  </TextSpan>
                  <TextSpan apparence="p2" className="ml-1">
                    {floatToStringExtendDot((oil?.co2 || 0) / 1000, 2)}
                    <TextSpan apparence="p3" hint className="ml-1">
                      Ton
                    </TextSpan>
                  </TextSpan>
                </div>))}
              <TextSpan className="ml-1" apparence="s2">
                {floatToStringExtendDot(
                  (item?.oilDetails?.reduce((acc, curr) => acc + curr.co2, 0) || 0) / 1000
                )}
                <TextSpan
                  apparence="p3"
                  className="ml-1"
                  hint
                >Ton</TextSpan>
              </TextSpan>
            </>
            : <TextSpan className="ml-1" apparence="s2">
              {floatToStringExtendDot(
                (item.co2 || 0) / 1000
              )}
              <TextSpan
                apparence="p3"
                className="ml-1"
                hint
              >Ton</TextSpan>
            </TextSpan>}
        </TD>
      </TR>
    </>
  );
}
