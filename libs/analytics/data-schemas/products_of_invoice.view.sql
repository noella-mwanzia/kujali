SELECT
  CONCAT(document_id, '_p_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS invoice_id,

  CAST(JSON_EXTRACT(products, '$.cost') as INT64) AS product_cost,
  JSON_EXTRACT_SCALAR(products, '$.desc') AS product_desc,
  CAST(JSON_EXTRACT(products, '$.qty') as INT64) AS product_quantity,
  CAST(JSON_EXTRACT(products, '$.vat') as INT64) AS product_vat,
  SAFE_MULTIPLY(CAST(JSON_EXTRACT(products, '$.cost') as INT64), CAST(JSON_EXTRACT(products, '$.qty') as INT64)) AS line_cost,

  (SELECT SUM(CAST(discounts as FLOAT64)) 
  FROM UNNEST(JSON_EXTRACT_ARRAY(products, '$.discounts')) AS discounts) AS total_discount,

  offset AS product_index
FROM `project-kujali.kdev.kdev_invoices_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.products')) AS products WITH OFFSET AS offset ORDER BY offset, invoice_id