import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui";
import {
    Modal,
    SpinnerFull
} from "../";
import { downloadDocument, getPresignedUrl } from "./Utils";
import React from "react";

const ModalViewDocument = ({
    show,
    documentRef,
    onClose = undefined,
}) => {
    const [document, setDocument] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchPresigned = React.useMemo(async () => {
        if (documentRef) {
            setIsLoading(true);
            const presigned = await getPresignedUrl(
                documentRef.s3LocationUrl,
                "document/presigned"
            );
            setDocument({
                name: documentRef.name,
                format: isImageOrPdf(documentRef.format),
                url: presigned
            });
            setIsLoading(false);
        }
    }, [documentRef]);

    const handleClose = () => {
        setDocument(null);
        setIsLoading(false);
        onClose();
    };

    const isImageOrPdf = (format) => {
        if (["image/png", "image/jpg"].includes(format)) {
            return "image";
        } else if (format === "application/pdf") {
            return "pdf";
        } else {
            return "N/A";
        }
    };

    const renderDocument = () => {
        if (document?.format === "pdf") {
            return renderPdf();
        } else if (document?.format === "image") {
            return renderImage();
        } else {
            return <></>;
        }
    };

    const renderPdf = () => {
        return (
            <object
                style={{ height: "100vh" }}
                data={document?.url}
                width="100%"
                height="100vh"
            >
                <a href="https://siot-portal.konztec.com.br"></a>
            </object>
        );
    }
    const renderImage = () => {
        return (
            <img
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                src={document?.url}
            />
        );
    };

    return (
        <>
            <Modal
                size="Large"
                show={show}
                title={document?.name ? document?.name : "N/A"}
                onClose={handleClose}
                styleContent={{ height: '100vh', maxHeight: "calc(100vh - 250px)" }}
                renderFooter={() => (
                    <CardFooter>
                        <Row end="xs" className="m-0">
                            <Button
                                size="Small"
                                className="flex-between"
                                onClick={() => downloadDocument(
                                    documentRef.s3LocationUrl,
                                    "/document/presigned"
                                )}
                            >
                                <EvaIcon name="download-outline" className="mr-1" />
                                <FormattedMessage id="download" />
                            </Button>
                        </Row>
                    </CardFooter>
                )}
            >
                {document?.format && renderDocument()}

            </Modal>
            <SpinnerFull isLoading={isLoading} />
        </>

    );
}

export default ModalViewDocument;
