import { Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import styled, { useTheme } from "styled-components";
import { LabelIcon, TextSpan, UserImage } from "../../../components";
import { Container } from "../../../components/Icons";
import { floatToStringExtendDot } from "../../../components/Utils";
import { ListItemStyle } from "../../fleet/Status/Base";

const ColEnd = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: end;
`;

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .user-name {
    font-size: 14px !important;
  }
`;

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ColStart = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ColInCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


export default function ItemVoyageIntegration(props) {

  const { item, onClick } = props;
  const theme = useTheme();

  return <>
    <ListItemStyle onClick={onClick} isSelected={props.isActive}>
      <ColCenter>
        <Row between="xs" middle="xs" className='mb-4'>
          {/* <UserImage
            image={item?.machine?.image?.url}
            size="Medium"
            name={item?.machine?.name}
          /> */}
          <TextSpan apparence="s1">{item.code}</TextSpan>
        </Row>
        <Row between="xs" middle="xs">
          <ColStart breakPoint={{ md: 5, xs: 5 }}>

            <TextSpan apparence="s3" hint>
              {item?.portStart}
            </TextSpan>

          </ColStart>
          <ColInCenter breakPoint={{ md: 2, xs: 2 }}>
            <EvaIcon
              name="arrow-forward-outline"
              status="Basic"
              options={{ height: 23, width: 23 }}
            />
          </ColInCenter>
          <ColEnd breakPoint={{ md: 5, xs: 5 }}>
            <TextSpan apparence="s3" hint>{item?.portEnd}</TextSpan>
          </ColEnd>
        </Row>
        <Row between="xs" middle="xs" className="mb-4">
          <Col breakPoint={{ md: 5, xs: 3 }}>
            <RowRead>
              {/* <EvaIcon
                name="arrow-circle-up-outline"
                status="Basic"
                className="mt-1 mr-1"
                options={{ height: 18, width: 18 }}
              /> */}
              <TextSpan apparence="p3" hint>
                {item.dateTimeStart ? `${moment(item.dateTimeStart).format("DD MMM, HH:mm")}` : '-'}
              </TextSpan>
            </RowRead>
          </Col>
          <ColInCenter breakPoint={{ md: 1, xs: 1 }}>

          </ColInCenter>
          <ColEnd breakPoint={{ md: 5, xs: 3 }}>
            <RowRead>
              {/* <EvaIcon
                name="arrow-circle-down-outline"
                status="Basic"
                className="mt-1 mr-1"
                options={{ height: 18, width: 18 }}
              /> */}
              <TextSpan apparence="p3" hint>
                {item.dateTimeLastArrival ? `${moment(item.dateTimeLastArrival).format("DD MMM, HH:mm")}` : '-'}
              </TextSpan>
            </RowRead>
          </ColEnd>
        </Row>

        <Row between="xs" middle="xs">
          <LabelIcon
            iconName="cube-outline"
            title={item.loadDescription}
          />

          <LabelIcon
            renderIcon={() => (
              <Container
                style={{
                  height: 14,
                  width: 14,
                  fill: theme.textHintColor,
                  marginRight: 6,
                  marginTop: 3,
                  marginBottom: 2,
                }}
              />
            )}
            title={`${floatToStringExtendDot(item.loadWeight, 1)} T`}
          />
        </Row>

      </ColCenter>
    </ListItemStyle>
  </>
}
