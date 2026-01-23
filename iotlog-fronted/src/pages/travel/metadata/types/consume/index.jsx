import { AccordionItem, EvaIcon } from "@paljs/ui";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { TextSpan } from "../../../../../components";
import ConsumeData from "../../consume-data";

const ConsumeTypeReport = (props) => {
  const { data } = props;
  const intl = useIntl();
  const theme = useTheme();

  return (
    <>
      {!!(data?.dateTimeEnd || data?.dateTimeArrivalDate) && (
        <AccordionItem
          key="consume"
          uniqueKey="consume"
          style={{ padding: 0 }}
          title={
            <>
              <EvaIcon
                name="droplet"
                options={{ fill: theme.colorPrimary500 }}
              />

              <TextSpan className="ml-2" apparence="s1">
                {`${intl.formatMessage({
                  id: "consume",
                })} ${intl.formatMessage({ id: "total" })}`}
              </TextSpan>
            </>
          }
        >
          <ConsumeData />
        </AccordionItem>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.voyage.data,
});

export default connect(mapStateToProps, undefined)(ConsumeTypeReport);
