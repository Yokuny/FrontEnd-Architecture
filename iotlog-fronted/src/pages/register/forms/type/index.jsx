import CalculatedField from "./CalculatedField";
import DateTimeField from "./DateTimeField";
import FileUploadField from "./FileUploadField";
import FunctionTypeField from "./FunctionTypeField";
import GroupField from "./Group";
import NumberTypeField from "./NumberTypeField";
import SelectFenceField from "./SelectFenceField";
import SelectOptions from "./SelectOptions";
import TableField from "./Table";

export default function FormType({ type, onChange, data, allFields, idEnterprise }) {
  switch (type) {
    case "number": {
      return (
        <>
          <NumberTypeField onChange={onChange} data={data} />
        </>
      );
    }
    case "date":
    case "datetime": {
      return (
        <>
          <DateTimeField onChange={onChange} data={data} />
        </>
      );
    }
    case "group": {
      return (
        <>
          <GroupField onChange={onChange} data={data} idEnterprise={idEnterprise} />
        </>
      );
    }
    case "table": {
      return (
        <>
          <TableField onChange={onChange} data={data} idEnterprise={idEnterprise} />
        </>
      );
    }
    case "select":
    case "radio": {
      return (
        <>
          <SelectOptions onChange={onChange} data={data} />
        </>
      );
    }
    case "calculated": {
      return (
        <>
          <CalculatedField
            onChange={onChange}
            data={data}
            allFields={allFields}
          />
        </>
      );
    }
    case "functionfield": {
      return (
        <>
          <FunctionTypeField onChange={onChange} data={data} />
        </>
      );
    }
    case "selectFence": {
      return (
        <>
          <SelectFenceField onChange={onChange} data={data} />
        </>
      );
    }
    case 'upload': {
      return (
        <>
          <FileUploadField onChange={onChange} data={data} />
        </>
      )
    }
    default:
      return <></>;
  }
}
