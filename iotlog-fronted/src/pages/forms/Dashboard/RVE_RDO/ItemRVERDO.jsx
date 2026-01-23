import { CardBody } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';
import Row from '@paljs/ui/Row';
import React from "react";
import { FormattedMessage } from "react-intl";
import { CardNoShadow, TextSpan } from "../../../../components";
import ItemHeaderRVERDO from "./ItemHeaderRVERDO";
import TableListRVERDO from "./TableListRVERDO";
import ChartRVERDO from "./ChartRVERDO";


export default function ItemRVERDO(props) {
  const { key, asset, data, showInoperabilities, unit } = props;

  const [isOpen, setIsOpen] = React.useState(false)
  const [showDataLabels, setShowDataLabels] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("trend")

  return <>
    <CardNoShadow key={key}>
      <ItemHeaderRVERDO
        asset={asset}
        data={data}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        showInoperabilities={showInoperabilities}
        unit={unit}
      />
      {isOpen && <CardBody>
        <Row className="m-0 mb-3" middle="xs" between='xs'>
          <Row start='xs' className="m-0">
            <Button
              size="Tiny"
              className="mr-2 flex-between"
              style={{ border: "none" }}
              appearance={"outline"}
              status={viewMode === "trend" ? "Primary" : "Basic"}
              onClick={() => setViewMode("trend")}
            >
              <EvaIcon name="trending-up-outline" className="mr-1" />
              Trend
            </Button>
            <Button
              size="Tiny"
              appearance={"outline"}
              status={viewMode === "list" ? "Primary" : "Basic"}
              style={{ border: "none" }}
              className="flex-between"
              onClick={() => setViewMode("list")}
            >
              <EvaIcon name="list-outline" className="mr-1" />
              <FormattedMessage id="list" />
            </Button>
          </Row>
          {viewMode === "trend" && <Button
            size="Tiny"
            appearance={"ghost"}
            status={showDataLabels ? "Primary" : "Basic"}
            className="flex-between"
            onClick={() => setShowDataLabels(prev => !prev)}
          >
            <EvaIcon name={!showDataLabels ? "eye-outline" : "eye-off-outline"} className="mr-1" />
            <FormattedMessage id="show.data.label" />
          </Button>}
        </Row>
        {viewMode === "list" ? (
          <TableListRVERDO
            data={data}
            key={key}
            unit={unit}
          />
        ) : (
          <ChartRVERDO
            data={data}
            showDataLabels={showDataLabels}
            asset={asset}
            unit={unit}
          />
        )}
      </CardBody>}
    </CardNoShadow>
  </>
}
