import React from "react";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TABLE, THEAD, TH, TRH, TBODY, TR, TD } from "../../../../components/Table";
import { TextSpan } from "../../../../components";
import { floatToStringExtendDot } from "../../../../components/Utils";
import ModalGroupConsumption from "./ModalGroupConsumption";

export default function ListGroupConsumption(props) {
  const { groupConsumption, onChange } = props;

  const [showModal, setShowModal] = React.useState(false);
  const indexEdit = React.useRef(null);

  const onRemove = (i) => {
    onChange(
      "groupConsumption",
      groupConsumption?.filter((x, z) => z !== i)
    )
  }

  const changeEditIndex = (index) => {
    indexEdit.current = index;
    setShowModal(true);
  }

  const onSave = (i, data) => {
    onChange("groupConsumption", [
      ...(groupConsumption?.slice(0, i) || []),
      data,
      ...(groupConsumption?.slice(i + 1) || []),
    ]);
    indexEdit.current = null;
    setShowModal(false);
  }

  return (
    <>
      <Row center="xs">
        <TABLE>
          {!!groupConsumption?.length && <THEAD>
            <TRH>
              <TH>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="code" />
                </TextSpan>
              </TH>
              <TH>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="description" />
                </TextSpan>
              </TH>
              <TH style={{ width: 140 }} textAlign="end">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="consumption" /> (m³)
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
            {groupConsumption?.map((operationItem, i) => (
              <TR key={`${i}-c`}
                isEvenColor={i % 2 === 0}>
                <TD>
                  <TextSpan apparence="s2">
                    {operationItem?.code}
                  </TextSpan>
                </TD>
                <TD>
                  <TextSpan apparence="p2">
                    {operationItem?.description}
                  </TextSpan>
                </TD>
                <TD textAlign="end" className="pr-3">
                  <TextSpan apparence="s2">
                    {floatToStringExtendDot(operationItem?.consumption, 2)}
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

        <ModalGroupConsumption
          show={showModal}
          handleClose={() => setShowModal(false)}
          onSave={(data) => onSave(indexEdit.current, data)}
          dataInitial={groupConsumption?.[indexEdit.current]}
        />

        <Row center="xs" className="mt-4">
          <Button
            size="Tiny"
            status="Info"
            className={`flex-between ml-4`}
            onClick={() => changeEditIndex(groupConsumption?.length + 1)}
          >
            <EvaIcon name="plus-circle-outline" className="mr-1" />
            <FormattedMessage id="add" />
          </Button>
        </Row>
      </Row>
    </>
  );
}
