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

const DivCol = styled.div`
  display: flex;
  flex-direction: column;
`

export default function ItemRow(props) {
  const { item, index, typeFuels } = props;
  return (
    <>
      <TR isEvenColor={index % 2 === 0}>
        <TD textAlign="center">
          {item?.machine?.image?.url ? (
            <Img src={item?.machine?.image?.url} alt={item?.machine?.name} />
          ) : (
            <div style={{ minHeight: 50 }}></div>
          )}
        </TD>
        <TD>
          <DivCol>
            <TextSpan apparence="s2">
              {item?.machine?.name}
            </TextSpan>
            <TextSpan apparence="c3" hint>
              {item?.machine?.code}
            </TextSpan>
          </DivCol>
        </TD>
        <TD textAlign="end" className="pr-4">
          <TextSpan className="ml-1" apparence="s2">
            {floatToStringExtendDot(item?.distance)}
          </TextSpan>
        </TD>
        <TD textAlign="end" className="pr-4">
          <TextSpan className="ml-1" apparence="s2">
            {floatToStringExtendDot(item?.hours)}
          </TextSpan>
        </TD>
        {typeFuels?.map((x, i) => <TD key={`${i}-c-T`} textAlign="end" className="pr-4">
          <TextSpan apparence="s2">
            {floatToStringExtendDot(item?.consumption[x.code])}
          </TextSpan>
        </TD>)}
      </TR>
    </>
  );
}
