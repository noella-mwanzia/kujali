
SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  -- String type
  JSON_EXTRACT_SCALAR(data, '$.id') AS id,

  -- Datetime type
  TIMESTAMP_SECONDS(cast(JSON_EXTRACT( data , '$.date._seconds') as int64)) AS date,

  -- Float type (decimal numbers)
  CAST(JSON_EXTRACT( data , '$.amount') as FLOAT64) AS amount,

  JSON_EXTRACT_SCALAR(data, '$.notes') AS notes,
  JSON_EXTRACT_SCALAR(data, '$.description') AS descr,
  JSON_EXTRACT_SCALAR(data, '$.from') AS from_id,
  JSON_EXTRACT_SCALAR(data, '$.fromAccName') AS from_name,
  JSON_EXTRACT_SCALAR(data, '$.ibanFrom') AS iban_from,
  JSON_EXTRACT_SCALAR(data, '$.to') AS to_id,
  JSON_EXTRACT_SCALAR(data, '$.toAccName') AS to_name,
  JSON_EXTRACT_SCALAR(data, '$.ibanTo') AS iban_to,
  
  JSON_EXTRACT_SCALAR(data, '$.source') AS tr_source,
  JSON_EXTRACT_SCALAR(data, '$.trStatus') AS transaction_status,

  -- Integer type
  CAST(JSON_EXTRACT( data , '$.mode') as INT64) AS mode,
  CAST(JSON_EXTRACT( data , '$.type') as INT64) AS type,

  TIMESTAMP_SECONDS(cast(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(cast(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_raw_latest`