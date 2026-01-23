import { Col, EvaIcon, Row } from "@paljs/ui";
import styled, { css } from "styled-components";
import { TextSpan } from "../../../components";
import { ListItemStyle } from "../../fleet/Status/Base";

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .user-name {
    font-size: 14px !important;
  }
`;

const Image = styled.img`
  object-fit: cover;
  border-radius: 50%;
`

const ContentEmpty = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.borderBasicColor5};
    width: 50px;
    height: 50px;
  `}
`

const ColData = styled.div`
  display: flex;
  flex-direction: column;
`

export default function ItemAsset(props) {

  const { item, onClick } = props;

  return <>
    <ListItemStyle onClick={onClick} isSelected={props.isActive}>
      <ColCenter>
        <Row between="xs" middle="xs" style={{ flexWrap: 'nowrap' }}>
          <Row className="m-0" middle="xs" style={{ flexWrap: 'nowrap' }}>
            {item?.machine?.image?.url ? (
              <Image
                src={item?.machine?.image?.url}
                alt={item?.machine?.name}
                height={50}
                width={50}
              />
            ) : (
              <ContentEmpty />
            )}
            <ColData className="ml-3">
              <TextSpan apparence="s1">
                {item?.machine?.name}
              </TextSpan>
              <TextSpan apparence="p2" hint>
                {item?.machine?.code}
              </TextSpan>
            </ColData>
          </Row>
          {/* <UserImage
            image={item?.machine?.image?.url ? encodeURI(item?.machine?.image?.url) : ''}
            size="Medium"
            name={item?.machine?.name}
            title={item?.machine?.code}
          /> */}
          <EvaIcon status="Basic" name="arrow-ios-forward-outline" />
        </Row>
      </ColCenter>
    </ListItemStyle>
  </>
}
