import React from "react";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import { toast } from "react-toastify";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { DateTime, Modal, LabelIcon } from "../../../../components";
import { EvaIcon } from "@paljs/ui";

const ModalExport = ({ isOpen, onClose, onExport }) => {
  const intl = useIntl();
  const [dateStart, setDateStart] = React.useState(null);
  const [dateEnd, setDateEnd] = React.useState(null);

  const handleExport = () => {
    if (!dateStart || !dateEnd) {
      toast.error(intl.formatMessage({ id: "select.date.range" }));
      return;
    }

    if (moment(dateStart).isAfter(dateEnd)) {
      toast.error(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }

    if (moment(dateEnd).diff(moment(dateStart), "months") > 6) {
      toast.error(intl.formatMessage({ id: "date.range.must.be.less.than.6.months" }));
      return;
    }

    onExport(dateStart, dateEnd);
    onClose();
  };

  return (
    <Modal
      show={isOpen}
      title={intl.formatMessage({ id: "export" })}
      onClose={onClose}
      renderFooter={() => (
        <Row between="xs" className="m-0 p-3">
          <Button status="Basic"
            size="Tiny"
            appearance="ghost"
            className="flex-between"
            onClick={onClose}>
            <EvaIcon name="close-outline" className="mr-1" />
            <FormattedMessage id="cancel" />
          </Button>
          <Button
            size="Tiny"
            className="flex-between mr-2"
            disabled={!dateStart || !dateEnd}
            onClick={handleExport}>
            <EvaIcon name="download-outline" className="mr-1" />
            <FormattedMessage id="export" />
          </Button>
        </Row>
      )}
    >
      <Row className="m-0">
        <Col breakPoint={{ xs: 12, md: 6 }}>
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.start" />}
          />
          <DateTime
            placeholder={intl.formatMessage({ id: "date.start" })}
            value={dateStart}
            onChangeDate={(date) => setDateStart(date)}
            min={dateEnd ? moment(dateEnd).subtract(6, 'months') : null}
            onlyDate
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 6 }}>
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.end" />}
          />
          <DateTime
            placeholder={intl.formatMessage({ id: "date.end" })}
            value={dateEnd}
            onChangeDate={(date) => setDateEnd(date)}
            max={dateStart ? moment(dateStart).add(6, 'months') : null}
            onlyDate
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalExport;
