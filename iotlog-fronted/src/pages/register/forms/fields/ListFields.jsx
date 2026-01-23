import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ReactSortable } from "react-sortablejs";
import ItemViewField from "./ItemViewField";

const ListFields = (props) => {
  const {
    data,
    onChange,
    onChangeItem,
    onRemoveItem,
    onSetFieldItem,
    level,
    renderHeader,
    idEnterprise,
    noShowInList = false,
    table = false,
  } = props;

  function handleAddField() {
    if (data?.fields?.length) {
      onChange("fields", [
        ...data?.fields,
        {
          id: data?.fields?.length + 1,
          isVisiblePublic: true,
        },
      ]);

      return;
    }

    onChange("fields", [{ id: 1 }]);
  }

  function onHandleSetFieldItem(index, data) {
    onSetFieldItem(index, data);
  }

  return (
    <>
      <Col breakPoint={{ md: 12 }}>
        {!!renderHeader && renderHeader()}
        <ReactSortable
          list={data?.fields || []}
          setList={(data) => onChange("fields", data)}
        >
          {data?.fields?.map((item, i) => (
            <>
              <ItemViewField
                key={item.id}
                field={item}
                allFields={data?.fields}
                handleSave={(data) => onHandleSetFieldItem(i, data)}
                onRemove={() => onRemoveItem(i)}
                level={level}
                table={table}
                noShowInList={noShowInList || false}
                idEnterprise={idEnterprise}
              />
            </>
          ))}
        </ReactSortable>
        <Row center="xs" middle="xs">
          <Button
            size="Tiny"
            status={"Info"}
            className="mt-1 mb-2 flex-between"
            appearance="ghost"
            disabled={data?.fields?.length > 0
              && !data?.fields[data?.fields?.length - 1]?.description
            }
            onClick={handleAddField}
          >
            <EvaIcon className="mr-1" name="file-add-outline" />
            <FormattedMessage id="add.field" />
          </Button>
        </Row>
      </Col>
    </>
  );
};

export default ListFields;
