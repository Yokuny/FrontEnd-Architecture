import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import Select from '@paljs/ui/Select';
import styled from 'styled-components';
import { Fetch } from '../';

const GroupLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.25rem 0;
  cursor: pointer;

  .group-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-basic-color);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .group-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover .group-actions {
    opacity: 1;
  }

  .select-all-btn {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    color: var(--text-primary-color);
    background-color: var(--background-primary-color-2);
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-600);
    }
  }

  .fold-icon {
    width: 16px;
    height: 16px;
    color: var(--text-hint-color);
    transform: rotate(0deg);
    transition: transform 0.2s ease;

    &.expanded {
      transform: rotate(180deg);
    }
  }
`;

const SelectFleetVessels = ({ 
  onChange, 
  value, 
  disabled = false, 
  placeholder = 'vessels.select.placeholder',
  idEnterprise,
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const intl = useIntl();
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  useEffect(() => {
    const loadFleetVessels = async () => {
      if (!idEnterprise) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await Fetch.get(`/machinefleet/machines?idEnterprise=${idEnterprise}`);
        
        const formattedOptions = response.data.map(fleet => ({
          [fleet.description]: fleet.machines.map(machine => ({
            title: machine.name,
            value: machine.id
          }))
        }));
        
        setOptions(formattedOptions);
        
      } catch (error) {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFleetVessels();
  }, [idEnterprise]);

  const formatGroupLabel = ({ label, options: groupOptions }) => {
    const isExpanded = expandedGroups.has(label);
    const allSelected = groupOptions.every(opt => 
      value?.includes(opt.value)
    );

    const handleGroupClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setExpandedGroups(prev => {
        const newSet = new Set(prev);
        if (newSet.has(label)) {
          newSet.delete(label);
        } else {
          newSet.add(label);
        }
        return newSet;
      });
    };

    const handleSelectAll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (allSelected) {
        const newValue = value.filter(v => 
          !groupOptions.some(opt => opt.value === v)
        );
        onChange(newValue);
      } else {
        const currentValues = new Set(value || []);
        const newItems = groupOptions.filter(opt => !currentValues.has(opt.value))
          .map(opt => opt.value);
        onChange([...currentValues, ...newItems]);
      }
    };

    return (
      <GroupLabel onClick={handleGroupClick}>
        <span className="group-title">
          {label}
        </span>
        <div className="group-actions">
          <button 
            className="select-all-btn"
            onClick={handleSelectAll}
          >
            {allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
          <svg 
            className={`fold-icon ${isExpanded ? 'expanded' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </GroupLabel>
    );
  };

  const formatOptions = React.useMemo(() => {
    return options.map(group => {
      const [groupTitle, items] = Object.entries(group)[0];
      return {
        label: groupTitle,
        options: items.map(item => ({
          label: item.title,
          value: item.value
        }))
      };
    });
  }, [options]);

  return (
    <Select
      isMulti
      isClearable
      isSearchable
      isDisabled={disabled || isLoading}
      isLoading={isLoading}
          value={value ? options.flatMap(group => {
        const [_, machines] = Object.entries(group)[0];
        return machines.filter(machine => value.includes(machine.value))
          .map(machine => ({ label: machine.title, value: machine.value }));
      }) : []}
      onChange={(selected) => onChange(selected?.map(item => item.value) || [])}
      options={formatOptions}
      placeholder={intl.formatMessage({ id: placeholder })}
      formatGroupLabel={formatGroupLabel}
      components={{
        Group: ({ children, data, ...props }) => (
          <div>
            {formatGroupLabel(data)}
            <div style={{ display: expandedGroups.has(data.label) ? 'block' : 'none' }}>
              {children}
            </div>
          </div>
        )
      }}
      menuPosition="fixed"
      maxMenuHeight={300}
      menuPlacement="auto"
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      noOptionsMessage={() => intl.formatMessage({ id: 'nooptions.message' })}
    />
  );
};

SelectFleetVessels.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  idEnterprise: PropTypes.string
};

export default SelectFleetVessels;