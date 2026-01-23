import { useIntl } from "react-intl";
import moment from "moment";
import { TextSpan } from "../../../../components";
import { TD, TR } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";
import {
  getDiffDateCompactedString,
} from "../../../travel/Utils";
import styled from "styled-components";

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function ItemRow(props) {
  const { item, typeFuels, index } = props;
  const intl = useIntl();

  const mountPort = (port) => {
    return <TextSpan apparence="s2">{port?.code}</TextSpan>;
  };

  return (
    <>
      <TR isEvenColor={index % 2 === 0}>
        <TD className="pl-2">
          <ColFlex>
            <TextSpan apparence="s2">{item.code}</TextSpan>
            <TextSpan apparence="p3" hint>
              {`${item?.machine?.code ? `${item?.machine?.code} - ` : ""}${item?.machine?.name
                }`}
            </TextSpan>
          </ColFlex>
        </TD>
        <TD textAlign="center">
          <ColFlex>
            {mountPort(item?.portPointSource || item?.portPointStart)}
            <TextSpan apparence="p3" hint>
              {moment(item?.dateTimeStart).format("DD/MMM HH:mm")}
            </TextSpan>
          </ColFlex>
        </TD>
        <TD textAlign="center">
          <ColFlex>
            {mountPort(item?.portPointDestiny || item?.portPointEnd)}
            <TextSpan apparence="p3" hint>
              {moment(item?.dateTimeEnd).format("DD/MMM HH:mm")}
            </TextSpan>
          </ColFlex>
        </TD>
        <TD textAlign="center" className="pr-2">
          <TextSpan className="ml-1" apparence="s2">
            {getDiffDateCompactedString(
              item?.dateTimeStart,
              item?.dateTimeEnd,
              intl
            )}
          </TextSpan>
        </TD>
        <TD textAlign="end" className="pr-2">
          <TextSpan className="ml-1" apparence="s2">
            {floatToStringExtendDot(item?.distance ? item?.distance / ((new Date(item?.dateTimeEnd).getTime() - new Date(item?.dateTimeStart).getTime()) / 36e5) : 0, 1)}
          </TextSpan>
        </TD>
        <TD textAlign="end" className="pr-2">
          <TextSpan className="ml-1" apparence="s2">
            {floatToStringExtendDot(item?.distance)}
          </TextSpan>
        </TD>
        {typeFuels?.map((x, i) => <TD key={`${i}-c-T`} textAlign="end" className="pr-2">
          <TextSpan apparence="s2">
            {floatToStringExtendDot(item?.consumption[x.code])}
          </TextSpan>
        </TD>)}
      </TR>
    </>
  );
}
