// Interface para máquina com integração
export interface MachineIntegration {
  id: string;
  name: string;
  image?: { url: string };
  type: string | null;
  idMoon: string | null;
  imo: string | null;
  mmsi: string | null;
  disabled: boolean;
  updateTime: number | null;
}

// Resposta da API de listagem
export interface MachineIntegrationResponse {
  id: string;
  name: string;
  image?: { url: string };
  machineIntegration?: {
    type?: string;
    idMoon?: string;
    imo?: string;
    mmsi?: string;
    disabled?: boolean;
    updateTime?: number;
  };
  dataSheet?: {
    imo?: string;
    mmsi?: string;
  };
}

// Payload para salvar integração
export interface MachineIntegrationPayload {
  id: string;
  idEnterprise: string;
  type: string | null;
  updateTime: number | null;
  idMoon: number | null;
  imo: number | null;
  mmsi: number | null;
  disabled: boolean;
}
