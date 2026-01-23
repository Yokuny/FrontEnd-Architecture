import { Tab, Tabs } from "@paljs/ui";
import { useIntl } from "react-intl";
import DataTimelineStatus from "./TimelineStatus";
import ListPoints from "./Positions/ListPoints";

export default function DataFooter(props) {
  const { item } = props;

  const intl = useIntl();

  return (
    <>
      <Tabs
        className="mt-2"
        fullWidth
        style={{ marginLeft: -16, marginRight: -16 }}
      >
        <Tab
          icon="more-vertical-outline"
          title={intl.formatMessage({ id: "timeline" })}
          responsive
        >
          <DataTimelineStatus idMachine={item?.machine?.id} />
        </Tab>
        <Tab
          icon="pin-outline"
          title={intl.formatMessage({ id: "positions" })}
          responsive
        >
          <ListPoints item={item} />
        </Tab>
      </Tabs>
    </>
  );
}
