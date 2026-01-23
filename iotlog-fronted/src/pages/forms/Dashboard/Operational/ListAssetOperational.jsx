import { Col, Row } from "@paljs/ui";
import { SkeletonThemed } from "../../../../components/Skeleton";
import ItemAssetOperational from "./ItemAssetOperational";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../../../../components";

export default function ListAssetOperational(props) {
  const {
    data,
    isLoading,
  } = props;

  if (isLoading) {
    return <>
      <SkeletonThemed height={100} />
      <br />
      <SkeletonThemed height={100} />
      <br />
      <SkeletonThemed height={100} />
      <br />
      <SkeletonThemed height={100} />
    </>
  }


  return <>
    {!!data?.length &&
      <Row className="m-0 pl-4 pr-4 pb-2">
        <Col breakPoint={{ xs: 12, md: 2 }}>
          <Row middle="xs" start="xs" className="m-0">
            <TextSpan apparence="p2"
              hint
              style={{ textAlign: "center" }}>
              <FormattedMessage id="last.status" />
            </TextSpan>
          </Row>
        </Col>
        <Col breakPoint={{ xs: 12, md: 9 }}>
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="machine" />
          </TextSpan>
        </Col>
        <Col breakPoint={{ xs: 12, md: 1 }}>
          <Row middle="xs" center="xs" className="m-0">
            <TextSpan apparence="p2"
              style={{ textAlign: "center" }}
              hint>
              <FormattedMessage id="perc.title.last.30.days" />
            </TextSpan>
          </Row>
        </Col>

      </Row>
    }
    {data
      ?.sort((a, b) => {
        const isDowntimeA = a.status.includes("downtime");
        const isDowntimeB = b.status.includes("downtime");

        if (isDowntimeA && !isDowntimeB) return -1;
        if (!isDowntimeA && isDowntimeB) return 1;

        if (a.percentualOperating !== b.percentualOperating) {
          return a.percentualOperating - b.percentualOperating;
        }

        return a.machine.name.localeCompare(b.machine.name);
      })
      ?.map((item, i) =>
        <ItemAssetOperational
          key={i}
          item={item}
        />
      )}
  </>
}
