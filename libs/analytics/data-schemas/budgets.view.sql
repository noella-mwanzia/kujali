-- TO BE UPDATED ONCE THE "budgets" COLLECTION HAS BEEN NORMALIZED
SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  JSON_EXTRACT_SCALAR(data, '$.name') AS name,

  CAST(JSON_EXTRACT(data, '$.duration') as INT64) AS duration,
  CAST(JSON_EXTRACT(data, '$.startMonth') as INT64) AS start_month,
  CAST(JSON_EXTRACT(data, '$.startYear') as INT64) AS start_year,
  CAST(JSON_EXTRACT(data, '$.status') as INT64) AS status,

  children AS child,
  amounts_in_year AS amount_in_year,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

  offset AS budget_child_index

FROM `project-kujali.kdev.kdev_budgets_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.childrenList')) AS children WITH OFFSET AS offset
JOIN UNNEST(JSON_EXTRACT_ARRAY(data, '$.result.amountsYear')) AS amounts_in_year WITH OFFSET USING(OFFSET) ORDER BY offset



