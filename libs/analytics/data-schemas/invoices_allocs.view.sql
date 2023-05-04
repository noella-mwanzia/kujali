SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  
  JSON_EXTRACT_SCALAR(data, '$.notes') AS notes,
  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,

  JSON_EXTRACT_SCALAR(data, '$.to') AS to_name,
  JSON_EXTRACT_SCALAR(data, '$.from') AS from_name,
  JSON_EXTRACT_SCALAR(data, '$.toAccName') AS to_account_name,
  JSON_EXTRACT_SCALAR(data, '$.fromAccName') AS from_account_name,

  JSON_EXTRACT_SCALAR(data, '$.allocId') AS allocation_id,
  CAST(JSON_EXTRACT(data, '$.allocStatus') as INT64) AS allocation_status,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.date._seconds') as INT64)) AS date,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on

FROM `project-kujali.kdev.kdev_invoices_allocs_raw_latest`