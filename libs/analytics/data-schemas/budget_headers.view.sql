SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(path_params, '$.budgetid') AS budget_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.name') AS name,
  CAST(JSON_EXTRACT(data, '$.startY') as INT64) AS start_year,
  CAST(JSON_EXTRACT(data, '$.duration') as INT64) AS duration,
  
  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_budget_headers_raw_latest`