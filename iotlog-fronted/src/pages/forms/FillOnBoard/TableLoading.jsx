import { SkeletonThemed } from "../../../components/Skeleton";
import { TD, TR } from "../../../components/Table";

export default function TableLoading(props) {
  const { cols, rows } = props;

  return (<>
    {Array(rows).fill(1).map((x, i) => (
      <TR key={`r-l-${i}`} isEvenColor={i % 2 === 0}>
        {Array(cols).fill(1).map((w, j) => (
          <TD key={`j-l-${i}-${j}`}>
            <SkeletonThemed />
          </TD>))}
      </TR>))
    }
  </>)
}
