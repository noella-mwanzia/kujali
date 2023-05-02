SELECT
  CONCAT(document_id, '_r_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS contact_id,


  JSON_EXTRACT_SCALAR(roles) AS role,

  offset AS role_index

FROM `project-kujali.kdev.kdev_contacts_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.role')) AS roles WITH OFFSET AS offset
