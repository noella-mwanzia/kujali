-- This is a view of the latest data from the budget line allocations. 
-- Budget line allocations show how much money was spent on each month.
SELECT
  a.id AS id,
  l.line_id AS line_id,
  l.org_id AS org_id,
  
  a.allocAmount as amount,
  a.allocMode AS mode,
  
  -- Datetime object that represents the middle of the month
  --    We use a datetime as it's easier for comparison calculation in BI engines. 
  -- @see https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
  l.line_date as line_date,

  a.year AS year,
  a.month AS month,

  l.created_by AS created_by,
  l.created_on AS created_on,

  l.budget_id AS budget_id,
  l.budget_name as budget_name,
  l.line_name as line_name,
  -- p.type_name as line_type_name,
  -- p.category_name as category_name,

FROM `project-kujali.kdev.raw_bl_allocations` as a
JOIN `project-kujali.kdev.raw_budget_lines` as l
-- Budget Line Alloc ID = Budget Line ID. There is only one parent alloc per line.
ON a.budget_line_id=l.id
