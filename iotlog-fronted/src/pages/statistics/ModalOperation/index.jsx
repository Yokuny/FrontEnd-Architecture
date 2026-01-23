import React from "react";
import { Col, Row } from "@paljs/ui";
import { Fetch, Modal } from "../../../components";
import ChartFence from "./ChartFence";
import moment from "moment";
import { SkeletonThemed } from "../../../components/Skeleton";
import ChartDP from "./ChartDP";
import ChartAtAnchor from "./ChartAtAnchor";

export default function ModalOperation(props) {

  const { onClose, item, filter } = props;

  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      getData(item)
    }
    return () => {
      setData([])
    }
  }, [item?.machineEvent?.machine?.id])

  const getData = (item) => {

    const { machineEvent } = item;
    if (!machineEvent?.machine?.id)
      return

    setIsLoading(true);

    const queryDateMin = filter?.dateStart ? `min=${filter?.dateStart}` : "";
    const queryDateMax = filter?.dateEnd ? `max=${filter?.dateEnd}` : "";
    const queryFilter = [
      queryDateMax,
      queryDateMin,
      `hasDP=${machineEvent?.listTimeStatus?.some(x => x.status === "DP")}`
    ]
      .filter((x) => !!x)
      .join("&");

    Fetch.get(`/machineevent/${machineEvent?.machine?.id}/kpis?${queryFilter}`)
      .then((response) => {
        setData(response.data ? response.data : {});
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const hasDP = item?.machineEvent?.listTimeStatus?.some(x => x.status === "DP");

  return (<>
    <Modal
      show={!!item}
      onClose={onClose}
      size="ExtraLarge"
      textTitle={`${item?.machineEvent?.machine?.name}`}
      subtitle={`${item?.dateFilter?.dateMin
        ? moment(item?.dateFilter?.dateMin).format('DD MMM YYYY, HH:mm') : ''} ${item?.dateFilter?.dateMax ? ` - ${moment(item?.dateFilter?.dateMax).format('DD MMM YYYY, HH:mm')}` : ''}`}
      styleContent={{ maxHeight: 'calc(100vh - 110px)' }}
    >
      <Row>
        {hasDP && <Col breakPoint={{ md: 6, sm: 12 }} className="mb-4">
          {isLoading
            ? <div>
              <SkeletonThemed height={30} width={`100%`} />
              <div className="mt-2"></div>
              <SkeletonThemed height={150} width={`100%`} />
            </div>
            : <ChartDP
              seriesData={data?.plataform}
            />}
        </Col>}
        <Col breakPoint={{ md: 6, sm: 12 }} className="mb-4">
          {isLoading
            ? <div>
              <SkeletonThemed height={30} width={`100%`} />
              <div className="mt-2"></div>
              <SkeletonThemed height={150} width={`100%`} />
            </div>
            : <>
              <ChartFence seriesData={data?.fence} />
            </>}
        </Col>
        <Col breakPoint={{ md: 6, sm: 12 }} className="mb-4">
          {isLoading
            ? <div>
              <SkeletonThemed height={30} width={`100%`} />
              <div className="mt-2"></div>
              <SkeletonThemed height={150} width={`100%`} />
            </div>
            : <>
              <ChartAtAnchor seriesData={data?.atAnchor} />
            </>}
        </Col>
        {/* <Col breakPoint={{ md: 6 }} className="mb-4">
          {isLoading
            ? <div>
              <SkeletonThemed height={30} width={`100%`} />
              <div className="mt-2"></div>
              <SkeletonThemed height={150} width={`100%`} />
            </div>
            : <ChartMetrics
              listAnalytics={data?.analytics}
            />}
        </Col> */}
      </Row>
    </Modal>
  </>
  )
}
