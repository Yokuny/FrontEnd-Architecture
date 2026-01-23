import styled from "styled-components";
import { Tooltip } from "@paljs/ui";
import { TD, TR } from "../../../components/Table";
import { TextSpan } from "../../../components";
import { floatToStringBrazilian } from "../../../components/Utils";
import CIIRating from "./CIIRating";


const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ItemBadge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export default function Item_CII(props) {
  const { item } = props;

  const factors = [0.89, 0.87]

  return (
    <>
      <TR isEvenColor={props.index % 2 === 0}>
        <TD textAlign="center">
          {item?.image?.url ? (
            <Img src={item?.image?.url} alt={item?.name} />
          ) : (
            <div style={{ minHeight: 50 }}></div>
          )}
        </TD>
        <TD>
          <TextSpan apparence="s2">
            {item?.name}
          </TextSpan>
          <br />
          <TextSpan apparence="p2" hint>
            {item?.code || ''}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          <TextSpan apparence="p2" className="pr-2" hint>
            {floatToStringBrazilian(item.dataSheet?.deadWeight)}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          <TextSpan apparence="p2" className="pr-2" hint>
            {floatToStringBrazilian(item.dataSheet?.grossTonnage)}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          <TextSpan apparence="p2" className="pr-2">
            {!!item?.ciiRef ? floatToStringBrazilian(item?.ciiRef, 3) : '-'}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          <Tooltip
            placement="top"
            trigger="hint"
            content={<><TextSpan apparence="c1">
              CII Ref {((1 - 0.95) * 100).toFixed(0)}%: <strong>{!!item?.ciiRef ? floatToStringBrazilian(item?.ciiRef * 0.95, 3) : '-'}</strong>
              <br />
              CII Attained: <strong>{!!item?.cii_2023 ? floatToStringBrazilian(item.cii_2023, 3) : '-'}</strong>
            </TextSpan>
            </>}>
            {(item?.dd && item?.cii_2023 && item?.ciiRef) &&
              <ItemBadge>
                <CIIRating
                  dd={item?.dd}
                  ciiAttained={item?.cii_2023}
                  ciiReq={item?.ciiRef * 0.95}
                  apparence="p2"
                />
              </ItemBadge>}
          </Tooltip>
        </TD>
        <TD textAlign="end">
          <Tooltip
            placement="top"
            trigger="hint"
            content={<><TextSpan apparence="c1">
              CII Ref {((1 - 0.93) * 100).toFixed(0)}%: <strong>{!!item?.ciiRef ? floatToStringBrazilian(item?.ciiRef * 0.93, 3) : '-'}</strong>
              <br />
              CII Attained: <strong>{!!item?.cii_2024 ? floatToStringBrazilian(item.cii_2024, 3) : '-'}</strong>
            </TextSpan>
            </>}>
            {(item?.dd && item?.cii_2024 && item?.ciiRef) &&
              <ItemBadge>
                <CIIRating
                  dd={item?.dd}
                  ciiAttained={item?.cii_2024}
                  ciiReq={item?.ciiRef * 0.93}
                  apparence="p2"
                />
              </ItemBadge>}
          </Tooltip>
        </TD>
        <TD textAlign="end">
          <Tooltip
            placement="top"
            trigger="hint"
            content={<><TextSpan apparence="c1">
              CII Ref {((1 - 0.91) * 100).toFixed(0)}%: <strong>{!!item?.ciiRef ? floatToStringBrazilian(item?.ciiRef * 0.91, 3) : '-'}</strong>
              <br />
              CII Attained: <strong>{!!item?.cii ? floatToStringBrazilian(item.cii, 3) : '-'}</strong>
            </TextSpan>
            </>}
          >
            {(item?.dd && item?.cii && item?.ciiRef) &&
              <ItemBadge>
                <CIIRating
                  dd={item?.dd}
                  ciiAttained={item?.cii}
                  ciiReq={item?.ciiRef * 0.91}
                  apparence="s1"
                  styleContent={{ fontWeight: 'bold' }}
                />
              </ItemBadge>}
          </Tooltip>
        </TD>


        {factors?.map((factor, j) => <TD textAlign="center">
          <Tooltip
            placement="top"
            trigger="hint"
            content={<><TextSpan apparence="c1">
              CII Ref {((1 - factor) * 100).toFixed(0)}%: <strong>{!!item?.ciiRef ? floatToStringBrazilian(item?.ciiRef * factor, 3) : '-'}</strong>
              <br />
              CII Attained: <strong>{!!item?.cii ? floatToStringBrazilian(item.cii, 3) : '-'}</strong>
            </TextSpan>
            </>}
          >
            {(item?.dd && item?.cii && item?.ciiRef) &&
              <ItemBadge key={`${j}-n-`}>
                <CIIRating
                  dd={item?.dd}
                  ciiAttained={item?.cii}
                  ciiReq={item?.ciiRef * factor}
                  apparence="p2"
                />
              </ItemBadge>}
          </Tooltip>
        </TD>)}
      </TR>
    </>
  );
}
