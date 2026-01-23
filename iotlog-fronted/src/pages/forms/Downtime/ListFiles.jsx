import { Button, EvaIcon } from "@paljs/ui";

import { useState } from "react";
import ModalFiles from "./ModalFiles";

export default function ListFiles({ files }) {

  const [isOpenFilesModal, setIsOpenFilesModal] = useState(false);

  return (
    <>
      <Button
        size="Tiny"
        appearance="ghost"
        style={{ padding: 2 }}
        status={files?.length ? "Primary" : "Basic"}
        onClick={() => setIsOpenFilesModal(true)}
        disabled={!files?.length}
      >
        <EvaIcon name="file-outline" />
      </Button>

     <ModalFiles
        files={files}
        isOpenFilesModal={isOpenFilesModal}
        setIsOpenFilesModal={setIsOpenFilesModal}
     />
    </>
  );
}
