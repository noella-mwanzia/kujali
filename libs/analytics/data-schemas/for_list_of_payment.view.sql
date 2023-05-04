SELECT
  CONCAT(document_id, '_f_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS payment_id,

  for_list AS for_text,
  offset AS for_list_index

FROM `project-kujali.kdev.kdev_payments_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.for')) AS for_list WITH OFFSET AS offset ORDER BY offset