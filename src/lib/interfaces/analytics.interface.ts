export type PatientDemographics = {
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
};

export type PatientRegistrationTrends = {
  previous30Days: number;
  previous60Days: number;
  previous90Days: number;
  growthRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
};

export type DayData = {
  day: number;
  amount: number;
};

export type PatientPeriodChart = {
  last7Days: DayData[];
  last30Days: DayData[];
  last90Days: DayData[];
};

export type DbPatientAnalytics = {
  totalPatients: number;
  demographics: PatientDemographics;
  registrationTrends: PatientRegistrationTrends;
  periodChart: PatientPeriodChart;
  updatedAt: Date;
};
