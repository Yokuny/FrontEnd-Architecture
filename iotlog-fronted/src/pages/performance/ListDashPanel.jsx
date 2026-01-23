import { Col } from "@paljs/ui";
import DashItemPanel from "./DashItemPanel";

export default function ListDashPanel(props) {

  const { data, sensorX, sensorsY } = props;

  if (!data?.data?.length) {
    return <></>;
  }

  return <>
    {sensorsY?.map((sensorY, i) => {
      return (
        <>
          <Col
            style={{
              height: 380
            }}
            breakPoint={{ xs: 12, md: sensorY?.length === 1 ? 12 : 6 }} key={i}>
            <DashItemPanel
              index={i}
              series={data?.data?.map(z => [z[0], z[i + 1]]) || []}
              sensorX={sensorX}
              sensorsY={[sensorY]}
            />
          </Col>
        </>
      )
    })}
  </>;
}
