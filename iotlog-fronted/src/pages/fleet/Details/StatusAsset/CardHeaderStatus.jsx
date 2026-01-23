import { Badge, Button, CardHeader, EvaIcon, Row } from "@paljs/ui";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { setMachineDetailsSelected } from "../../../../actions";
import { TextSpan } from "../../../../components";
import { SkeletonThemed } from "../../../../components/Skeleton";
import { getStatusIcon } from "../../Status/Base";

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const CardHeaderStatus = (props) => {

  const theme = useTheme();

  const { data, isLoading, item } = props;

  const onClose = () => {
    props.setMachineDetailsSelected(undefined);
    const request = new URL(window.location.href).searchParams.get("request");
    if (request) {
      window.location.href = `${window.location.origin}/fleet-manager`;
    }
  }

  const statusToShow = getStatusIcon(data?.data?.status, theme);

  return (
    <>
      <CardHeader style={statusToShow?.bgColor && { paddingBottom: 60 }}>
        <Row between="xs" className="ml-1">
          <Column>
            <TextSpan apparence="s1">
              {item?.machine?.code ? `${item?.machine?.code} - ` : ""}
              {item?.machine?.name}
            </TextSpan>
            {isLoading ? (
              <SkeletonThemed width={30} />
            ) : (
              <>
                {statusToShow?.bgColor && (
                  <RowContent className="mt-1">
                    <Badge
                      position=""
                      style={{
                        position: "inherit",
                        backgroundColor: statusToShow.bgColor,
                      }}
                    >
                      <RowContent>{statusToShow.component}</RowContent>
                    </Badge>
                  </RowContent>
                )}
              </>
            )}
          </Column>

          <div className="btn-aside-mobile-details-fleet">
            <Button
              size="Small"
              status="Danger"
              appearance="ghost"
              style={{ marginTop: -6 }}
              onClick={onClose}
            >
              <EvaIcon name="close-outline" />
            </Button>
          </div>
        </Row>
      </CardHeader>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setMachineDetailsSelected: (machineDetails) => {
    dispatch(setMachineDetailsSelected(machineDetails));
  },
});

export default connect(undefined, mapDispatchToProps)(CardHeaderStatus);
