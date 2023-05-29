SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.fName') AS firstname,
  JSON_EXTRACT_SCALAR(data, '$.lName') AS lastname,
  JSON_EXTRACT_SCALAR(data, '$.email') AS email,
  JSON_EXTRACT_SCALAR(data, '$.dob') AS date_of_birth,
  JSON_EXTRACT_SCALAR(data, '$.gender') AS gender,

  JSON_EXTRACT_SCALAR(data, '$.phone') AS phone,
  JSON_EXTRACT_SCALAR(data, '$.address') AS address,
  JSON_EXTRACT_SCALAR(data, '$.facebook') AS facebook,
  JSON_EXTRACT_SCALAR(data, '$.linkedin') AS linkedin,
  JSON_EXTRACT_SCALAR(data, '$.company') AS company,
  JSON_EXTRACT_SCALAR(data, '$.mainLanguage') AS main_language,


  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_contacts_raw_latest`
