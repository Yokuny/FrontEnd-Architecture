const { Fetch } = require("../../");
const { toast } = require("react-toastify");

export const preUploadAttachments = async ({ files, intl, supplierCanView = false }) => {
  if (!files?.length) {
    toast.warn(intl.formatMessage({ id: "file.required" }));
    return [];
  }

  const fileForm = new FormData();
  files.forEach((file) => fileForm.append('files', file));
  fileForm.append("supplierCanView", supplierCanView);
  fileForm.append("status", "awaiting.create.confirm");

  const response = await Fetch.post("/fas/add-attachment", fileForm);
  if (response.status === 200) {
    return response.data.files
  } else {
    toast.error(intl.formatMessage({ id: "service.add.error" }));
    return [];
  }
}

export const getFormatFromName = (fileName) => {
  const format = fileName?.split(".");
  return format?.length > 0 ? format[format?.length - 1] : "";
}
