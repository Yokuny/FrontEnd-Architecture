import {
    Fetch
} from "../";
import { toast } from "react-toastify";
import { translate } from "../language";

export const getPresignedUrl = async (url, presignedEndpoint) => {
    try {
        const response = await Fetch.get(`${presignedEndpoint}?location=${url}`);
        if (response.data.presignedUrl) {
            return response.data.presignedUrl;
        } else {
            toast.error(translate("Erro ao baixar arquivo"));
        }
    } catch (error) {
        toast.error(translate("Erro ao baixar arquivo"));
    }
};

export const downloadDocument = async (url, presignedEndpoint) => {
    const downloadUrl = await getPresignedUrl(
        url,
        presignedEndpoint
    );
    window.open(downloadUrl);
}

export const downloadObjectFromDataURL = (objectName, dataURL) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = objectName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}
