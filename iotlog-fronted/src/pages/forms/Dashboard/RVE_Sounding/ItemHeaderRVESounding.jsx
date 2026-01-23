import Row from "@paljs/ui/Row";
import styled from "styled-components";
import { TextSpan } from "../../../../components";

const Img = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
`

export default function ItemHeaderRVESounding(props) {

  const { asset } = props;

  return <Row middle="xs" className="m-0">
        <Img src={asset
          ?.image
          ?.url} alt={asset.name} />
        <TextSpan apparence="s1" className="ml-3">
          {asset.name}
        </TextSpan>
      </Row>
}
