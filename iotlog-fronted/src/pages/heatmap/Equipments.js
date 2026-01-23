export const Equipments = [
  {
    index: 1,
    name: 'Motor',
    code: 'engines',
    subgroups: [
      {
        subgroupName: 'Motor 1'
      },
      {
        subgroupName: 'Motor 2'
      },
      {
        subgroupName: 'Motor 3'
      },
      {
        subgroupName: 'Motor 4'
      },
      {
        subgroupName: 'Motor 5'
      },
      {
        subgroupName: 'Motor 6'
      }
    ]
  },
  {
    index: 2,
    code: 'thrusterConv',
    name: 'Propulsor Convencional',
    subgroups: [
      {
        subgroupName: 'Propulsor Convencional 1'
      },
      {
        subgroupName: 'Propulsor Convencional 2'
      },
      {
        subgroupName: 'Propulsor Convencional 3'
      },
      {
        subgroupName: 'Propulsor Convencional 4'
      },
      {
        subgroupName: 'Propulsor Convencional 5'
      },
      {
        subgroupName: 'Propulsor Convencional 6'
      }
    ]
  },
  {
    index: 3,
    code: 'thrusterAzimutal',
    name: 'Propulsor Azimutal',
    subgroups: [
      {
        subgroupName: 'Propulsor Azimutal 1'
      },
      {
        subgroupName: 'Propulsor Azimutal 2'
      },
      {
        subgroupName: 'Propulsor Azimutal 3'
      },
      {
        subgroupName: 'Propulsor Azimutal 4'
      },
      {
        subgroupName: 'Propulsor Azimutal 5'
      },
      {
        subgroupName: 'Propulsor Azimutal 6'
      }
    ]
  },
  {
    index: 4,
    code: 'thrusterBow',
    name: 'Bow Thruster',
    subgroups: [
      {
        subgroupName: 'Bow Thruster 1'
      },
      {
        subgroupName: 'Bow Thruster 2'
      },
      {
        subgroupName: 'Bow Thruster 3'
      },
      {
        subgroupName: 'Bow Thruster 4'
      },
      {
        subgroupName: 'Bow Thruster 5'
      },
      {
        subgroupName: 'Bow Thruster 6'
      }
    ]
  },
  {
    index: 5,
    name: 'Stern Thruster',
    code: 'thrusterStern',
    subgroups: [
      {
        subgroupName: 'Stern Thruster 1'
      },
      {
        subgroupName: 'Stern Thruster 2'
      },
      {
        subgroupName: 'Stern Thruster 3'
      },
      {
        subgroupName: 'Stern Thruster 4'
      },
      {
        subgroupName: 'Stern Thruster 5'
      },
      {
        subgroupName: 'Stern Thruster 6'
      }
    ]
  },
  {
    index: 6,
    name: 'Thruster Retrátil',
    code: 'thrusterRet',
    subgroups: [
      {
        subgroupName: 'Thruster Retrátil 1'
      },
      {
        subgroupName: 'Thruster Retrátil 2'
      },
      {
        subgroupName: 'Thruster Retrátil 3'
      },
      {
        subgroupName: 'Thruster Retrátil 4'
      },
      {
        subgroupName: 'Thruster Retrátil 5'
      },
      {
        subgroupName: 'Thruster Retrátil 6'
      }
    ]
  },
  {
    index: 7,
    name: 'Caixa Redutora',
    code: 'gearReduction',
    subgroups: [
      {
        subgroupName: 'Caixa Redutora 1'
      },
      {
        subgroupName: 'Caixa Redutora 2'
      },
      {
        subgroupName: 'Caixa Redutora 3'
      },
      {
        subgroupName: 'Caixa Redutora 4'
      },
      {
        subgroupName: 'Caixa Redutora 5'
      },
      {
        subgroupName: 'Caixa Redutora 6'
      }
    ]
  },
  {
    index: 8,
    name: 'Gerador auxiliar',
    code: 'genAux',
    subgroups: [
      {
        subgroupName: 'Gerador auxiliar 1'
      },
      {
        subgroupName: 'Gerador auxiliar 2'
      },
      {
        subgroupName: 'Gerador auxiliar 3'
      },
      {
        subgroupName: 'Gerador auxiliar 4'
      },
      {
        subgroupName: 'Gerador auxiliar 5'
      },
      {
        subgroupName: 'Gerador auxiliar 6'
      },
      {
        subgroupName: 'Gerador auxiliar Emergencial'
      }
    ],
    options: ['1', '2', '3', '4', '5', '6', 'E']
  },
  {
    index: 9,
    name: 'PTO',
    code: 'pto',
    subgroups: [
      {
        subgroupName: 'PTO 1'
      },
      {
        subgroupName: 'PTO 2'
      }
    ],
    options: ['1', '2']
  },
]
const hasValidSubgroupData = (subgroup) => {
  const hasValidSensorOnOff =
    subgroup.idSensorOnOff &&
    typeof subgroup.idSensorOnOff === 'string' &&
    subgroup.idSensorOnOff.trim() !== '';

  const hasValidSensors =
    Array.isArray(subgroup.sensors) &&
    subgroup.sensors.length > 0 &&
    subgroup.sensors.some(sensor => {
      const keys = Object.keys(sensor);
      return keys.length > 1;
    });

  return hasValidSensorOnOff || hasValidSensors;
};

export const getAvailableEquipments = (fleetData) => {
  const equipmentsWithData = new Set();

  // Percorre todos os dados da frota
  fleetData?.forEach(fleet => {
    fleet.equipments?.forEach(equipment => {
      // Verifica se o equipamento tem código válido
      if (!equipment.code || typeof equipment.code !== 'string' || equipment.code.trim() === '') {
        return;
      }

      // Verifica se pelo menos um subgrupo tem dados válidos
      const hasValidData = Array.isArray(equipment.subgroups) &&
        equipment.subgroups.some(subgroup => hasValidSubgroupData(subgroup));

      if (hasValidData) {
        equipmentsWithData.add(equipment.code);
      }
    });
  });

  // Retorna apenas os equipamentos da lista Equipments que têm dados
  return Equipments.filter(eqp => equipmentsWithData.has(eqp.code));
};
