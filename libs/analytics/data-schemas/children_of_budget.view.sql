SELECT
  CONCAT(document_id, '_c_', offset) as id,

  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS budget_id,

  children AS child,

  offset AS budget_child_index

FROM `project-kujali.kdev.kdev_budgets_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.childrenList')) AS children WITH OFFSET AS offset