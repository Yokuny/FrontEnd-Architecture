import { useTranslation } from 'react-i18next';
import { FIELD_DATATYPES, FIELD_SIZES, FORM_TYPES } from '../@consts/form-types';

export function useFormOptions() {
  const { t } = useTranslation();

  const formTypeOptions = FORM_TYPES.map((type) => ({
    value: type.value,
    label: t(type.label, { defaultValue: type.label }),
  }));

  const datatypeOptions = FIELD_DATATYPES.map((type) => ({
    value: type.value,
    label: t(type.label, { defaultValue: type.label }),
    color: type.color,
  }));

  const sizeOptions = FIELD_SIZES.map((size) => ({
    value: size.value,
    label: size.label,
  }));

  return {
    formTypeOptions,
    datatypeOptions,
    sizeOptions,
  };
}
