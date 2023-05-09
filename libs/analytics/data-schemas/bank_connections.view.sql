SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  JSON_EXTRACT_SCALAR(data, '$.name') AS name,

  JSON_EXTRACT_SCALAR(data, '$.paymentsActivationUrl') AS payments_activation_url,
  CAST(JSON_EXTRACT(data, '$.paymentsActivated') as BOOL) AS payments_activated,

  JSON_EXTRACT_SCALAR(data, '$.status') AS status,
  CAST(JSON_EXTRACT(data, '$.type') as INT64) AS connection_type,
  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_bank_connections_raw_latest`

