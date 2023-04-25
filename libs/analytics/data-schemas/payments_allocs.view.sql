SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(data, '$.id') AS id,

  CAST(JSON_EXTRACT(data, '$.credit') as FLOAT64) AS credit,
  CAST(JSON_EXTRACT(data, '$.allocStatus') as INT64) AS allocation_status,

  JSON_EXTRACT_SCALAR(elements, '$.accId') AS account_id,
  JSON_EXTRACT_SCALAR(elements, '$.accName') AS account_name,
  CAST(JSON_EXTRACT(elements, '$.allocAmount') as FLOAT64) AS allocation_amount,
  CAST(JSON_EXTRACT(elements, '$.allocMode') as INT64) AS allocation_mode,
  JSON_EXTRACT_SCALAR(elements, '$.invoiceId') AS invoice_id,
  JSON_EXTRACT_SCALAR(elements, '$.invoiceTitle') AS invoice_title,
  JSON_EXTRACT_SCALAR(elements, '$.pId') AS payment_id,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_payments_allocs_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.elements')) AS elements