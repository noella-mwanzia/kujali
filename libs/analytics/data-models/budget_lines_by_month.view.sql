-- This is a view of the latest data from the budget lines 
-- Budget lines represent the target in- and out-flows of money for a particular month.
SELECT
  l.line_id AS line_id,

  l.id AS id,
  l.org_id AS org_id,
  
  l.amount as amount,
  l.base_amount AS base_amount,
  -- JSON_EXTRACT_SCALAR(l.data, '$.allocatedTo') AS allocated_to,

  -- JSON_EXTRACT_SCALAR(l.data, '$.planId') AS plan_id,

  l.units AS units,

  -- Datetime object that represents the middle of the month
  --    We use a datetime as it's easier for comparison calculation in BI engines. 
  -- @see https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
  l.line_date as line_date,

  l.year AS year,
  l.month AS month,

  l.created_by AS created_by,

  l.created_on AS created_on,

  l.budget_id AS budget_id,

FROM `project-kujali.kdev.raw_budgets` as b
LEFT JOIN `project-kujali.kdev.raw_budget_lines` as l
ON b.id=l.budget_id