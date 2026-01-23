import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { SkeletonThemed } from "../../../components/Skeleton";

export default function LoadingRows() {

  return (<>
    <Row middle="xs" center="xs" className="mt-4">
      <Col breakPoint={{ md: 1 }} className="pt-1 pb-1">
        <SkeletonThemed height="4rem" />
      </Col>
      <Col breakPoint={{ md: 3 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
    </Row>
    <Row middle="xs" center="xs" >
      <Col breakPoint={{ md: 1 }} className="pt-1 pb-1">
        <SkeletonThemed height="4rem" />
      </Col>
      <Col breakPoint={{ md: 3 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
    </Row>
    <Row middle="xs" center="xs" className="mb-4">
      <Col breakPoint={{ md: 1 }} className="pt-1 pb-1">
        <SkeletonThemed height="4rem" />
      </Col>
      <Col breakPoint={{ md: 3 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <SkeletonThemed height="1.5rem" />
      </Col>
    </Row>
  </>)
}
