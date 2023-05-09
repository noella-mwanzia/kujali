SELECT
  CONCAT(document_id, '_y_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS budget_header_id,

  headers.key AS year,

  (SELECT SUM(CAST(amounts_in_year as FLOAT64)) 
  FROM UNNEST(SPLIT(headers.value, ',')) AS amounts_in_year) AS total_amount,

  offset AS yearly_amount_index

FROM `project-kujali.kdev.kdev_budget_headers_raw_latest`,
UNNEST(`project-kujali.kdev.EXTRACT_MAP_KEYS_AND_VALUES`(JSON_EXTRACT(data, '$.headers'))) AS headers WITH OFFSET AS offset ORDER BY budget_header_id, offset