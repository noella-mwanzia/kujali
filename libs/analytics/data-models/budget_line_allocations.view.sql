-- This table is a view of the latest data from the budget line allocations 
-- Budget line allocations show how much of a budget line is allocated to a particular element, 
--    whether that is an expense or invoice.
SELECT
  CONCAT(document_id, '_e_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS budget_line_alloc_id,

  JSON_EXTRACT_SCALAR(elements, '$.withId') AS with_id,
  JSON_EXTRACT_SCALAR(elements, '$.withType') AS with_type,

  CAST(JSON_EXTRACT(elements, '$.allocAmount') as FLOAT64) AS allocation_amount,
  CAST(JSON_EXTRACT(elements, '$.allocMode') as INT64) AS allocation_mode,

  offset AS element_index

FROM `project-kujali.kdev.kdev_budget_lines_allocs_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.elements')) AS elements WITH OFFSET AS offset ORDER BY offset, budget_line_alloc_id
