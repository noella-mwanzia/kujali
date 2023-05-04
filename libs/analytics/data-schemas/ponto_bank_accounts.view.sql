SELECT
    JSON_EXTRACT_SCALAR(accounts, '$.bankAccId') AS bank_account_id,

    JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,

    JSON_EXTRACT_SCALAR(accounts, '$.originalAccountInstance.attributes.holderName') AS account_holder,
    JSON_EXTRACT_SCALAR(accounts, '$.originalAccountInstance.attributes.currency') AS account_currency,

    offset AS account_index

FROM `project-kujali.kdev.kdev_bank_connections_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.accounts')) AS accounts WITH OFFSET AS offset ORDER BY offset, org_id