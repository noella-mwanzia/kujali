
SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.accountHolder') AS holder_name,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderEmail') AS holder_email,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderPhone') AS holder_phone,

  JSON_EXTRACT_SCALAR(data, '$.name') AS account_name,
  JSON_EXTRACT_SCALAR(data, '$.desc') AS account_desc,
  JSON_EXTRACT_SCALAR(data, '$.currency') AS account_currency,
  JSON_EXTRACT_SCALAR(data, '$.trType') AS transaction_type,

  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.city') AS address_city,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.country') AS address_country,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.physicalAddress') AS physical_address,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.postalAddress') AS postal_address,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.postalCode') AS postal_code,
  JSON_EXTRACT_SCALAR(data, '$.accountHolderAddress.streetName') AS address_street,

  CAST(JSON_EXTRACT( data , '$.bankConnection') as INT64) AS bank_connection,

  JSON_EXTRACT_SCALAR(data, '$.bic') AS bic,
  JSON_EXTRACT_SCALAR(data, '$.iban') AS iban,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `project-kujali.kdev.kdev_accounts_raw_latest`