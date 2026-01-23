import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import React from "react";
import { Fetch } from "../../../components";
import IndicatorsChartPerVessel from "./IndicatorsChartPerVessel";

export const ListIndicatorsMachines = ({
  data,
  idMachines,
  view
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [machines, setMachines] = React.useState(null);

  React.useEffect(() => {
    if (idMachines?.length) {
      getData(idMachines)
    }
  }, [idMachines])

  const getData = (idMachines) => {
    const query = idMachines.map((id) => `id[]=${id}`).join("&");
    setIsLoading(true);
    Fetch.get(`/machine/basic?${query}`)
      .then((response) => {
        setMachines(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  return <>{idMachines?.length > 1 && (
    <>
      <Col breakPoint={{ xs: 12, md: 8 }}>
        <Row className="m-0" start="xs" top="xs">
          {idMachines.map((idMachine, index) => (
            <IndicatorsChartPerVessel
              key={index}
              machine={machines?.find((item) => item.id === idMachine)}
              index={index}
              data={data.filter((item) => item.machine.id === idMachine)}
              view={view}
            />
          ))}
        </Row>
      </Col>
    </>
  )}
  </>
}
