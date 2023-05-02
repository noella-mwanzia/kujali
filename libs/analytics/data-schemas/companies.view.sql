SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.name') AS name,
  JSON_EXTRACT_SCALAR(data, '$.hq') AS headquarters,
  JSON_EXTRACT_SCALAR(data, '$.logoImgUrl') as logo_img_url,
  JSON_EXTRACT_SCALAR(tags) AS tag,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

  offset AS tag_index

FROM `project-kujali.kdev.kdev_companies_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.tags')) AS tags WITH OFFSET AS offset ORDER BY offset