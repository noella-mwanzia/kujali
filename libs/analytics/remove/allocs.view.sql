SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  
  CAST(JSON_EXTRACT(data , '$.amount') as FLOAT64) AS amount,

  JSON_EXTRACT_SCALAR(data, '$.invId') AS invoice_id,
  JSON_EXTRACT_SCALAR(data, '$.pId') AS payment_id,

  CAST(JSON_EXTRACT(data , '$.trType') as INT64) AS transaction_type,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_allocs_raw_latest`