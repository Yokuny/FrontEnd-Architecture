import { CardFooter } from "@paljs/ui/Card";
import { useIntl, FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import React from "react";
import { downloadObjectFromDataURL } from "./Utils";
import {
    Modal,
    SpinnerFull
} from "../";

const ModalViewQrCode = ({
    show,
    folder,
    onClose = undefined,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataUrl, setDataUrl] = React.useState("");
    const intl = useIntl();

    React.useMemo(() => {
        if (!folder) return null;
        QRCode.toDataURL(
            `${window.location.origin}/public-folder?id=${folder?.id}`,
            {
                quality: 1,
                scale: 9,
            },
            function (error, url) {
                if (error)
                    toast.error(<FormattedMessage id="error.generating.qr" />)
                setDataUrl(url);
            }
        );
    }, [show]);

    if (!folder) return (<></>);

    const handleClose = () => {
        setIsLoading(false);
        onClose();
    };

    const downloadQr = () => {
        downloadObjectFromDataURL(
            `qr-code-${folder.name}-${intl.formatMessage({ id: folder.visibility })}.png`,
            dataUrl
        );
    }

    const renderQrCode = () => {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <img
                    style={{
                        width: '80vw',
                        height: 'auto',
                        maxHeight: "80vh",
                        objectFit: 'contain'
                    }}
                    src={dataUrl}
                />
            </div>
        );
    }

    return (
        <>
            <Modal
                size="Small"
                show={show}
                title={intl.formatMessage({ id: "qr.code" })}
                onClose={handleClose}
                renderFooter={() => (
                    <CardFooter>
                        <Row center="xs" className="m-0">
                            <Button
                                size="Tiny"
                                className="flex-between"
                                onClick={downloadQr}
                                status="Basic"
                                appearance="ghost"
                            >
                                <EvaIcon name="download-outline" className="mr-1" />
                                <FormattedMessage id="download" />
                            </Button>
                        </Row>
                    </CardFooter>
                )}
            >
                {renderQrCode()}
            </Modal>
            <SpinnerFull isLoading={isLoading} />
        </>

    );
}

export default ModalViewQrCode;
