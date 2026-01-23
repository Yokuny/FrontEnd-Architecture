import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { SkeletonThemed } from "../../../components/Skeleton";

export default function LoadingDashboard() {
  return <Row>
    <Col breakPoint={{
      xs: 3,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
    <Col breakPoint={{
      xs: 3,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
    <Col breakPoint={{
      xs: 3,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
    <Col breakPoint={{
      xs: 3,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
    <Col className="mt-4 mb-4" breakPoint={{
      xs: 12,
    }}>
      <SkeletonThemed height="15rem" />
    </Col>
    <Col breakPoint={{
      xs: 4,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
    <Col breakPoint={{
      xs: 4,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
    <Col breakPoint={{
      xs: 4,
    }}>
      <SkeletonThemed height="10rem" />
    </Col>
  </Row>
}
