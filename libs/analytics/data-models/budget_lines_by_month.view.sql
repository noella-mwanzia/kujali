-- This is a view of the latest data from the budget lines 
-- Budget lines represent the target in- and out-flows of money for a particular month.
SELECT
  JSON_EXTRACT_SCALAR(l.data, '$.lineId') AS line_id,

  l.document_id AS id,
  JSON_EXTRACT_SCALAR(l.path_params, '$.orgid') AS org_id,
  
  CAST(JSON_EXTRACT(l.data, '$.amount') as FLOAT64) AS amount,
  CAST(JSON_EXTRACT(l.data, '$.baseAmount') as FLOAT64) AS base_amount,
  -- JSON_EXTRACT_SCALAR(l.data, '$.allocatedTo') AS allocated_to,

  JSON_EXTRACT_SCALAR(l.data, '$.occurenceId') AS occurrence_id,
  CAST(JSON_EXTRACT(l.data, '$.isOccurenceStart') as BOOL) AS is_occurrence_start,

  -- JSON_EXTRACT_SCALAR(l.data, '$.planId') AS plan_id,

  CAST(JSON_EXTRACT(l.data, '$.units') as INT64) AS units,

  -- Datetime object that represents the middle of the month
  --    We use a datetime as it's easier for comparison calculation in BI engines. 
  -- @see https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
  DATE(CAST(JSON_EXTRACT(l.data, '$.year') as INT64),CAST(JSON_EXTRACT(data, '$.month') as INT64), 15)  AS line_date,

  CAST(JSON_EXTRACT(l.data, '$.year') as INT64) AS year,
  CAST(JSON_EXTRACT(l.data, '$.month') as INT64) AS month,

  JSON_EXTRACT_SCALAR(l.data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(l.data, '$.createdOn._seconds') as INT64)) AS created_on,

  JSON_EXTRACT_SCALAR(l.data, '$.budgetId') AS budget_id,

FROM `project-kujali.kdev.kdev-budget-lines-raw` as l
JOIN `project-kujali.kdev.kdev-budgets-raw` as b
USING (budget_id, b.document_id)