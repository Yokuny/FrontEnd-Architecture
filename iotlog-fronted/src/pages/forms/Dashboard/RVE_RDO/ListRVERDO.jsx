import { FormattedMessage } from "react-intl";
import ItemRVERDO from "./ItemRVERDO";
import { SkeletonThemed } from "../../../../components/Skeleton";
import { TextSpan } from "../../../../components";
import { getDataOperationsNormalized } from "./Utils";

export default function ListRVERDO(props) {
  const {
    data,
    isLoading,
    showInoperabilities,
    filterStartDate,
    filterEndDate,
    unit
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

  if (!data?.operations?.length) {
    return <TextSpan>
      <FormattedMessage id="not.found" />
    </TextSpan>
  }

  const dataNormalized = getDataOperationsNormalized(data, filterStartDate, filterEndDate)

  return <>
    {data?.assets?.map((asset, i) =>
      <ItemRVERDO key={i}
        asset={asset}
        showInoperabilities={showInoperabilities}
        data={dataNormalized?.filter((item) => item.idAsset === asset.id)}
        unit={unit}
      />
    )}
  </>
}
