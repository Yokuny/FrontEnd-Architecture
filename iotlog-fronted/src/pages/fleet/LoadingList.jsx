import { Col, Row } from "@paljs/ui";
import { SkeletonThemed } from "../../components/Skeleton";

export function LoadingList(props) {
  const { showMoreThanOne } = props;
  return (
    <>
      <Row style={{ margin: 0 }} middle="xs"className="mt-2">
        <Col breakPoint={{ md: 3 }}>
          <SkeletonThemed width="100%" />
        </Col>
        <Col breakPoint={{ md: 6 }}>
          <SkeletonThemed width="100%" />
          <SkeletonThemed width="100%" />
          <SkeletonThemed width="100%" />
          <SkeletonThemed width="100%" />
        </Col>
        <Col breakPoint={{ md: 3 }}>
          <SkeletonThemed width="100%" />
        </Col>
      </Row>
      {showMoreThanOne && (
        <>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 6 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 6 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 6 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 6 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 6 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 3 }}>
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export function LoadingListTravel(props) {
  const { showMoreThanOne } = props;
  return (
    <>
      <Row style={{ margin: 0 }} middle="xs"className="mt-2">
        <Col breakPoint={{ md: 4 }}>
          <SkeletonThemed width="100%" />
        </Col>
        <Col breakPoint={{ md: 8 }}>
          <SkeletonThemed width="100%" />
          <SkeletonThemed width="100%" />
        </Col>
      </Row>
      {showMoreThanOne && (
        <>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 4 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 4 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 4 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 4 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
          <Row style={{ margin: 0 }} middle="xs"className="mt-2">
            <Col breakPoint={{ md: 4 }}>
              <SkeletonThemed width="100%" />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <SkeletonThemed width="100%" />
              <SkeletonThemed width="100%" />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
