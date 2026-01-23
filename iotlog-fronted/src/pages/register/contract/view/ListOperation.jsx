import React from "react";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";
import { TextSpan } from "../../../../components";
import ModalOperation from "./ModalOperation";
import { floatToStringExtendDot } from "../../../../components/Utils";

export default function ListOperation(props) {
  const { operations, groupConsumptions, onChange } = props;

  const [showModal, setShowModal] = React.useState(false);
  const indexEdit = React.useRef(null);

  const changeEditIndex = (index) => {
    indexEdit.current = index;
    setShowModal(true);
  };

  const onRemove = (i) => {
    onChange(
      "operations",
      operations?.filter((x, z) => z !== i)
    );
  };

  const onSave = (i, data) => {
    onChange("operations", [...(operations?.slice(0, i) || []), data, ...(operations?.slice(i + 1) || [])]);
    indexEdit.current = null;
    setShowModal(false);
  };

  const listGroupConsumptions = groupConsumptions?.map((x) => ({
    value: x.code,
    label: `${x.code} - ${x.description ? x.description : ""}`,
    consumption: x.consumption,
  }));

  return (
    <>
      <Row center="xs">
        <TABLE>
          {!!operations?.length && (
            <THEAD>
              <TRH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="code" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="name" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="description" />
                  </TextSpan>
                </TH>
                <TH style={{ width: 120 }} textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="group.consumption" />
                  </TextSpan>
                </TH>
                <TH style={{ width: 120 }} textAlign="center">
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
            </THEAD>
          )}
          <TBODY>
            {operations?.map((operationItem, i) => (
              <TR key={`${i}-c`} isEvenColor={i % 2 === 0}>
                <TD>
                  <TextSpan apparence="s2">{operationItem?.idOperation}</TextSpan>
                </TD>
                <TD>
                  <TextSpan apparence="s2">{operationItem?.name}</TextSpan>
                </TD>
                <TD>
                  <TextSpan apparence="p2">{operationItem?.description}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="p2">{operationItem?.idGroupConsumption}</TextSpan>
                </TD>
                <TD textAlign="center" className="pr-3">
                  <TextSpan apparence="p2">
                    {floatToStringExtendDot(
                      listGroupConsumptions?.find((x) => x.value === operationItem?.idGroupConsumption)?.consumption,
                      2
                    )}
                  </TextSpan>
                </TD>
                <TD>
                  <Row className="m-0" around="xs">
                    <Button
                      size="Tiny"
                      status="Info"
                      appearance="ghost"
                      style={{ padding: 2 }}
                      onClick={() => changeEditIndex(i)}>
                      <EvaIcon name="edit-2-outline" />
                    </Button>
                    <Button
                      size="Tiny"
                      status="Danger"
                      appearance="ghost"
                      className="ml-1"
                      style={{ padding: 2 }}
                      onClick={() => onRemove(i)}>
                      <EvaIcon name="trash-2-outline" />
                    </Button>
                  </Row>
                </TD>
              </TR>
            ))}
          </TBODY>
        </TABLE>

        <ModalOperation
          show={showModal}
          listGroupConsumptions={listGroupConsumptions}
          handleClose={() => setShowModal(false)}
          onSave={(data) => onSave(indexEdit.current, data)}
          dataInitial={operations?.[indexEdit.current]}
        />

        <Row className="m-0" center="xs">
          <Button
            size="Tiny"
            status="Info"
            className={`flex-between ml-4 mt-4`}
            onClick={() => changeEditIndex(operations?.length + 1)}>
            <EvaIcon name="plus-circle-outline" className="mr-1" />
            <FormattedMessage id="add" />
          </Button>
        </Row>
      </Row>
    </>
  );
}
