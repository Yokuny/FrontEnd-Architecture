import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import Select from "@paljs/ui/Select";


const SelectFasType = ({
  onChange,
  value,
  isDisabled = false,
  noRegularization,
  items,
  isMulti=false
}) => {
  const [isLoading, setIsLoading] = React.useState();
  const intl = useIntl();
  const [selectOptions, setSelectOptions] = React.useState();

  React.useLayoutEffect(() => {
    if (!selectOptions && !!items.length && noRegularization !== undefined) {
      const options = [
        { value: 'Normal', label: 'Normal' },
        { value: 'Emergencial', label: 'Emergencial' },
        { value: "Docagem - Normal", label: "Docagem - Normal" },
        { value: "Docagem - Emergencial", label: "Docagem - Emergencial" },
      ];
      setSelectOptions(options);
      if (noRegularization === false) {
        options.unshift({ value: 'Regularizacao', label: 'Regularização' });
        options.push(
          { value: "Docagem - Regularizacao", label: "Docagem - Regularização" }
        );
      }
    }
  }, [selectOptions, items, noRegularization]);

  return (
    <>
      <Select
        options={selectOptions}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "select.option",
        })}
        isLoading={isLoading}
        onChange={onChange}
        isSearchable
        value={value}
        isDisabled={isDisabled}
        menuPosition="fixed"
        isMulti={isMulti}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(SelectFasType);
