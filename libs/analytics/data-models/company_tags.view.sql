SELECT
  CONCAT(document_id, '_t_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS company_id,

  JSON_EXTRACT_SCALAR(tags) AS tag,

  offset AS tag_index

FROM `project-kujali.kdev.kdev_companies_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.tags')) AS tags WITH OFFSET AS offset ORDER BY offset, company_id

