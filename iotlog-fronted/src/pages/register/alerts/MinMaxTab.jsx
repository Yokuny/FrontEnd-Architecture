import React, { useEffect, useState } from 'react';
import { Select, InputGroup } from '@paljs/ui';
import { Fetch, LabelIcon, CardNoShadow } from '../../../components';
import { CardBody } from '@paljs/ui';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

const StyledCardBody = styled(CardBody)`

`;

const StyledSelect = styled(Select)`
  width: 100%;

  .select-button {
    width: 100%;
  }

  .select-button-content {
    width: 100%;
  }
`;

const MinMaxTab = ({ onChange, data, idEnterprise }) => {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();

  useEffect(() => {
    if (idEnterprise) {
      fetchVessels();
    }
  }, [idEnterprise]);

      const fetchVessels = async () => {
      try {
        setLoading(true);
        const response = await Fetch.get(`/sensorminmax/filled/${idEnterprise}`);

        const formattedVessels = response.data.map(item => ({
          value: item.id,
          label: item.vesselName || '',
          sensors: item.sensors,
          idAsset: item.idAsset
        }));

        setVessels(formattedVessels);

        if (data?.selectedVessels?.length > 0) {
          const updatedSelection = data.selectedVessels.map(selected => {
            const matchingVessel = formattedVessels.find(v => v.value === selected.value);
            if (matchingVessel) {
              return {
                ...selected,
                label: matchingVessel.label
              };
            }
            return selected;
          });
          onChange("selectedVessels", updatedSelection);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <CardNoShadow>
        <StyledCardBody>
          <LabelIcon
            className="mb-2"
            iconName="settings-outline"
            title={`${intl.formatMessage({ id: "min.max" })} *`}
          />
          <StyledSelect
            placeholder={intl.formatMessage({ id: "minmax.select.placeholder" })}
            options={vessels}
            onChange={(value) => onChange("selectedVessels", value)}
            value={data?.selectedVessels}
            isLoading={loading}
            isMulti
            isClearable
            isSearchable
            menuPosition='fixed'
            noOptionsMessage={() => intl.formatMessage({ id: "minmax.no.vessels" })}
            loadingMessage={() => intl.formatMessage({ id: "minmax.loading.vessels" })}
          />
        </StyledCardBody>
      </CardNoShadow>

      <CardNoShadow style={{ marginBottom: 0 }}>
        <CardBody>
          <LabelIcon
            iconName="message-circle-outline"
            title={`${intl.formatMessage({ id: "description" })} *`}
          />
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "message.description.placeholder",
              })}
              onChange={(e) => {
                onChange("description", e.target.value);
              }}
              value={data?.description}
              maxLength={150}
            />
          </InputGroup>
        </CardBody>
      </CardNoShadow>
    </>
  );
};

export default MinMaxTab;
