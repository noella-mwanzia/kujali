SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS contact_id,

  JSON_EXTRACT_SCALAR(tags) AS tag,

  offset AS tag_index

FROM `project-kujali.kdev.kdev_contacts_raw_latest`,
JOIN UNNEST(JSON_EXTRACT_ARRAY(data, '$.tags')) AS tags WITH OFFSET USING(offset) ORDER BY offset
