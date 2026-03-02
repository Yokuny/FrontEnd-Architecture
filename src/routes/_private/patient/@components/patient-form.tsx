import { useFieldArray, useFormContext } from 'react-hook-form';
import DefaultFormLayout from '@/components/default-form-layout';
import Add from '@/components/icons/Add.Icon';
import Delete from '@/components/icons/Delete.Icon';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCpfCnpj, formatDate, formatPhone } from '@/lib/helpers/formatter.helper';
import type { NewPatient } from '@/lib/interfaces/schemas/patient.schema';

export function PatientForm() {
  const form = useFormContext<NewPatient>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'phone',
  });

  const sections = [
    {
      title: 'Informações Pessoais',
      description: 'Dados principais do paciente',
      fields: [
        <div key="row-1" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o nome" />
                </FormControl>
                <FormDescription>Nome completo do paciente.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Digite o email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="row-2" className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="000.000.000-00" onChange={(e) => field.onChange(formatCpfCnpj(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Digite o RG" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nascimento</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="dd/mm/aaaa" onChange={(e) => field.onChange(formatDate(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: 'Endereço',
      description: 'Opções de endereço do paciente',
      fields: [
        <div key="row-3" className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_3fr]">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="00000-000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Digite rua, número, etc..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: 'Contatos',
      description: 'Telefones de contato do paciente',
      fields: [
        <div key="phones" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Lista de Telefones</h4>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ number: '', tag: fields.length === 0 ? 'WhatsApp' : '' })}>
              <Add className="mr-2 size-4" />
              Adicionar Telefone
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col items-end gap-4 rounded-lg bg-muted/20 p-4 md:flex-row">
              <FormField
                control={form.control}
                name={`phone.${index}.number`}
                render={({ field: inputField }) => (
                  <FormItem className="w-full">
                    <FormLabel>#{index + 1} Telefone</FormLabel>
                    <FormControl>
                      <Input {...inputField} value={inputField.value || ''} placeholder="(00) 00000-0000" onChange={(e) => inputField.onChange(formatPhone(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`phone.${index}.tag`}
                render={({ field: inputField }) => (
                  <FormItem className="w-full">
                    <FormLabel>Identificação</FormLabel>
                    <FormControl>
                      <Input {...inputField} value={inputField.value || ''} placeholder="Ex: Principal, WhatsApp" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Delete className="size-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">Nenhum telefone cadastrado.</div>}
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
