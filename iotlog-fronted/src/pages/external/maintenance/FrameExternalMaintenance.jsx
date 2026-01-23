import { Card, CardBody } from "@paljs/ui";
import { connect } from "react-redux";

function FrameExternalMaintenance(props) {
  const idEnterprise = props.enterprises?.length
  ? props.enterprises[0]?.id
  : null
  return (
    <>
      <Card style={{ display: 'flex', height: 'calc(100vh - 220px)' }}>
        {idEnterprise === "64949cab-dfb5-4dbe-ab4e-cf74e10b5fa6" && <iframe
          frameBorder="0"
          style={{ borderRadius: 4 }}
          src="https://app.powerbi.com/view?r=eyJrIjoiZWE2YTA5YjEtM2I2Yi00YTUyLThhMTgtMmI2YTgxYzhjYTllIiwidCI6IjUwOTJkNjkxLThjODAtNGUzYy1iYjMyLWFhMzQyZTdiNzI4NSJ9"
          height="100%"
        />}
      </Card>
    </>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(FrameExternalMaintenance);
