# Maritime Industry KPIs & Performance Metrics

## Fleet Performance Indicators

### Operational Efficiency

**Vessel Utilization Rate**
```
Utilization % = (Operating Days / Total Days) × 100
```
- Industry benchmark: 85-95% for well-managed fleets
- Operating days exclude planned maintenance, off-hire, waiting time

**Revenue-Earning Days**
```
Revenue Days = Total Days - (Off-hire + Idle + Maintenance Days)
```
- Target: >90% for time-chartered vessels
- Critical for profitability analysis

**Availability**
```
Availability % = (Operating Hours / (Operating Hours + Downtime Hours)) × 100
```
- Industry target: >98%
- Includes both planned and unplanned downtime

**Mean Time Between Failures (MTBF)**
```
MTBF = Operating Hours / Number of Failures
```
- Higher MTBF indicates better reliability
- Track per equipment type
- Benchmark against OEM specifications

**Mean Time To Repair (MTTR)**
```
MTTR = Total Repair Time / Number of Repairs
```
- Lower MTTR indicates efficient maintenance
- Critical for availability improvement
- Track by fault severity and equipment type

### Fuel Efficiency

**Daily Fuel Consumption**
```
Fuel Consumption = Total Fuel Used (MT) / Days at Sea
```
- Typical range: 20-150 MT/day depending on vessel size/type
- Monitor by operational mode (steaming, DP, standby)

**Specific Fuel Oil Consumption (SFOC)**
```
SFOC = Fuel Consumed (g) / Power Output (kW) × Time (h)
Units: g/kWh
```
- Diesel engines: 170-200 g/kWh (typical)
- HFO engines: 180-220 g/kWh (typical)
- Lower is better

**Fuel Cost per Day**
```
Daily Fuel Cost = Fuel Consumption (MT/day) × Fuel Price ($/MT)
```
- Track by fuel type (HFO, MGO, VLSFO)
- Major operating expense (40-60% of voyage costs)

**Fuel Efficiency per Cargo-Mile**
```
Efficiency = Fuel Consumed (MT) / (Cargo Tonnage × Distance NM)
```
- Benchmark for cargo vessels
- Direct input to EEOI calculation

### Speed Performance

**Average Speed**
```
Speed (knots) = Distance (NM) / Time (hours)
```
- Typical service speed: 12-18 knots (varies by vessel type)
- Speed-consumption relationship: cubic (2x speed = 8x fuel)

**Weather-Adjusted Speed**
```
Corrected Speed = Actual Speed × Weather Factor
```
- Remove weather impact for performance analysis
- ISO 19030 standard for speed/power performance

**Speed/Consumption Performance**
- Track actual vs. charter party warranty
- Claim calculations for underperformance
- Slow steaming optimization (economic speed)

## Environmental Performance

### EEOI (Energy Efficiency Operational Indicator)

**Standard EEOI Calculation**
```
EEOI = (Σ Fuel Consumed × Fuel CF) / (Cargo Carried × Distance)
Units: grams CO₂ / tonne-nautical mile
```

**Fuel Carbon Factors (IMO guidelines):**
- HFO: 3.114 g CO₂/g fuel
- LFO: 3.151 g CO₂/g fuel
- MDO/MGO: 3.206 g CO₂/g fuel
- LNG: 2.750 g CO₂/g fuel

**EEOI Benchmarks (example ranges):**
- Bulk Carrier: 5-8 g/tonne-NM
- Container Ship: 10-20 g/tonne-NM
- Tanker: 4-7 g/tonne-NM
- Offshore PSV: 15-30 g/tonne-NM (highly variable)

**Monitoring:**
- Per voyage calculation
- Rolling 12-month average
- Fleet aggregation
- Trend analysis

### CII (Carbon Intensity Indicator)

**CII Rating Calculation**
```
Attained CII = (Annual CO₂ Emissions) / (Capacity × Distance)
Units: g CO₂ / capacity-nautical mile
```

**Capacity Definition by Ship Type:**
- Bulk carrier, tanker: DWT
- Container ship: DWT × 0.7
- Gas carrier: DWT × 0.7
- Ro-Ro: GT
- General cargo: DWT

**Required CII (2023 baseline with reduction factors):**
- 2023: 5% reduction vs. 2019
- 2024: 7% reduction
- 2025: 9% reduction
- 2026: 11% reduction

**Rating Boundaries (example for bulk carrier 200,000+ DWT):**
- A (Superior): <2.56 g/dwt-NM
- B (Good): 2.56-3.02 g/dwt-NM
- C (Moderate): 3.02-3.93 g/dwt-NM
- D (Inferior): 3.93-4.40 g/dwt-NM
- E (Poor): >4.40 g/dwt-NM

**Management Actions:**
- A/B/C rating: Monitor and maintain
- D rating (1 year): Flag and analyze
- D/E rating (3 consecutive years): Corrective action plan required

### Total CO₂ Emissions

**Annual Emissions**
```
Total CO₂ = Σ (Fuel Type × Quantity × Carbon Factor)
Units: Tonnes CO₂ per year
```

**Emissions Intensity**
```
Emissions per Operating Day = Annual CO₂ / Operating Days
```

**Scope 1 Emissions (Direct):**
- Main engine fuel
- Auxiliary engine fuel
- Boiler fuel
- Incinerator (if applicable)

**Reporting:**
- DCS (IMO)
- MRV (EU)
- EU ETS (carbon cost calculation)

### Other Environmental KPIs

**Ballast Water Compliance**
- Treatment system effectiveness
- D-2 standard compliance (organism counts)
- System reliability and uptime

**Garbage & Waste Management**
- Waste generated (kg/person/day)
- Recycling rate
- Disposal compliance (MARPOL Annex V)

**Oil Discharge Compliance**
- Bilge water (<15 ppm)
- Oily water separator efficiency
- Overboard discharge frequency

## Maintenance Performance

### Planned Maintenance Compliance

**PM Compliance Rate**
```
PM Compliance % = (Completed PMs / Scheduled PMs) × 100
```
- Target: >95%
- Leading indicator of maintenance health
- Critical for ISM audit

**Overdue Maintenance**
```
Overdue % = Overdue Tasks / Total Due Tasks × 100
```
- Target: <5%
- Risk indicator
- Breakdown correlation

**Maintenance Backlog**
```
Backlog (hours) = Σ (Pending Work Orders × Estimated Hours)
```
- Target: 2-4 weeks of work
- Too low: Reactive
- Too high: Planning issues

### Maintenance Cost

**Total Maintenance Cost**
```
TMC = Planned Maintenance + Corrective Maintenance + Spare Parts + Contractors
```
- Typical range: $500-2,000 per day (vessel dependent)

**Maintenance Cost per Operating Day**
```
Cost/Day = Annual Maintenance Cost / Operating Days
```
- Benchmark across fleet
- Identify outliers

**Planned vs. Corrective Ratio**
```
PM/CM Ratio = Planned Maintenance Cost / Corrective Maintenance Cost
```
- Target: 70/30 or better (70% planned)
- Indicates proactive vs. reactive culture

**Cost per Maintenance Hour**
```
Cost/Hour = Total Maintenance Cost / Total Maintenance Hours
```
- Efficiency metric
- Labor + parts + contract services

### Equipment Reliability

**Failure Rate**
```
Failure Rate = Number of Failures / Operating Hours
Units: Failures per 1000 hours
```
- Track by equipment type
- Identify chronic issues

**Critical Equipment Availability**
```
Availability % = (Uptime / (Uptime + Downtime)) × 100
```
- Focus on mission-critical systems
- Main engine, DP system, cargo systems

**Overall Equipment Effectiveness (OEE)**
```
OEE = Availability × Performance × Quality
```
- Manufacturing metric adapted for maritime
- Holistic equipment performance

## Commercial Performance

### Charter & Revenue

**Time Charter Equivalent (TCE)**
```
TCE = (Voyage Revenue - Voyage Expenses) / Duration (days)
Units: $/day
```
- Standard profitability metric
- Enables comparison across voyage and time charters

**Daily Operating Cost (OPEX)**
```
OPEX = (Crew + Stores + Maintenance + Insurance + Administration) / 365
```
- Typical range: $3,000-8,000/day
- Excludes voyage costs (fuel, port charges)

**Gross Charter Profit**
```
Profit = Revenue - (Voyage Costs + OPEX)
```
- Per voyage or per period
- Fleet aggregation

**Utilization Revenue Index**
```
URI = (Actual Revenue / Maximum Possible Revenue) × 100
```
- Measures revenue optimization
- Accounts for off-hire and rate variations

### Freight & Market

**Freight Rate Trends**
- Baltic Dry Index (BDI) for dry bulk
- Worldscale for tankers
- Day rates for offshore
- Historical vs. current rates

**Charter Index Performance**
```
Index = (Current Rate / Benchmark Rate) × 100
```
- Track against market
- Negotiation reference

### Downtime & Off-Hire

**Off-Hire Time**
```
Off-Hire % = (Off-Hire Hours / Total Charter Hours) × 100
```
- Target: <2%
- Direct revenue impact
- Contractual penalties

**Downtime by Category**
- Technical (breakdown): Target <1%
- Operational (waiting, positioning): Variable
- Weather: Uncontrollable
- Planned maintenance: Scheduled

**Downtime Cost**
```
Downtime Cost = Hire Rate × Off-Hire Hours
```
- Direct revenue loss
- Claim calculations
- Performance improvement ROI

## Safety & Quality

### Incident Frequency

**Lost Time Injury Frequency (LTIF)**
```
LTIF = (Number of LTIs × 1,000,000) / Total Man-Hours
```
- Industry target: <2.0
- Leading safety metric

**Total Recordable Incident Rate (TRIR)**
```
TRIR = (Total Recordable Incidents × 1,000,000) / Total Man-Hours
```
- Broader than LTIF
- Includes restricted work, medical treatment

**Near-Miss Reporting Rate**
```
Near-Miss Rate = Near-Misses / Total Man-Hours × 1,000,000
```
- Leading indicator
- Safety culture metric
- Target: High reporting, trend toward reduction

### Inspection & Audit

**Port State Control Deficiency Rate**
```
Deficiency Rate = Total Deficiencies / Number of Inspections
```
- Target: <3 deficiencies per inspection
- Detention risk indicator

**Vetting Inspection Performance**
- SIRE observations per vessel per year
- Target: <5 Category 1 observations
- Charterer acceptance

**Internal Audit Compliance**
```
Compliance % = (Conformities / Total Checkpoints) × 100
```
- Target: >90%
- ISM effectiveness
- Continuous improvement

### Training & Competency

**Training Compliance**
```
Compliance % = (Valid Certificates / Required Certificates) × 100
```
- Target: 100%
- STCW requirement
- Crew competency

**Training Hours per Crew Member**
```
Annual Training = Total Training Hours / Number of Crew
```
- Industry benchmark: 40-80 hours/year
- Safety culture indicator

## Crew Management

### Manning Efficiency

**Crew Cost per Day**
```
Crew Cost/Day = (Annual Crew Wages + Benefits) / 365
```
- Largest operating expense (40-50% of OPEX)
- Benchmark by vessel type and flag

**Crew Retention Rate**
```
Retention % = ((Staff at Year Start + Year End) / 2 - Departures) / ((Staff at Start + End) / 2) × 100
```
- Target: >80%
- Training investment protection
- Experience retention

**Crew Change Cost**
```
Average Cost = (Travel + Visa + Agency Fees) / Number of Changes
```
- Typically $1,000-3,000 per change
- Minimize frequency while maintaining welfare

### Work-Rest Compliance

**Rest Hour Violations**
```
Violation Rate = (Non-Compliant Days / Total Days) × 100
```
- Target: 0%
- STCW requirement
- Fatigue management

**Average Work Hours per Week**
- Limit: 72 hours in 7 days
- Alternative: 14 hours in 24 hours

## Analytics & Reporting

### Dashboard Metrics (Real-Time)

**Fleet Overview:**
- Vessels at sea vs. port
- Active vs. idle
- Maintenance status
- Alert count
- Fuel ROB across fleet

**Operational Status:**
- Current speed and position
- Voyage progress (% complete)
- ETA accuracy (variance)
- Weather impact
- DP operations uptime (offshore)

**Environmental:**
- Daily EEOI
- Cumulative CII rating
- Emission rate (kg CO₂/hour)
- Fuel consumption variance

**Maintenance:**
- Overdue tasks count
- Critical equipment status
- Spare parts low stock
- Survey due dates
- Certificate expiries

### Trend Analysis (Historical)

**Performance Trends:**
- Fuel efficiency over time
- Speed-consumption curves
- MTBF by equipment
- TCE by market conditions

**Benchmarking:**
- Vessel vs. vessel
- Fleet vs. industry
- Actual vs. budget
- Current year vs. previous year

### Predictive Analytics

**Maintenance Forecasting:**
- Predicted failure dates
- Spare parts demand
- Dry-dock cost estimation
- Survey scheduling optimization

**Commercial Forecasting:**
- Charter rate predictions
- Fuel price trends
- Utilization projections
- Revenue optimization

## Industry Benchmarks Summary

### By Vessel Type

**Bulk Carrier (Capesize):**
- EEOI: 5-7 g/tonne-NM
- Daily fuel: 40-60 MT/day
- OPEX: $4,000-6,000/day
- TCE: $10,000-30,000/day (market dependent)

**Container Ship (6,000-10,000 TEU):**
- EEOI: 12-18 g/tonne-NM
- Daily fuel: 100-150 MT/day
- OPEX: $5,000-8,000/day
- TCE: $15,000-40,000/day

**Product Tanker (MR):**
- EEOI: 5-8 g/tonne-NM
- Daily fuel: 20-30 MT/day
- OPEX: $4,000-6,000/day
- TCE: $10,000-25,000/day

**PSV (Offshore):**
- EEOI: 20-35 g/tonne-NM
- Daily fuel: 8-15 MT/day
- OPEX: $3,000-5,000/day
- Day rate: $5,000-25,000/day (market dependent)

### Key Performance Ranges

| KPI | Target | Good | Needs Improvement |
|-----|--------|------|-------------------|
| Availability | >98% | 95-98% | <95% |
| PM Compliance | >95% | 90-95% | <90% |
| PM/CM Ratio | 70/30 | 60/40 | <60/40 |
| Off-Hire | <2% | 2-4% | >4% |
| LTIF | <1.0 | 1.0-2.0 | >2.0 |
| PSC Deficiencies | <3 | 3-5 | >5 |
| CII Rating | A/B | C | D/E |