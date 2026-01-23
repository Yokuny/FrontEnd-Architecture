import { Button, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import AddStatistic from "./AddStatistic";

export default function ListStatistic(props) {
  const { statistics, onChangeItem, onChange, idMachine } = props;

  return (
    <>
      {statistics?.map((statistcItem, i) => (
        <AddStatistic
          key={`${i}-statistcItem`}
          statistcItem={statistcItem}
          onChangeItem={(prop, value) => onChangeItem(i, prop, value)}
          idMachine={idMachine}
          onRemove={() =>
            onChange(
              "statistics",
              statistics?.filter((x, z) => z != i)
            )
          }
        />
      ))}
      <Button
        size="Tiny"
        status="Success"
        className={`flex-between ml-4`}
        onClick={() => {
          if (statistics?.length) {
            onChange("statistics", [...statistics, {}]);
            return;
          }
          onChange("statistics", [{}]);
        }}
      >
        <EvaIcon name="plus-circle-outline" className="mr-1" />
        <FormattedMessage id="add.statistic" />
      </Button>
    </>
  );
}
