SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(data, '$.id') AS id,

  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,
  CAST(JSON_EXTRACT(data, '$.baseAmount') as FLOAT64) AS base_amount,
  JSON_EXTRACT_SCALAR(data, '$.allocatedTo') AS allocated_to,
  CAST(JSON_EXTRACT(data, '$.isOccurenceStart') as BOOL) AS is_occurrence_start,
  

  JSON_EXTRACT_SCALAR(data, '$.planId') AS plan_id,
  JSON_EXTRACT_SCALAR(data, '$.lineId') AS line_id,
  JSON_EXTRACT_SCALAR(data, '$.budgetId') AS budget_id,

  CAST(JSON_EXTRACT(data, '$.units') as INT64) AS units,

  CAST(JSON_EXTRACT(data, '$.month') as INT64) AS month,
  CAST(JSON_EXTRACT(data, '$.year') as INT64) AS year,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_budget_lines_raw_latest`