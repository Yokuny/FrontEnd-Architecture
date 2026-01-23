import { Col } from "@paljs/ui";
import {
  ColCenter,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../components";

const LastAccessDashboard = (props) => {
  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow colorTextTheme={"colorWarning600"}>
          <Col breakPoint={{ md: 4 }} className="col-flex-center">
            <TextSpan apparence="s1">{item.user?.name}</TextSpan>
          </Col>
          <ColCenter breakPoint={{ md: 5 }}>
            <TextSpan apparence="s1">{item.description}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 2 }}></ColCenter>
          <ColCenter breakPoint={{ md: 1 }}></ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <ListSearchPaginated
        renderItem={renderItem}
        contentStyle={{
          justifyContent: "space-between",
          padding: 0,
        }}
        pathUrlSearh="/tracking/list"
        filterEnterprise
        noShowSearch={true}
      />
    </>
  );
};

export default LastAccessDashboard;
