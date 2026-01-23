import React from 'react';
import { Accordion } from "@paljs/ui/Accordion";
import { connect } from 'react-redux';
import ListOptionsCharts from "../../../components/ChartEditor/ListOptionsCharts";
import AddGroup from "./title/AddGroup";
import ItemGroupContent from "./ItemGroupContent";

const listCharts = ListOptionsCharts.map((x) => x.items).flat();

function ListGroupItens(props) {
  const { listGroup, idDashboard } = props;

  return (
    <>
      <Accordion multi>
        {listGroup?.map((x, i) => (
          <ItemGroupContent
            key={`${x.id}.${i}`}
            chartsList={listCharts}
            itemGroup={x}
            idDashboard={idDashboard}
            id={x.id}
          />
        ))}
      </Accordion>
      <AddGroup
        idDashboard={idDashboard}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  listGroup: state.dashboard.listGroup,
});

export default connect(mapStateToProps, undefined)(ListGroupItens);
