SELECT
  CONCAT(document_id, '_y_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS budget_header_id,
  
  years AS year,

  offset AS year_index

FROM `project-kujali.kdev.kdev_budget_headers_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.years')) AS years WITH OFFSET AS offset ORDER BY budget_header_id, offset