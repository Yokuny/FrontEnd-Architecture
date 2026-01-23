import { useFetch } from "../Fetch/Fetch";
import { UserImage } from "../User/UserImage";
import { SkeletonThemed } from "../Skeleton";

export default function EnterpriseHeader({ idEnterprise }) {
  const { data: dataEnterprise, isLoading } = useFetch(
    `/enterprise/find?id=${idEnterprise}`
  );

  return (
    <>
      {isLoading ? (
        <SkeletonThemed width={100} />
      ) : (
        <UserImage
          size="Large"
          image={dataEnterprise?.image?.url}
          name={dataEnterprise?.name}
          title={`${dataEnterprise?.city || ''} - ${dataEnterprise?.state || ''}`}
        />

      )}
    </>
  );
}
