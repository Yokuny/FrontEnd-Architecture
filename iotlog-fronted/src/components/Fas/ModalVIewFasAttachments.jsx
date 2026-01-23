import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui";
import {
    Modal,
    SpinnerFull,
    Fetch
} from "../";
import { toast } from "react-toastify";
import { translate } from "../language";
import React from "react";
import { getFormatFromName } from "./Utils/Attachments";

const ModalViewFasAttatchment = ({
    show,
    documentRef,
    onClose = undefined,
}) => {
    const [document, setDocument] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const getPresigned = async () => {
        try {
            const response = await Fetch.get(`fas/presignedbylocation?location=${documentRef.url}`);
            if (response.data.invoiceUrl) {
                return response.data.invoiceUrl;
            } else {
                toast.error(translate("error.download"));
                return null;
            }
        } catch (error) {
            toast.error(translate("error.download"));
            return null;
        }
    };

    const fetchPresigned = React.useMemo(async () => {
        if (documentRef) {
            setIsLoading(true);
            const presigned = await getPresigned();
            if (presigned)
                setDocument({
                    name: documentRef.name,
                    format: isImageOrPdf(documentRef),
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

    const isImageOrPdf = (file) => {
        const format = getFormatFromName(file.name)
        if (["png", "jpg"].includes(format)) {
            return "image";
        } else if (format === "pdf") {
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
                type="application/pdf"
                width="100%"
                height="100dvh"
            >
                <a href="https://iotlog.bykonz.com"></a>
            </object>
        );
    }
    const renderImage = () => {
        return (
            <img
                style={{ width: "100%", maxHeight: "70dvh", objectFit: 'contain' }}
                src={document?.url}
            />
        );
    };

    const downloadPresigned = async () => {
        try {
            if (document.url) {
                window.open(document.url);
            } else {
                toast.error(translate("error.download"));
            }
        } catch (error) {
            toast.error(translate("error.download"));
        }
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
                                onClick={downloadPresigned}
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

export default ModalViewFasAttatchment;
