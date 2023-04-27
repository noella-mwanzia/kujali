SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(path_params, '$.connectionid') AS connection_id,

  document_id AS id,
  CAST(JSON_EXTRACT(data , '$.status') as INT64) AS status,
  
  JSON_EXTRACT_SCALAR(data, '$.userAccess.access_token') AS access_token,
  CAST(JSON_EXTRACT(data , '$.userAccess.expires_in') as INT64) AS expires_in,
  JSON_EXTRACT_SCALAR(data, '$.userAccess.refresh_token') as refresh_token,
  JSON_EXTRACT_SCALAR(data, '$.userAccess.scope') AS scope,
  JSON_EXTRACT_SCALAR(data, '$.userAccess.token_type') AS token_type,

  CAST(JSON_EXTRACT(data , '$.version') as INT64) AS version,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_bank_connections_access_info_raw_latest`

