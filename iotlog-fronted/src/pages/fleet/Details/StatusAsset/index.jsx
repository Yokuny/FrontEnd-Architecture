import React from "react";
import { Card, CardBody } from "@paljs/ui";
import { nanoid } from "nanoid";
import { Divide, Fetch } from "../../../../components";
import CardHeaderStatus from "./CardHeaderStatus";
import DataTitle from "./DataTitle";
import DataTravel from "./DataTravel";
import DataIcons from "./DataIcons";
import DataChart from "./DataChart";
import DataFooter from "./DataFooter";

const DetailsStatusAsset = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();

  const { item, isShowList } = props;

  React.useEffect(() => {
    if (!item?.machine?.id) return;
    getData(item?.machine?.id);
  }, [item?.machine?.id]);

  const getData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(`/travel/machine?idMachine=${idMachine}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card
        key={`ts-m-${item?.machine?.id}`}
        style={{ boxShadow: "none" }}
      >
        <CardHeaderStatus data={data} isLoading={isLoading} item={item} />
        <CardBody>
          <DataTitle data={data} item={item} />

          {data?.travel && <Divide mh="-18px" />}

          <DataTravel key={nanoid(4)} data={data} idMachine={item?.machine?.id} />

          <Divide mh="-18px" />

          <DataIcons data={data} isLoading={isLoading} item={item} />

          <Divide mh="-18px" />

          <DataChart item={item} />

          <Divide mh="-18px" />

          <DataFooter item={item} />
        </CardBody>
      </Card>
    </>
  );
};

export default DetailsStatusAsset;
