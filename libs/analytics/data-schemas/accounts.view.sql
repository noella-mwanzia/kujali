
SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  JSON_EXTRACT_SCALAR(data, '$.id') AS id,


  JSON_EXTRACT_SCALAR(data, '$.accountHolder') AS name,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.city') AS address_city,
 

FROM `project-kujali.kdev.accounts_raw_latest`