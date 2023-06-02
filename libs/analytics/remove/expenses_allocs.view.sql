SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,

  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,
  CAST(JSON_EXTRACT(data, '$.balance') as FLOAT64) AS balance,

  JSON_EXTRACT_SCALAR(data, '$.allocId') AS allocation_id,
  CAST(JSON_EXTRACT(data, '$.allocStatus') as INT64) AS allocation_status,

  JSON_EXTRACT_SCALAR(data, '$.to') AS to_id,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_expenses_allocs_raw_latest`
