import { SkeletonThemed } from "../../../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div style={{ marginTop: `4rem` }}></div>
      <SkeletonThemed  height={150} />
      <div style={{ marginTop: `4rem` }}></div>
      <SkeletonThemed  height={300} />
    </>
  )
}
