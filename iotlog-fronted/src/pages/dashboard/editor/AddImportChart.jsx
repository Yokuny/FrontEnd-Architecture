import React from "react";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import ModalUploadChart from "../upload/ModalUploadChart";

const AddImportChart = ({ visible, onAdd, style }) => {
  const [showUploadChart, setShowUploadChart] = React.useState(false);

  return (
    visible && (
      <Row center className="mt-4" style={style}>
        <Button
          status="Primary"
          size="Small"
          className="flex-between mr-2"
          onClick={onAdd}
        >
          <EvaIcon name="plus-outline" className="mr-1" />
          <FormattedMessage id="add.chart" />
        </Button>
        <Button
          status="Basic"
          size="Small"
          className="ml-4 flex-between"
          onClick={() => setShowUploadChart(true)}
        >
          <EvaIcon name="upload-outline" className="mr-1" />
          <FormattedMessage id="upload.chart" />
        </Button>
        {!!showUploadChart && (
          <ModalUploadChart
            show={!!showUploadChart}
            onClose={() => setShowUploadChart(undefined)}
          />
        )}
      </Row>
    )
  );
};

export default AddImportChart;
