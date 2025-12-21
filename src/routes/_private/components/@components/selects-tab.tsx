import { useState } from 'react';
import {
  AlertTypeSelect,
  CmmsEquipmentSelect,
  ConditionSelect,
  ConsumptionGroupSelect,
  ConsumptionMachineSelect,
  ContractAssetEnterpriseSelect,
  CountrySelect,
  CustomerSelect,
  EnterpriseFilterSelect,
  EnterprisePreferredSelect,
  EnterpriseSelect,
  EnterpriseWithSetupSelect,
  FasPlannerSelect,
  FasTypeSelect,
  FenceSelect,
  FenceTypeSelect,
  FleetSelect,
  FleetVesselsSelect,
  FormSelect,
  LanguageFormSelect,
  LevelSelect,
  MachineByEnterpriseSelect,
  MachineManagerSelect,
  MaintenancePlanByMachineSelect,
  MaintenancePlanSelect,
  MaintenanceTypeSelect,
  ModelMachineSelect,
  OperationsContractSelect,
  OsOptionSelect,
  ParamsSelect,
  PartByMachineSelect,
  PartSelect,
  PlatformEnterpriseSelect,
  PortSelect,
  PrioritySelect,
  ProductServiceSelect,
  QlpSelect,
  RoleSelect,
  SafetySelect,
  ScaleSelect,
  SensorByAssetsSelect,
  SensorByEnterpriseSelect,
  SensorByMachineSelect,
  SensorSelect,
  SensorSignalSelect,
  StatusSelect,
  SupplierSelect,
  TypeMachineSelect,
  TypeProblemSelect,
  TypeSensorSelect,
  UserCodeIntegrationSelect,
  UserRoleSelect,
  UserSamePermissionSelect,
  UserSelect,
  UserTeamSelect,
  UserTypeSelect,
  ViewSelect,
} from '@/components/selects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SelectsTab() {
  // Context States
  const [enterpriseId, setEnterpriseId] = useState<string>();
  const [machineId, setMachineId] = useState<string>();
  const [roleId, setRoleId] = useState<string | number>();
  const [sensorId, setSensorId] = useState<string>();

  return (
    <div className="space-y-6">
      {/* 1. Context Pickers - These provide IDs for other selects */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Context & Dependencies</CardTitle>
          <CardDescription>Select values here to enable dependent components below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-primary font-bold">1. Enterprise Context</Label>
              <EnterpriseSelect mode="single" value={enterpriseId} onChange={(val) => setEnterpriseId(val)} placeholder="Choose Enterprise..." />
            </div>
            <div className="space-y-2">
              <Label className="text-primary font-bold">2. Machine Context</Label>
              <MachineByEnterpriseSelect
                mode="single"
                value={machineId}
                onChange={(val) => setMachineId(val)}
                placeholder="Choose Machine..."
                idEnterprise={enterpriseId}
                disabled={!enterpriseId}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-primary font-bold">3. Role Context</Label>
              <RoleSelect mode="single" value={roleId} onChange={(val) => setRoleId(val)} placeholder="Choose Role..." />
            </div>
            <div className="space-y-2">
              <Label className="text-primary font-bold">4. Sensor Context</Label>
              <SensorSelect multi={false} value={sensorId} onChange={(val) => setSensorId(val)} placeholder="Choose Sensor..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[750px] pr-4">
        <Tabs defaultValue="org" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="org">Organization & Users</TabsTrigger>
            <TabsTrigger value="assets">Assets & Equipment</TabsTrigger>
            <TabsTrigger value="ops">Operations & Config</TabsTrigger>
            <TabsTrigger value="utils">General & Utils</TabsTrigger>
          </TabsList>

          {/* TAB: Organization & Users */}
          <TabsContent value="org" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Users & Teams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>User (Single)</Label>
                      <UserSelect idEnterprise={enterpriseId} disabled={!enterpriseId} multi={false} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Users (Multi)</Label>
                      <UserSelect idEnterprise={enterpriseId} disabled={!enterpriseId} multi={true} onChangeMulti={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>User Team (Single)</Label>
                      <UserTeamSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>User Teams (Multi)</Label>
                      <UserTeamSelect mode="multi" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>User Role Assignment</Label>
                      <UserRoleSelect mode="single" idRole={roleId?.toString()} idEnterprise={enterpriseId} disabled={!roleId || !enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>User Same Permission</Label>
                      <UserSamePermissionSelect mode="single" onChange={() => {}} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>User Code Integration</Label>
                    <UserCodeIntegrationSelect mode="single" onChange={() => {}} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>Fleet (Single)</Label>
                      <FleetSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Fleet Vessels</Label>
                      <FleetVesselsSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>Customer (Single)</Label>
                      <CustomerSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform (Enterprise)</Label>
                      <PlatformEnterpriseSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>QLP</Label>
                      <QlpSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>User Type</Label>
                      <UserTypeSelect mode="single" idEnterprise={enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: Assets & Equipment */}
          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Machines & Parts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>Machine (Single)</Label>
                      <MachineByEnterpriseSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Machines (Multi)</Label>
                      <MachineByEnterpriseSelect mode="multi" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>Part (Single)</Label>
                      <PartSelect multi={false} idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Machine Manager</Label>
                      <MachineManagerSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Part by Machine</Label>
                      <PartByMachineSelect multi={false} idMachine={machineId} disabled={!machineId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Model Machine</Label>
                      <ModelMachineSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sensors & Signals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>Sensor by Enterprise</Label>
                      <SensorByEnterpriseSelect multi={false} idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sensor by Assets</Label>
                      <SensorByAssetsSelect mode="multi" idAssets={machineId ? [machineId] : []} disabled={!machineId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label>Sensor by Machine</Label>
                      <SensorByMachineSelect multi={false} idMachine={machineId} disabled={!machineId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Consumption Group</Label>
                      <ConsumptionGroupSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sensor Signal</Label>
                      <SensorSignalSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Type Sensor</Label>
                      <TypeSensorSelect mode="single" onChange={() => {}} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: Operations & Config */}
          <TabsContent value="ops" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Config</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CmmsEquipmentSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <ContractAssetEnterpriseSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <FormSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <OperationsContractSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <FenceSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MaintenancePlanSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <MaintenancePlanByMachineSelect mode="single" idMachine={machineId} disabled={!machineId} onChange={() => {}} />
                  <MaintenanceTypeSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <StatusSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>More Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SupplierSelect mode="single" onChange={() => {}} />
                  <ConsumptionMachineSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <FasPlannerSelect mode="single" idEnterprise={enterpriseId} disabled={!enterpriseId} onChange={() => {}} />
                  <ParamsSelect mode="single" onChange={() => {}} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: General & Utils */}
          <TabsContent value="utils" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CountrySelect mode="single" onChange={() => {}} />
                  <LanguageFormSelect onChange={() => {}} />
                  <PortSelect mode="single" onChange={() => {}} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>UI/UX</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ViewSelect mode="single" onChange={() => {}} />
                  <PrioritySelect mode="single" onChange={() => {}} />
                  <LevelSelect mode="single" onChange={() => {}} />
                  <ScaleSelect mode="single" onChange={() => {}} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Rules & types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <AlertTypeSelect onChangeMulti={() => {}} />
                  <ConditionSelect mode="single" onChange={() => {}} />
                  <FasTypeSelect mode="single" onChange={() => {}} />
                  <FenceTypeSelect mode="single" onChange={() => {}} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Others</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <OsOptionSelect onChange={() => {}} />
                  <SafetySelect mode="single" onChange={() => {}} />
                  <ProductServiceSelect mode="multi" onChange={() => {}} />
                  <TypeProblemSelect mode="single" onChange={() => {}} />
                  <TypeMachineSelect mode="single" onChange={() => {}} />
                  <EnterpriseWithSetupSelect mode="single" onChange={() => {}} />
                  <EnterpriseFilterSelect onChange={() => {}} />
                  <EnterprisePreferredSelect onChange={() => {}} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
