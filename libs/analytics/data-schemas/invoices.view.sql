SELECT
  JSON_EXTRACT(data, '$.id') AS id,

  JSON_EXTRACT_SCALAR(data, '$.number') AS number,
  JSON_EXTRACT_SCALAR(data, '$.title') AS title,
  JSON_EXTRACT_SCALAR(data, '$.status') AS status,
  JSON_EXTRACT_SCALAR(data, '$.structuredMessage') AS structured_message,
  JSON_EXTRACT_SCALAR(data, '$.currency') AS currency,
  JSON_EXTRACT_SCALAR(data, '$.customer') AS customer,
  JSON_EXTRACT_SCALAR(data, '$.contact') AS contact,
  JSON_EXTRACT_SCALAR(data, '$.company') AS company,
  
  CAST(JSON_EXTRACT(products, '$.cost') as INT64) AS product_cost,
  JSON_EXTRACT_SCALAR(products, '$.desc') AS product_desc,
  CAST(JSON_EXTRACT(products, '$.qty') as INT64) AS product_quantity,
  CAST(JSON_EXTRACT(products, '$.vat') as INT64) AS product_vat,
  JSON_EXTRACT_ARRAY(products, '$.discount') AS discount,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.date._seconds') as INT64)) AS date,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.dueDate._seconds') as INT64)) AS due_date,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_invoices_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.products')) AS products


