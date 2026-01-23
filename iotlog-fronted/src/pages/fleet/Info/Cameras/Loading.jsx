import { Row } from "@paljs/ui";
import { ColFlex } from "./styles";
import { SkeletonThemed } from "../../../../components/Skeleton";

export const Loading = () => {
  return (
    <Row className="m-0" middle="xs">
      <ColFlex breakPoint={{ md: 4 }}>
        <SkeletonThemed width={100} height={30} />
        <SkeletonThemed width={100} height={30} />
        <SkeletonThemed width={100} height={30} />
        <SkeletonThemed width={100} height={30} />
        <SkeletonThemed width={100} height={30} />
      </ColFlex>
      <ColFlex breakPoint={{ md: 8 }}>
        <SkeletonThemed width={400} height={300} />
      </ColFlex>
    </Row>
  );
}