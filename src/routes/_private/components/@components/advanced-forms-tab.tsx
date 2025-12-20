import FieldLayouts4 from '@/components/field-layouts-4';
import FieldLayouts5 from '@/components/field-layouts-5';
import FieldSelects5 from '@/components/field-selects-5';
import FieldToggles3 from '@/components/field-toggles-3';
import FormAdvanced7 from '@/components/form-advanced-7';
import FormPatterns3 from '@/components/form-patterns-3';

export function AdvancedFormsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormAdvanced7 />
        <FormPatterns3 />
      </div>
      <div className="space-y-6">
        <FieldLayouts4 />
        <FieldLayouts5 />
        <FieldSelects5 />
        <FieldToggles3 />
      </div>
    </div>
  );
}
