import { Button, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";

export default function AddButton({
  onClick,
  size = 'Tiny',
  disabled = false,
  textId = 'add',
  appearance = 'filled',
  className = '',
  iconName = 'plus-circle-outline',
  status = 'Info',
}) {
  return (
    <>
      <Button
        onClick={onClick}
        style={{ marginRight: '1rem' }}
        size={size}
        disabled={disabled}
        status={status}
        appearance={appearance}
        className={["flex-between mt-8", className]}
      >
        <EvaIcon name={iconName} className="mr-1" />
        <FormattedMessage id={textId} />
      </Button>
    </>
  )
}
