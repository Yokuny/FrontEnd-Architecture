import { Button, EvaIcon } from "@paljs/ui";
import { useIntl } from "react-intl";
import { Li, RowCenter, Ul } from "./styles";
import { formatterMbKb } from "../../../components/Utils";
import { Fetch, Modal, TextSpan } from "../../../components";
import React from "react";
import { SkeletonThemed } from "../../../components/Skeleton";

export default function ModalFiles({ files, isOpenFilesModal, setIsOpenFilesModal }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileList, setFileList] = React.useState([]);

  const intl = useIntl();

  React.useEffect(() => {
    if (isOpenFilesModal) {
      getData();
    }
  }, [isOpenFilesModal]);

  const getData = () => {
    setIsLoading(true);
    Fetch.post('/file/formdata/presigned',
      {
        files: files.map(x => x.key)
      })
      .then((response) => {
        const listReponse = (response.data || [])
        if (listReponse?.length) {
          setFileList(
            listReponse?.map((fileUrlItem) => {
              const file = files.find(x => fileUrlItem?.url?.includes(x.key));
              return {
                ...file,
                urlPreview: fileUrlItem?.urlPreview,
                url: fileUrlItem.url,
                name: file?.name || file?.filename || file?.key,
                size: file?.size || 0
              };
            })
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return <Modal
    show={isOpenFilesModal}
    hideOnBlur={true}
    title={intl.formatMessage({ id: "files" })}
    onClose={() => setIsOpenFilesModal(false)}
  >
    <div className="overflow-y-auto max-h-96">
      {isLoading
        ? <SkeletonThemed height={40} count={3} />
        : <Ul>
          {fileList?.map((file, index) => (
            <Li key={index}>
              <div>
                <EvaIcon name="file-outline" className="mr-2" />
                <TextSpan apparence="s1">{file.name || file.filename}</TextSpan>{" "}
                <TextSpan apparence="p6">
                  ({formatterMbKb(file.size)})
                </TextSpan>
              </div>
              <RowCenter>
                {file?.urlPreview && <Button
                  size="Tiny"
                  disabled={!file.urlPreview}
                  status="Basic"
                  className="mr-3"
                  onClick={() => window.open(file.urlPreview, "_blank")}
                >
                  <EvaIcon name="eye-outline" />
                </Button>}
                <Button
                  size="Tiny"
                  status={file.url ? "Primary" : "Basic"}
                  disabled={!file.url}
                  onClick={() => window.open(file.url, "_blank")}
                >
                  <EvaIcon name="download-outline" />
                </Button>
              </RowCenter>
            </Li>
          ))}
        </Ul>}
    </div>
  </Modal>
}
