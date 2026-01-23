import * as React from "react";
import Row from "@paljs/ui/Row";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@paljs/ui";
import {
  UploadFile,
  TextSpan,
} from "../";


const AddOsAttachment = ({ onFileChange }) => {

  const [internalChecked, setInternalChecked] = React.useState(true);
  const [internalFiles, setInternalFiles] = React.useState([]);

  const onAddFile = (file) => {
    setInternalFiles([...file]);
    onFileChange({ files: [...file], supplierCanView: internalChecked });
  }

  const onRemoveFile = (index) => {
    const filesToAdd = internalFiles.filter((x, i) => i !== index);
    setInternalFiles(filesToAdd);
    onFileChange({ files: filesToAdd, supplierCanView: internalChecked });
  }

  const handleCheckboxChange = () => {
    onFileChange({ files: internalFiles, supplierCanView: !internalChecked });
    setInternalChecked(!internalChecked);
  }

  return (
    <>
      <UploadFile
        onAddFiles={onAddFile}
        files={internalFiles}
        colMd={3}
        onRemoveFile={onRemoveFile}
        accept={{
          'image/png': ["png"],
          'image/jpeg': ["jpg", "jpeg"],
          'application/pdf': ["pdf"],
          'application/vnd.ms-excel': ["xls"],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ["xlsx"],
          'text/csv': ["csv"],
          'video/mp4': ["mp4"],
          'video/mpeg': ["mpeg"],
        }} />
      <Row between="xs" className="pl-4 pr-4">
        <Row>
          <Checkbox
            checked={internalChecked}
            onChange={handleCheckboxChange}
            className="ml-2" />
          <TextSpan apparence="p2" hint={true} className="ml-2">
            <FormattedMessage id="supplier.can.view" />
          </TextSpan>
        </Row>
        <TextSpan apparence="p2" hint={true} className="ml-2">
          <FormattedMessage id="attachments.allowed" />
        </TextSpan>
      </Row>
    </>
  )
}

export default AddOsAttachment;
