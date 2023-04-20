SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(data, '$.id') AS id,

  CAST(JSON_EXTRACT(data, '$.number') as INT64) AS number,
  JSON_EXTRACT_SCALAR(data, '$.prefix') AS prefix,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_config_raw_latest`