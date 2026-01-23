import { Row, Col } from "@paljs/ui";
import PermissionVisibleBasic from "../../../../components/Permission/PermissionVisibleBasic";
import { LabelIcon } from "../../../../components";

const AddFormPermissions = ({ data, onChange, intl, idEnterprise }) => {
  return (
    <Row>
      <Col breakPoint={{ md: 12 }}>
        <LabelIcon
          iconName="eye-outline"
          title={`${intl.formatMessage({
            id: "visible.placeholder",
          })} *`}
        />
        <PermissionVisibleBasic
          idEnterprise={idEnterprise}
          onChangeUsers={(value) => onChange("viewUsers", value)}
          onChangeVisible={(value) => onChange("viewVisibility", value)}
          users={data?.viewUsers}
          visible={data?.viewVisibility}
        />
      </Col>

      <Col breakPoint={{ md: 12 }}>
        <LabelIcon
          iconName="settings-outline"
          title={`${intl.formatMessage({
            id: "config.form",
          })} *`}
        />
        <PermissionVisibleBasic
          idEnterprise={idEnterprise}
          placeholderId="config.form"
          onChangeUsers={(value) => onChange("editUsers", value)}
          onChangeVisible={(value) => onChange("editVisibility", value)}
          users={data?.editUsers}
          visible={data?.editVisibility}
        />
      </Col>

      <Col breakPoint={{ md: 12 }}>
        <LabelIcon
          iconName="edit-outline"
          title={`${intl.formatMessage({
            id: "add.form",
          })} *`}
        />
        <PermissionVisibleBasic
          idEnterprise={idEnterprise}
          placeholderId="add.form"
          onChangeUsers={(value) => onChange("fillUsers", value)}
          onChangeVisible={(value) => onChange("fillVisibility", value)}
          users={data?.fillUsers}
          visible={data?.fillVisibility}
        />
      </Col>
      <Col breakPoint={{ md: 12 }}>
        <LabelIcon
          iconName="trash-outline"
          title={`${intl.formatMessage({
            id: "delete.form.board",
          })} *`}
        />
        <PermissionVisibleBasic
          idEnterprise={idEnterprise}
          placeholderId="delete.form.board"
          onChangeUsers={(value) => onChange("deleteFormBoardUsers", value)}
          onChangeVisible={(value) =>
            onChange("deleteFormBoardVisibility", value)
          }
          users={data?.deleteFormBoardUsers}
          visible={data?.deleteFormBoardVisibility}
        />
      </Col>
      <Col breakPoint={{ md: 12 }}>
        <LabelIcon
          iconName="edit-2-outline"
          title={`${intl.formatMessage({
            id: "edit.form.filling",
          })} *`}
        />
        <PermissionVisibleBasic
          idEnterprise={idEnterprise}
          placeholderId="edit.form.filling"
          onChangeUsers={(value) => onChange("editFormFillingUsers", value)}
          onChangeVisible={(value) =>
            onChange("editFormFillingVisibility", value)
          }
          users={data?.editFormFillingUsers}
          visible={data?.editFormFillingVisibility}
        />
      </Col>

      {data.typeForm === "RVE" && (
        <Col breakPoint={{ md: 12 }}>
          <LabelIcon
            iconName="bell-off-outline"
            title={`${intl.formatMessage({
              id: "justify",
            })} *`}
          />
          <PermissionVisibleBasic
            idEnterprise={idEnterprise}
            placeholderId="justify"
            onChangeUsers={(value) => onChange("justifyUsers", value)}
            onChangeVisible={(value) => onChange("justifyVisibility", value)}
            users={data?.justifyUsers}
            visible={data?.justifyVisibility}
          />
        </Col>
      )}

      {["RDO", "Sondagem","NOON_REPORT"].includes(data.typeForm) && (
        <Col breakPoint={{ md: 12 }}>
          <LabelIcon
            iconName="slash-outline"
            title={`${intl.formatMessage({
              id: "block",
            })} *`}
          />
          <PermissionVisibleBasic
            idEnterprise={idEnterprise}
            placeholderId="block"
            onChangeUsers={(value) => onChange("blockUsers", value)}
            onChangeVisible={(value) => onChange("blockVisibility", value)}
            users={data?.blockUsers}
            visible={data?.blockVisibility}
          />
        </Col>
      )}
    </Row>
  );
};

export default AddFormPermissions;
