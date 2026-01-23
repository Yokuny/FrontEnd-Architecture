import * as React from "react";
import Row from "@paljs/ui/Row";
import { FormattedMessage } from "react-intl";
import {
    UploadFile,
    TextSpan,
} from "../";


const AddDocument = ({ onFileChange }) => {
    const [internalFiles, setInternalFiles] = React.useState([]);

    const onAddFile = (file) => {
        setInternalFiles([...file]);
        onFileChange([...file]);
    }

    const onRemoveFile = (index) => {
        const filesToAdd = internalFiles.filter((x, i) => i !== index);
        setInternalFiles(filesToAdd);
        onFileChange(filesToAdd);
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
                }} />
            <Row between="xs" className="pl-4 pr-4">
                <TextSpan apparence="p2" hint={true} className="ml-2">
                    <FormattedMessage id="documents.allowed" />
                </TextSpan>
            </Row>
        </>
    )
}

export default AddDocument;
