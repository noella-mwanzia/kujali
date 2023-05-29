-- This is a view of the latest data from the budget lines 
-- Budget lines represent the target in- and out-flows of money for a particular month.
SELECT
  l.id AS id,
  l.org_id AS org_id,
  l.line_id AS line_id,

  l.amount as amount,
  l.base_amount AS base_amount,
  l.units AS units,
  l.mode as mode,
  -- JSON_EXTRACT_SCALAR(l.data, '$.allocatedTo') AS allocated_to,

  -- JSON_EXTRACT_SCALAR(l.data, '$.planId') AS plan_id,


  -- Datetime object that represents the middle of the month
  --    We use a datetime as it's easier for comparison calculation in BI engines. 
  -- @see https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
  l.line_date as line_date,

  l.year AS year,
  l.month AS month,

  l.created_by AS created_by,

  l.created_on AS created_on,

  l.id AS budget_id,
  b.name AS budget_name,
  p.line_name as line_name

FROM `project-kujali.kdev.raw_budget_lines` as l
JOIN `project-kujali.kdev.raw_budgets` as b
ON b.id=l.budget_id
JOIN `project-kujali.kdev_analysis.budget_plans` as p
ON l.line_id=p.line_id AND p.king=True