import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { DeleteConfirmation, Fetch, TextSpan } from "../../../components";

export default function DeleteItemRow({
  itemData,
  setIsLoading,
  onDeleteSuccess
}) {
  const intl = useIntl();

  const onDelete = (id) => {
    if (!id) return;
    setIsLoading(true);
    Fetch.delete(`/formdata?id=${id}`)
      .then((_) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        onDeleteSuccess(id)
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Tooltip
        placement="top"
        content={
          <>
            <TextSpan apparence="s2">
              <FormattedMessage id="delete" />
            </TextSpan>
          </>
        }
        trigger="hint"
      >
        <DeleteConfirmation
          onConfirmation={() =>
            onDelete(itemData.id)
          }
          message={intl.formatMessage({
            id: "delete.message.default",
          })}
        >
          <Button
            size="Tiny"
            status="Danger"
            appearance="ghost"
            style={{ padding: 1 }}
            className="ml-3"
          >
            <EvaIcon name="trash-2-outline" />
          </Button>
        </DeleteConfirmation>
      </Tooltip>
    </>
  )
}
