import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapUsersToOptions, useUsersByEnterprise } from '@/hooks/use-users-select-api';

interface UserSelectProps {
  /** Label for the select field */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Currently selected user ID (single select) */
  value?: string | number;
  /** Currently selected user IDs (multi select) */
  values?: (string | number)[];
  /** Callback when selection changes (single select) */
  onChange?: (value: string | number | undefined) => void;
  /** Callback when selection changes (multi select) */
  onChangeMulti?: (values: (string | number)[]) => void;
  /** Enterprise ID to filter users */
  idEnterprise?: string;
  /** Whether to allow multiple selections */
  multi?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether single select can be cleared */
  clearable?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Include detailed user information (email, language) */
  includeDetails?: boolean;
}

export function UserSelect({
  label,
  placeholder = 'Select user...',
  value,
  values,
  onChange,
  onChangeMulti,
  idEnterprise,
  multi = false,
  disabled = false,
  clearable = false,
  className,
  includeDetails = false,
}: UserSelectProps) {
  const query = useUsersByEnterprise(idEnterprise, includeDetails);

  const noOptionsMessage = !idEnterprise ? 'Please select an enterprise first.' : 'No users available.';

  if (multi) {
    return (
      <DataMultiSelect
        label={label}
        placeholder={placeholder}
        value={values}
        onChange={(newValues) => onChangeMulti?.(newValues)}
        query={query}
        mapToOptions={(users) => mapUsersToOptions(users, includeDetails)}
        disabled={disabled}
        className={className}
        searchPlaceholder="Search users..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="No users found."
      />
    );
  }

  return (
    <DataSelect
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(newValue) => onChange?.(newValue)}
      query={query}
      mapToOptions={(users) => mapUsersToOptions(users, includeDetails)}
      disabled={disabled}
      clearable={clearable}
      className={className}
      searchPlaceholder="Search users..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="No users found."
    />
  );
}
