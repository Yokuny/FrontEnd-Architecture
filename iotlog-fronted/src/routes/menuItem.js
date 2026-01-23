// titleId -> iotlog-frontend/src/translations
// Icons -> iotlog-frontend/src/components/Icons/index.jsx
const items = [
  {
    titleId: "menu.ai",
    icon: { name: "Lightbulb" },
    children: [
      {
        titleId: "menu.sea.prompt.ai",
        link: { to: "/prompt-ai" },
      },
      {
        titleId: "menu.nexai.anomaly.detector",
        link: { to: "/anomaly-detector-ai" },
      },
    ]
  },
  {
    titleId: "map.fleet",
    icon: { name: "MapIcon" },
    link: { to: "/fleet-manager" },
  },
  {
    titleId: "telemetry",
    icon: { name: "Engine" },
    children: [
      {
        titleId: "fleet.panel",
        link: { to: "/fleet-panel" },
      },
      {
        titleId: "fleet.panel",
        link: { to: "/fleet-cards-panel" },
      },
      {
        titleId: "trends",
        link: { to: "/datalogger" },
      },
      {
        titleId: "performance",
        link: { to: "/performance" },
      },
      {
        titleId: "dashboard",
        link: { to: "/list-dashboard" },
      },
      {
        titleId: "remote.ihm",
        link: { to: "/remote-ihm" },
      },
      {
        titleId: "heatmap",
        link: { to: "/heatmap-fleet" },
      },
      {
        titleId: "panel.heatmap",
        link: { to: "/heatmap-panel" },
      },
      {
        titleId: "buoys.dwell.time.shorten",
        link: { to: "/buoys-dwell-time" },
      },
      {
        titleId: "download",
        link: { to: "/download-data-asset-request" },
      },
      {
        titleId: "menu.sensor.min.max",
        link: { to: "/sensor-min-max" },
      },
      {
        titleId: "diagram",
        link: { to: "/diagram-list" },
      }
    ]
  },
  {
    titleId: "consumption",
    icon: { name: "Oil" },
    show: [
      "/dashboard-rve-rdo",
      "/dashboard-rve-sounding",
      "/consumption-daily",
      "/consumption-assets",
      "/consumption-time-operation",
      "/consumption-comparative",
    ],
    children: [
      {
        titleId: "daily",
        link: { to: "/consumption-daily" },
      },
      {
        titleId: "reports",
        link: { to: "/consumption-assets" },
      },
      {
        titleId: "operational",
        link: { to: "/operations" },
      },
      {
        titleId: "mode.operation",
        link: { to: "/consumption-time-operation" },
      },
      {
        titleId: "menu.rdo.vs.rve",
        link: { to: "/dashboard-rve-rdo" },
      },
      {
        titleId: "sounding.rve",
        link: { to: "/dashboard-rve-sounding" },
      },
      {
        titleId: "consumption.comparative",
        link: { to: "/consumption-comparative" },
      },
      {
        titleId: "consumption.curve",
        link: { to: "/consumption-curve" },
      },
    ],
  },
  {
    titleId: "menu.esg",
    icon: { name: "BuildingIcon" },
    show: ["/consumption-co2", "/indicators-eeoi-cii"],
    children: [
      {
        titleId: "co2",
        link: { to: "/consumption-co2" },
      },
      {
        titleId: "menu.eeoi.cii",
        link: { to: "/indicators-eeoi-cii" },
      },
      {
        titleId: "cii",
        link: { to: "/cii-fleet" },
      },
      {
        titleId: "simulator.cii",
        link: { to: "/simulator-cii" },
      },
    ],
  },
  {
    titleId: "contract",
    icon: { name: "BookOpenCheckIcon" },
    children: [
      {
        titleId: "list",
        link: { to: "/contract-list" },
      },
      {
        titleId: "rve.indicators",
        link: { to: "/dashboard-rve" },
      },
      {
        titleId: "menu.rdo.vs.rve",
        link: { to: "/dashboard-rve-rdo" },
      },
      {
        titleId: "sounding.rve",
        link: { to: "/dashboard-rve-sounding" },
      },
      {
        titleId: "oee",
        link: { to: "/oee" },
      },
    ],
  },
  {
    titleId: "list.travel",
    icon: { name: "Vessel" },
    children: [
      {
        titleId: "list.travel",
        link: { to: "/list-travel" },
      },
      {
        titleId: "kpis.travel",
        link: { to: "/kpis-travel" },
      },
      {
        titleId: "voyage.integration",
        link: { to: "/voyage-integration" },
      },
      {
        titleId: "route.planner",
        link: { to: "/route-planner" },
      }
    ]
  },
  {
    titleId: "statistics",
    icon: { name: "TrendingUpIcon" },
    children: [
      {
        titleId: "time.operation",
        link: { to: "/statistics-time-operation" },
      },
      {
        titleId: "access",
        link: { to: "/dashboard-tracking-activity" },
      },
      {
        titleId: "integration",
        link: { to: "/fleet-status" },
      },
      {
        titleId: "kpis.cmms",
        link: { to: "/kpis-cmms" },
      },
      {
        titleId: "menu.rve",
        link: { to: "/dashboard-rve" },
      },
      {
        titleId: "oee",
        link: { to: "/oee" },
      },
      {
        titleId: "fences.report",
        link: { to: "/fences-report" },
      }
    ]
  },
  {
    titleId: "forms",
    icon: { name: "FormIcon" },
    link: { to: "/form-board" },
  },
  {
    titleId: "operation",
    icon: { name: "ServiceTableIcon" },
    children: [
      //{
      //  titleId: "fill.onboard",
      //  link: { to: "/fill-onboard" },
      //},
      {
        titleId: "operability",
        link: { to: "/downtime-list" },
      },
      {
        titleId: "performance.operation",
        children: [
          {
            titleId: "machine",
            link: { to: "/operational-dashboard-asset" },
          },
          {
            titleId: "fleet",
            link: { to: "/operational-dashboard-fleet" },
          },
        ]
      },
      {
        titleId: "setup.inoperability",
        children: [
          {
            titleId: "group",
            link: { to: "/group-list" },
          },
          {
            titleId: "goals",
            link: { to: "/goals-list" },
          },
          {
            titleId: "ptax",
            link: { to: "/ptax" },
          },
        ]
      },
    ]
  },
  {
    titleId: "service.management",
    icon: { name: "ShopBagIcon" },
    children: [
      {
        titleId: "view.fas",
        link: { to: "/fas" }
      },
      {
        titleId: "fas.analytics",
        link: { to: "/fas-analytics" }
      },
      {
        titleId: "fas.contacts",
        link: { to: "/fas-contacts" }
      }
    ]
  },
  {
    titleId: "cmms",
    icon: { name: "Tools" },
    children: [
      {
        titleId: "os",
        link: { to: "/filled-form-CMMS" },
        codeLanguage: "view.cmms.forms"
      },
      {
        title: "KPIs",
        link: { to: "/kpis-cmms" }
      },
      {
        titleId: "diagram",
        link: { to: "/diagram-list" }
      }
    ]
  },
  {
    titleId: "register",
    icon: { name: "NewDocumentIcon" },
    children: [
      {
        titleId: "machines",
        link: { to: "/machines-list-register" },
      },
      {
        titleId: "geofences",
        link: { to: "/list-geofence" },
      },
      {
        titleId: "customers",
        link: { to: "/customer-list" },
      },
      {
        titleId: "rule.alerts",
        link: { to: "/view-list-alarms" },
      },
      {
        titleId: "contract",
        link: { to: "/contract-list" },
      },
      {
        titleId: "documents",
        link: { to: "/list-folders" },
      },
      {
        titleId: "enterprises",
        link: { to: "/organizations-list" },
      },
      {
        titleId: "forms",
        link: { to: "/form-list" },
      },
      {
        titleId: "fleets",
        link: { to: "/fleet-list" },
      },
      {
        titleId: "sensor.functions",
        link: { to: "/sensor-functions" },
      },
      {
        titleId: "models.machine",
        link: { to: "/model-machine-list" },
      },
      {
        titleId: "buoys",
        link: { to: "/buoy-list" },
      },
      {
        titleId: "parts",
        link: { to: "/parts-list" },
      },
      {
        titleId: "maintenance.plans",
        link: { to: "/maintenance-plan-list" },
      },
      {
        titleId: "params",
        link: { to: "/params-list" },
      },
      {
        titleId: "platforms",
        link: { to: "/list-platform" },
      },
      {
        titleId: "sensors",
        link: { to: "/sensors-list" },
      },
      {
        titleId: "types.fuel",
        link: { to: "/list-type-fuel" },
      },
      {
        titleId: "types.user",
        link: { to: "/list-type-user" },
      },
    ],
  },
  {
    titleId: "maintenance",
    icon: { name: "WrenchIcon" },
    children: [
      {
        titleId: "maintenance.plan",
        link: { to: "/monitoring-plans" },
      },
      {
        titleId: "monitoring.wear.part",
        link: { to: "/monitoring-wear" },
      },
      {
        titleId: "done.os",
        link: { to: "/list-os-done" },
      },
    ]
  },
  {
    titleId: "calendar.maintenance",
    link: { to: "/calendar-maintenance" },
    icon: { name: "CalendarIcon" },
  },
  {
    titleId: "support",
    icon: { name: "HeadphoneIcon" },
    children: [
      {
        titleId: "support",
        link: { to: "/list-orders-support" },
      },
      {
        titleId: "manage.support",
        link: { to: "/management-support" },
      },
      {
        titleId: "config.support",
        children: [
          {
            titleId: "team.support",
            link: { to: "/list-team" },
          },
          {
            titleId: "type.problem",
            link: { to: "/list-type-problems" },
          },
          {
            titleId: "time.sla",
            link: { to: "/list-config-support" },
          },
          {
            titleId: "scale",
            link: { to: "/scale-list" },
          },
          {
            titleId: "holidays",
            link: { to: "/holidays-list" },
          },
          {
            titleId: "expedients",
            link: { to: "/expedients-list" },
          },
        ],
      },
      {
        titleId: "message.history",
        link: { to: "/message-history-builder" },
      },
    ]
  },
  {
    titleId: "permissions",
    icon: { name: "KeyIcon" },
    children: [
      {
        titleId: "role",
        link: { to: "/list-roles" },
      },
      {
        titleId: "users",
        link: { to: "/list-users-permission" },
      },
    ],
  },
  {
    titleId: "configuration.enterprise",
    icon: { name: "GearIcon" },
    show: ["/setup-email", "/fleet-status"],
    children: [
      {
        titleId: "setup.email",
        link: { to: "/setup-email" },
      },
      {
        titleId: "integrations.api",
        link: { to: "/setup-api-external" },
      },
      {
        titleId: "integration.ais",
        link: { to: "/integration-list" },
      },
    ],
  },
];

export default items;
