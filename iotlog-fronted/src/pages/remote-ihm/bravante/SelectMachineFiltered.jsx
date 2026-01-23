import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import styled, { useTheme } from "styled-components";
import { EvaIcon, Tooltip } from "@paljs/ui";
import { toast } from "react-toastify";
import moment from "moment";
import { connect } from "react-redux";
import { Fetch } from "../../../components";

const CustomOption = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-top: 3px;
  margin-left: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoundBackground = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${({ statusColor, theme }) => statusColor || theme.colorDanger500};
  border-radius: 10px;
`;

const TooltipHitbox = styled.div`
  height: 28px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SelectMachineFiltered = ({
  onChange,
  value,
  idEnterprise,
  isMulti = false,
  placeholder = "",
  disabled = false,
  renderLastActivity = false,
  onlyValue = false,
}) => {
  const intl = useIntl();
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else {
      onChange(undefined);
    }
  }, [idEnterprise]);

  React.useEffect(() => {
    if (data) generateOptions()
  }, [data]);

  function getLastStatesSensor(_options) {

    const idMachines = _options.map((o) => o.value)

    if (idMachines.length > 0) {
      try {
        Fetch.post('/sensorstate/last/activity', idMachines)
          .then((response) => {

            if (response.data.length === 0) return

            const formattedData = response.data.map((machine) => {

              const lastActivityMoment = moment(machine.lastActivity)
              const minutesFromNow = moment().diff(lastActivityMoment, 'minutes')

              let statusColor;
              let iconName;
              if (minutesFromNow <= 5) {
                statusColor = theme.colorSuccess600
                iconName = 'wifi'
              } else if (minutesFromNow > 5 && minutesFromNow < 60) {
                statusColor = theme.colorWarning500
                iconName = 'alert-triangle-outline'
              } else {
                statusColor = theme.colorDanger500
                iconName = 'wifi-off'
              }

              return {
                idMachine: machine.idMachine,
                lastActivity: lastActivityMoment.fromNow(),
                statusColor,
                iconName
              }
            })

            const newOptions = _options.map((option) => {
              const lastActivity = formattedData.find((la) => la.idMachine === option.value)?.lastActivity
              const statusColor = formattedData.find((la) => la.idMachine === option.value)?.statusColor
              const iconName = formattedData.find((la) => la.idMachine === option.value)?.iconName

              return ({
                ...option,
                name: option?.label,
                label:
                  <CustomOption>
                    {option.label}

                    <Tooltip
                      placement="right"
                      content={lastActivity || intl.formatMessage({ id: "nooptions.message" })}
                      style={{ color: 'black' }}
                      trigger="hint"
                    >
                      <TooltipHitbox>
                        {lastActivity ? <RoundBackground statusColor={statusColor}>
                          <IconWrapper>
                            <EvaIcon options={{ height: 14, width: 14, fill: 'white' }} name={iconName || 'wifi-off'} />
                          </IconWrapper>
                        </RoundBackground>
                          : <RoundBackground statusColor={"colorControl100"}>
                            <IconWrapper>
                              <EvaIcon options={{ height: 14, width: 14, fill: theme.textHintColor }} name={'wifi-off'} />
                            </IconWrapper>
                          </RoundBackground>}
                      </TooltipHitbox>
                    </Tooltip>

                  </CustomOption>
              })
            })

            setOptions(newOptions)

          }).catch((e) => {
            toast.error(intl.formatMessage({ id: "error.get" }))
          })

      } catch (e) {
        toast.error(intl.formatMessage({ id: "error.get" }))
      }
    }
  }

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/machine/enterprise?idEnterprise=${idEnterprise}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  function generateOptions() {
    const _options = data?.map((x) => ({ value: x.id, label: x.name }))
      ?.sort((a, b) => a?.label?.localeCompare(b?.label));

    setOptions(_options);

    if (renderLastActivity && _options?.length > 0) {
      getLastStatesSensor(_options)
    }
  }

  const valueSelected = onlyValue
    ? options?.find((o) => o.value === value) || null
    : value;

  return (
    <Select
      options={options}
      placeholder={intl.formatMessage({ id: placeholder || "machine.placeholder" })}
      isLoading={isLoading}
      onChange={onChange}
      value={valueSelected}
      noOptionsMessage={() => intl.formatMessage({ id: !idEnterprise ? "select.first.enterprise" : "nooptions.message" })}
      isClearable
      filterOption={(option, inputValue) => {
        return inputValue
          ? option?.data?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())
          : true
      }}
      isMulti={isMulti}
      menuPosition="fixed"
      isDisabled={disabled}
    />
  );
};

const mapStateToProps = (state) => ({
  locale: state.settings.locale,
});

export default connect(mapStateToProps)(SelectMachineFiltered);
