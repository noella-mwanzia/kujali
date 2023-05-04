SELECT
  CONCAT(document_id, '_e_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS payment_alloc_id,

  JSON_EXTRACT_SCALAR(elements, '$.accId') AS account_id, 
  CAST(JSON_EXTRACT(elements, '$.allocAmount') as FLOAT64) AS allocation_amount,
  CAST(JSON_EXTRACT(elements, '$.allocMode') as INT64) AS allocation_mode,
  JSON_EXTRACT_SCALAR(elements, '$.invoiceId') AS invoice_id,

  offset AS element_index

FROM `project-kujali.kdev.kdev_payments_allocs_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.elements')) AS elements WITH OFFSET AS offset ORDER BY offset