-- This is a view of the latest data from the budget lines 
-- Budget lines represent the target in- and out-flows of money for a particular month.
--
-- This table has the purpose to unpack budget lines into BigQuery, but requires post processing to add the budget name
--    via a join to the budgets table. 
--
-- Therefore, do not use in the analytics data model!
SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,

  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,

  CAST(JSON_EXTRACT(data, '$.baseAmount') as FLOAT64) AS base_amount,
  CAST(JSON_EXTRACT(data, '$.units') as INT64) AS units,

  SAFE_CAST(JSON_EXTRACT(data, '$.mode') as INT64) AS mode,
  -- JSON_EXTRACT_SCALAR(data, '$.allocatedTo') AS allocated_to,

  JSON_EXTRACT_SCALAR(data, '$.planId') AS plan_id,
  JSON_EXTRACT_SCALAR(data, '$.lineId') AS line_id,
  JSON_EXTRACT_SCALAR(data, '$.budgetId') AS budget_id,


  -- Datetime object that represents the middle of the month
  --    We use a datetime as it's easier for comparison calculation in BI engines. 
  -- @see https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
  DATE(CAST(JSON_EXTRACT(data, '$.year') as INT64),CAST(JSON_EXTRACT(data, '$.month') as INT64) + 1, 15)  AS line_date,

  CAST(JSON_EXTRACT(data, '$.year') as INT64) AS year,
  CAST(JSON_EXTRACT(data, '$.month') as INT64) AS month,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_budget_lines_raw_latest`
