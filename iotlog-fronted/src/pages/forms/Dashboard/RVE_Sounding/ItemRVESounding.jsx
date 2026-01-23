import { CardBody } from '@paljs/ui/Card';
import React from "react";
import { CardNoShadow } from "../../../../components";
import ItemHeaderRVESounding from "./ItemHeaderRVESounding";
import ItemPeriodSounding from './ItemPeriodSounding';


export default function ItemRVESounding(props) {
  const { key, asset, data } = props;

  return <>
    <CardNoShadow key={key}>
      <CardBody className="p-0">
        <ItemHeaderRVESounding
          asset={asset}
        />
        <div className="mt-4" />
        <ItemPeriodSounding
          data={data}
          key={key}
        />
      </CardBody>
    </CardNoShadow>
  </>
}
