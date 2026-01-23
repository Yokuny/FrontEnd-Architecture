import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import { DateDiff } from "../../../../components/Date/DateDiff";
import { DmsCoordinates } from "../Coordinates/DmsCoordinates";

const ColContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentDetails = ({ data, course, lastDate }) => {
  const dmsData = new DmsCoordinates(data?.position[0], data?.position[1]);
  return (
    <>
      <TextSpan apparence="s2">{data?.name}</TextSpan>
      <br />
      <TextSpan apparence="c3">{data?.modelType}</TextSpan>
      <br />
      <br />
      <Row>
        {course !== undefined && course !== null && (
          <>
            <Col breakPoint={{ md: 6 }} className="mt-4  mb-2">
              <LabelIcon
                titleApparence="c3"
                iconName="compass-outline"
                title="Course"
              />
              <TextSpan apparence="c2" className="ml-3">
                <strong>{course}º</strong>
              </TextSpan>
            </Col>
          </>
        )}
        {lastDate !== undefined && lastDate !== null && (
          <>
            <Col breakPoint={{ md: 6 }} className="mt-4 mb-2">
              <LabelIcon
                titleApparence="c3"
                iconName="radio-outline"
                title={<FormattedMessage id="last.date.acronym" />}
              />
              <TextSpan className="ml-1" apparence="c2">
                <DateDiff dateInitial={lastDate} />
              </TextSpan>
            </Col>
          </>
        )}
        <Col breakPoint={{ md: 12 }}>
          <LabelIcon
            titleApparence="c3"
            iconName="pin-outline"
            title={<FormattedMessage id="location" />}
          />
          <ColContent className="ml-3">
            <TextSpan apparence="p3">
              {data?.position[0]} / {data?.position[1]}
            </TextSpan>
            <TextSpan apparence="c2">
              <strong>
                {dmsData.getLatitude()?.toString()} /{" "}
                {dmsData.getLongitude()?.toString()}
              </strong>
            </TextSpan>
          </ColContent>
        </Col>
      </Row>
    </>
  );
};

export default ContentDetails;
