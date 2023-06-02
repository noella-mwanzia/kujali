-- This is a view of the latest data from the budgets 
-- This table has the purpose to unpack budgets into BigQuery, but requires post processing to add the budget lines.
--
-- Therefore, do not use in the analytics data model!
SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  JSON_EXTRACT_SCALAR(data, '$.name') AS name,

  CAST(JSON_EXTRACT(data, '$.duration') as INT64) AS duration,
  CAST(JSON_EXTRACT(data, '$.startMonth') as INT64) AS start_month,
  CAST(JSON_EXTRACT(data, '$.startYear') as INT64) AS start_year,
  CAST(JSON_EXTRACT(data, '$.status') as INT64) AS status,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_budgets_raw_latest`



