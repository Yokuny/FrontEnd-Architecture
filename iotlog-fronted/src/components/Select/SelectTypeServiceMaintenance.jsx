import React from "react";
import { injectIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import SelectCreatable from "./SelectCreatable";

const SelectTypeServiceMaintenance = ({ onChange, value, intl }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useLayoutEffect(() => {
    findData();
  }, []);

  const findData = () => {
    setIsLoading(true);
    const query = `query {
      typesServiceMaintenance {
          id,
          description
        }
      }`;
    Fetch.post("/graphql", { query })
      .then((response) => {
        setData(
          response.data?.data?.typesServiceMaintenance?.map((x) => ({
            label: x.description,
            value: x.id,
          }))
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <SelectCreatable
        options={data}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "select.type.service.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        menuPosition="fixed"
      />
    </React.Fragment>
  );
};

export default injectIntl(SelectTypeServiceMaintenance);
