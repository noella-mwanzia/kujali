-- This table describes how an invoice was paid.
--  It links invoices to payments and/or credit notes.
SELECT
  CONCAT(document_id, '_e_', offset) as id,
  
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,

  document_id AS invoice_id,
  JSON_EXTRACT_SCALAR(elements, '$.accId') AS account_id,
  JSON_EXTRACT_SCALAR(elements, '$.pId') AS payment_id,

  CAST(JSON_EXTRACT(elements, '$.allocAmount') as FLOAT64) AS allocation_amount,
  CAST(JSON_EXTRACT(elements, '$.allocMode') as INT64) AS allocation_mode,
  CAST(JSON_EXTRACT(elements, '$.allocType') as INT64) AS allocation_type,

  offset AS element_index

  JSON_EXTRACT_SCALAR(data, '$.notes') AS notes,

  JSON_EXTRACT_SCALAR(data, '$.to') AS invoice_to_account_id,
  JSON_EXTRACT_SCALAR(data, '$.from') AS invoice_from_account_id,

FROM `project-kujali.kdev.kdev_invoices_allocs_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.elements')) AS elements WITH OFFSET AS offset ORDER BY offset, invoice_alloc_id