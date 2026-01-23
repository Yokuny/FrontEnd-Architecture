import { Button, EvaIcon } from "@paljs/ui"

export default function CopyButton({ onApplyCopy, isLoading = false }) {

  return (
    <>
      <Button
        size="Tiny"
        status="Info"
        appearance="ghost"
        style={{ padding: 2 }}
        onClick={onApplyCopy}
        disabled={isLoading}
      >
        <EvaIcon name="arrowhead-right-outline" />
      </Button>
    </>
  );
}
