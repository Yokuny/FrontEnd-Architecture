import { Button, Card, CardHeader, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ListSearchPaginated } from "../../components";
import GroupRenderItem from "./GroupRenderItem";
import { connect } from "react-redux";

function Group(props) {
  const navigate = useNavigate();

  const hasPermissionAdd = props.items?.some((x) => x === "/group-add");

  function handleAddGroup() {
    if (!hasPermissionAdd) {
      return;
    }
    navigate("/group-add");
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="md" middle="md" className="pl-4 pr-4">
            <FormattedMessage id="group" />

            {hasPermissionAdd && <Button
              status="Primary"
              type="button"
              size="Small"
              onClick={handleAddGroup}
            >
              <FormattedMessage id="add" />
            </Button>}
          </Row>
        </CardHeader>

        <ListSearchPaginated
          renderItem={(props) => <GroupRenderItem
            hasPermissionEdit={hasPermissionAdd}
            {...props} />}
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
          pathUrlSearh={`/assetstatus/group/list`}
          filterEnterprise
        />
      </Card>
    </>
  );
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(Group);
