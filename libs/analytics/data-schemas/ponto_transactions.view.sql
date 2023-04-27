SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  JSON_EXTRACT_SCALAR(data, '$.description') AS description,
  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,

  JSON_EXTRACT_SCALAR(data, '$.to') AS to_name,
  JSON_EXTRACT_SCALAR(data, '$.from') AS from_name,
  JSON_EXTRACT_SCALAR(data, '$.toAccName') AS to_account_name,
  JSON_EXTRACT_SCALAR(data, '$.fromAccName') AS from_account_name,
  JSON_EXTRACT_SCALAR(data, '$.ibanTo') AS iban_to,
  JSON_EXTRACT_SCALAR(data, '$.ibanFrom') AS iban_from,

  CAST(JSON_EXTRACT(data, '$.mode') as INT64) AS mode,
  JSON_EXTRACT_SCALAR(data, '$.notes') AS notes,
  CAST(JSON_EXTRACT(data, '$.source') as INT64) AS source,
  JSON_EXTRACT_SCALAR(data, '$.trStatus') AS transaction_status,
  CAST(JSON_EXTRACT(data, '$.type') as INT64) AS type,

  CAST(JSON_EXTRACT(data, '$.verified') as BOOL) AS verified,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.verificationDate._seconds') as INT64)) AS verification_date,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.date._seconds') as INT64)) AS date,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_ponto_transactions_raw_latest`