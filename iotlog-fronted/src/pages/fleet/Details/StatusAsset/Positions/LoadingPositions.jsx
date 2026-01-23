import { Col, Row } from "@paljs/ui";
import { SkeletonThemed } from "../../../../../components/Skeleton";

export default function LoadingPositions() {
  return (
    <>
      <Row>
        <Col breakPoint={{ md: 3 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 9 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col breakPoint={{ md: 3 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 9 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col breakPoint={{ md: 3 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 9 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col breakPoint={{ md: 3 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 9 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
    </>
  );
}
