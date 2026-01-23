import styled from "styled-components";
import Tooltip from "@paljs/ui/Tooltip";
import { nanoid } from "nanoid";
import TrackerBlock from "./TrackerBlock";
import { TextSpan } from "../../components";
import { useLocation } from "react-router-dom";

const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: 31px;
  justify-content: center;
`

const RowLegend = styled.div`
  display: flex;
  height: 31px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;`

export default function Tracker({
  itens = [],
  onClick = (item, index) => { },
  showLegend = false,
}) {

  const isPanelDefault = useLocation().pathname.includes('panel-default-view');

  return <>
    <Content>
      {itens?.map((x, i) => {
        if (x.isEmpty) {
          return <>
            <TextSpan hint
            className={i > 0 ? "ml-1" : ""}
            style={{
              textAlign: "center",
              width: "16px",
            }}>
              -
            </TextSpan>
          </>
        }

        return x.tooltip
          ? <Tooltip
            key={nanoid(5)}
            placement="top"
            content={x.tooltip}
            trigger="hint"
          >
            <>
              <RowLegend>
                <TrackerBlock
                  onClick={() => onClick(x, i)}
                  // title={x.tooltip}
                  status={x.status}
                  onlyBorder={!!x.onlyBorder}
                  className={i > 0 ? "ml-1" : ""}
                  isPointer
                  key={nanoid(5)} />
                {!!showLegend && <TextSpan apparence="p2"
                  className="ml-1 mr-4"
                  hint>{x.tooltip}</TextSpan>}
              </RowLegend>
            </>
          </Tooltip>
          :<></>
      })}
    </Content>
  </>
}
