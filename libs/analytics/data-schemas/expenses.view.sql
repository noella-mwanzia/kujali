SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  
  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,
  JSON_EXTRACT_SCALAR(data, '$.allocatedTo') AS allocated_to,

  JSON_EXTRACT_SCALAR(data, '$.note') AS note,

  JSON_EXTRACT_SCALAR(data, '$.planId') AS plan_id,
  JSON_EXTRACT_SCALAR(data, '$.lineId') AS line_id,
  JSON_EXTRACT_SCALAR(data, '$.budgetId') AS budget_id,

  JSON_EXTRACT_SCALAR(data, '$.trCat') AS transaction_category,
  JSON_EXTRACT_SCALAR(data, '$.trType') AS transaction_type,

  CAST(JSON_EXTRACT(data, '$.vat') as INT64) AS vat,

  TIMESTAMP_SECONDS(cast(JSON_EXTRACT(data, '$.date._seconds') as INT64)) AS date,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(cast(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(cast(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_expenses_raw_latest`