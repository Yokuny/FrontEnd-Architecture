import { TABLE } from "../../Table"
import { ListBody } from "./ListBody"
import { ListHeader } from "./ListHeader"

export const ListTable = (props) => {
    return (
        <TABLE style={{ borderCollapse: 'collapse' }}>
            <ListHeader />
            <ListBody
                isLoading={props.isLoading}
                data={props.data}
                search={props.search}
                query={props.query}
                onOpenQRCode={props.onOpenQRCode}
            />
        </TABLE>
    )
}
