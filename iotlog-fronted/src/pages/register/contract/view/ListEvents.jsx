import { Button, Card, CardBody, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";
import { TextSpan } from "../../../../components";
import React from "react";
import ModalEvent from "./ModalEvent";

export default function ListEvents(props) {
  const { events, onChange } = props;

  const [showModal, setShowModal] = React.useState(false);
  const indexEdit = React.useRef(null);

  const onRemove = (i) => {
    onChange(
      "events",
      events?.filter((x, z) => z !== i)
    )
  }

  const changeEditIndex = (index) => {
    indexEdit.current = index;
    setShowModal(true);
  }

  const onSave = (i, data) => {
    onChange("events", [
      ...(events?.slice(0, i) || []),
      data,
      ...(events?.slice(i + 1) || []),
    ]);
    indexEdit.current = null;
    setShowModal(false);
  }

  return (
    <>
      <Row center="xs">
        <TABLE>
          {!!events?.length && <THEAD>
            <TRH>
              <TH>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="description" />
                </TextSpan>
              </TH>
              <TH textAlign="end" className="pr-2" style={{ width: 120 }}>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="fine.factor" />
                </TextSpan>
              </TH>
              <TH textAlign="center" style={{ width: 80 }}>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="actions" />
                </TextSpan>
              </TH>
            </TRH>
          </THEAD>}
          <TBODY>
            {events?.map((event, i) => (
              <TR key={`${i}-c`}
                isEvenColor={i % 2 === 0}>
                <TD>
                  <TextSpan apparence="p2">
                    {event?.description}
                  </TextSpan>
                </TD>
                <TD textAlign="end" className="pr-3">
                  <TextSpan apparence="s2">
                    {event?.factor} %
                  </TextSpan>
                </TD>
                <TD>
                  <Row className="m-0" around="xs">
                    <Button
                      size="Tiny"
                      status="Info"
                      appearance="ghost"
                      style={{ padding: 2 }}
                      onClick={() => changeEditIndex(i)}
                    >
                      <EvaIcon name="edit-2-outline" />
                    </Button>
                    <Button
                      size="Tiny"
                      status="Danger"
                      appearance="ghost"
                      className="ml-1"
                      style={{ padding: 2 }}
                      onClick={() => onRemove(i)}
                    >
                      <EvaIcon name="trash-2-outline" />
                    </Button>
                  </Row>
                </TD>
              </TR>))}
          </TBODY>
        </TABLE>

        <ModalEvent
          show={showModal}
          handleClose={() => setShowModal(false)}
          dataInitial={events?.[indexEdit.current]}
          onSave={(data) => onSave(indexEdit.current, data)}
        />

        <Button
          size="Tiny"
          status="Info"
          className={`flex-between ml-4 mt-4`}
          onClick={() => changeEditIndex(events?.length + 1)}
        >
          <EvaIcon name="plus-circle-outline" className="mr-1" />
          <FormattedMessage id="add" />
        </Button>
      </Row>
    </>
  );
}
