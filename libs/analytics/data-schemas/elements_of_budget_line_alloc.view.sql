SELECT
  CONCAT(document_id, '_e_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS budget_line_alloc_id,

  JSON_EXTRACT_SCALAR(elements, '$.expenseId') AS expense_id,

  CAST(JSON_EXTRACT(elements, '$.allocAmount') as FLOAT64) AS allocation_amount,
  CAST(JSON_EXTRACT(elements, '$.allocMode') as INT64) AS allocation_mode,

  offset AS element_index

FROM `project-kujali.kdev.kdev_budget_lines_allocs_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.elements')) AS elements WITH OFFSET AS offset ORDER BY offset