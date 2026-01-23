import { Card, Col, Row } from "@paljs/ui";
import styled, { css } from "styled-components";
import moment from "moment";
import { getIconStatusOperation } from "../../../fleet/Status/Utils";
import { TextSpan } from "../../../../components";


const Img = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  object-fit: cover;
`

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const DivBg = styled.div`
   ${({ theme, status }) => css`
    background-color: ${theme[`color${status}500`]}10;
  `}
  padding: 0.3rem;
  border-radius: 0.3rem;
  display: flex;
  justify-content: center;
`

export default function ItemAssetOperational(props) {
  const { key, item } = props;

  const detailsStatus = getIconStatusOperation(item?.status);

  const getStatusColor = (percent) => {
    if (percent >= 90) {
      return "Success";
    } else if (percent >= 70) {
      return "Warning";
    } else {
      return "Danger";
    }
  }

  const colorStatus = getStatusColor(item.percentualOperating);

  return <>
    <Card key={key} className="mb-4">
      <Row className="m-0 p-4" middle="xs">
        <Col breakPoint={{ xs: 12, md: 2 }}>
          <Row className="m-0" start="xs">
            <div>
              {detailsStatus?.icon}
            </div>
            <ColFlex className="ml-1">
              <TextSpan apparence="s1">{detailsStatus.label}</TextSpan>
              {item?.status?.includes("downtime") && <TextSpan apparence="p2" hint className="mt-1">
                {moment(item.startedAt).format("DD/MMM HH:mm")}
              </TextSpan>}
            </ColFlex>
          </Row>
        </Col>
        <Col breakPoint={{ xs: 12, md: 9 }}>
          <Row className="m-0" middle="xs">
            <Img src={item
              ?.machine
              ?.image
              ?.url} alt={item?.machine?.name} />
            <TextSpan apparence="s1" className="ml-3">
              {item?.machine?.name}
            </TextSpan>
          </Row>
        </Col>
        <Col breakPoint={{ xs: 12, md: 1 }}>
          <DivBg status={colorStatus}>
            <TextSpan apparence="s1"
              status={colorStatus}
              className="text-center">
              {item.percentualOperating} %
            </TextSpan>
          </DivBg>
        </Col>

      </Row>
    </Card>
  </>
}
