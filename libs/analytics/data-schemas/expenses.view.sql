SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(data, '$.id') AS id,

  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,
  CAST(JSON_EXTRACT(data, '$.baseAmount') as FLOAT64) AS base_amount,

  CAST(JSON_EXTRACT_SCALAR(path_params, '$.year') as INT64) AS year,

  CAST(JSON_EXTRACT(data, '$.isOccurenceStart') as BOOL) AS is_occurrence_start,
  JSON_EXTRACT_SCALAR(data, '$.occurenceId') AS occurrence_id, 
  JSON_EXTRACT_SCALAR(data, '$.plan.id') AS plan_id,
  JSON_EXTRACT_SCALAR(data, '$.plan.lineId') AS line_id,
  JSON_EXTRACT_SCALAR(data, '$.plan.budgetId') AS budget_id,

  CAST(JSON_EXTRACT(data, '$.units') as INT64) AS units,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(cast(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_expenses_raw_latest`