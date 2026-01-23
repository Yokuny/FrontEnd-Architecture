import { nanoid } from "nanoid";
import { useFetch } from "../../../components/Fetch/Fetch"
import ItemRowListDashboard from "./ItemRow";
import { Spinner } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { FormattedMessage } from "react-intl";

const Content = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
`

export default function FolderContent(props) {
  const { item, hasPermissionViewer, hasPermissionEditor, isShowEnterprise } = props;

  const theme = useTheme();

  const { data, isLoading } = useFetch(`/dashboard/folder/files?id=${item?.id}`);

  if (isLoading) {
    return <>
      <Content>
        <Spinner style={{ position: 'relative', backgroundColor: theme.backgroundBasicColor1 }}></Spinner>
      </Content>
    </>
  }

  if (!data?.length) {
    return <Content className="mb-4">
      <TextSpan apparence="s2" hint>
        <FormattedMessage id="folder.empty" />
      </TextSpan>
    </Content>
  }

  return (<>
    {data?.map((x, i) => <ItemRowListDashboard
      key={`${i}-${nanoid(3)}`}
      item={x}
      hasPermissionViewer={hasPermissionViewer}
      hasPermissionEditor={hasPermissionEditor}
      isShowEnterprise={isShowEnterprise}
      status="Info"
      isItemFolder={true}
    />)
    }
  </>)
}
