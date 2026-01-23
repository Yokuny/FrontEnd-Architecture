import { Col, Row } from "@paljs/ui";
import { SkeletonThemed } from "../../../../../components/Skeleton";

export default function LoadingTimeline() {
  return (
    <>
      <Row>
        <Col breakPoint={{ md: 2 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 10 }}>
          <SkeletonThemed width={"100%"} />
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col breakPoint={{ md: 2 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 10 }}>
          <SkeletonThemed width={"100%"} />
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col breakPoint={{ md: 2 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 10 }}>
          <SkeletonThemed width={"100%"} />
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col breakPoint={{ md: 2 }}>
          <SkeletonThemed width={"100%"} />
        </Col>
        <Col breakPoint={{ md: 10 }}>
          <SkeletonThemed width={"100%"} />
          <SkeletonThemed width={"100%"} />
        </Col>
      </Row>
    </>
  );
}
