SELECT
  CONCAT(document_id, '_a_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS connection_id,
  JSON_EXTRACT_SCALAR(accounts, '$.sysAccId') AS sys_account_id,
  JSON_EXTRACT_SCALAR(accounts, '$.bankAccId') AS bank_account_id,

  CAST(JSON_EXTRACT(accounts, '$.active') as BOOL) AS account_active,
  CAST(JSON_EXTRACT(accounts, '$.status') as INT64) AS account_status, 
  CAST(JSON_EXTRACT(accounts, '$.type') as INT64) AS account_type, 

  offset AS account_index

FROM `project-kujali.kdev.kdev_bank_connections_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.accounts')) AS accounts WITH OFFSET AS offset ORDER BY offset, connection_id