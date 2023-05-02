SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,
  JSON_EXTRACT_SCALAR(data, '$.name') AS name,

  JSON_EXTRACT_SCALAR(data, '$.paymentsActivationUrl') AS payments_activation_url,
  CAST(JSON_EXTRACT(data, '$.paymentsActivated') as BOOL) AS payments_activated,

  CAST(JSON_EXTRACT(accounts, '$.active') as BOOL) AS account_active,
  JSON_EXTRACT_SCALAR(accounts, '$.bankAccId') AS bank_account_id,
  JSON_EXTRACT_SCALAR(accounts, '$.sysAccId') AS sys_account_id,
  JSON_EXTRACT_SCALAR(accounts, '$.sysAccName') AS sys_account_name,
  CAST(JSON_EXTRACT(accounts, '$.status') as INT64) AS account_status,
  CAST(JSON_EXTRACT(accounts, '$.type') as INT64) AS account_type,
  JSON_EXTRACT_SCALAR(accounts, '$.iban') AS iban,

  JSON_EXTRACT_SCALAR(accounts, '$.originalAccountInstance.attributes.holderName') AS account_holder,
  JSON_EXTRACT_SCALAR(accounts, '$.originalAccountInstance.attributes.currency') AS account_currency,

  JSON_EXTRACT_SCALAR(data, '$.status') AS status,
  CAST(JSON_EXTRACT(data, '$.type') as INT64) AS connection_type,
  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

  offset AS account_index

FROM `project-kujali.kdev.kdev_bank_connections_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.accounts')) AS accounts WITH OFFSET AS offset ORDER BY offset
