import { TABLE } from "../../../../components/Table"
import { BodyTable } from "./Body"
import { HeaderTableList } from "./Header"

export const TableList = (props) => {

  return (
    <TABLE style={{ borderCollapse: 'collapse' }}>
      <HeaderTableList />
      <BodyTable
        isLoading={props.isLoading}
        data={props.data}
        search={props.search}
        query={props.query}
      />
    </TABLE>
  )
}
