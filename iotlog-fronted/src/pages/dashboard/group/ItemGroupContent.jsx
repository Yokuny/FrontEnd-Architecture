import { Row } from "@paljs/ui";
import { nanoid } from "nanoid";
import { AccordionItem } from '../../../components/Accordion/Item'
import AddChart from "./charts/AddChart";
import LayoutCharts from "./charts/LayoutCharts";
import TitleGroup from "./title/TitleGroup";

export default function ItemGroupContent(props) {

  const { id, chartsList, idDashboard, itemGroup } = props;

  return (
    <>
      <AccordionItem
        uniqueKey={itemGroup.id}
        title={<TitleGroup key={nanoid(4)} data={itemGroup} idDashboard={idDashboard} />}
      >
        <LayoutCharts
          id={id}
          chartsList={chartsList}
          itemGroup={itemGroup}
          idDashboard={idDashboard}
        />
        <Row middle="xs" center="xs">
          <AddChart idDashboard={idDashboard} idGroup={itemGroup.id} />
        </Row>
      </AccordionItem>
    </>
  )
}
