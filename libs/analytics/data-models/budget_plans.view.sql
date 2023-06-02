-- Budget plans are at the heart of the budget explorer feature.
--  They are not useful for 

SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.orgid') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.budgetId') AS budget_id,

  CAST(JSON_EXTRACT(data, '$.amount') as FLOAT64) AS amount,
  CAST(JSON_EXTRACT(data, '$.frequency') as INT64) AS frequency,
  CAST(JSON_EXTRACT(data, '$.hasIncrease') as BOOL) AS has_increase,
  CAST(JSON_EXTRACT(data, '$.king') as BOOL) AS king,

  JSON_EXTRACT_SCALAR(data, '$.lineId') AS line_id,
  JSON_EXTRACT_SCALAR(data, '$.lineName') AS line_name,

  CAST(JSON_EXTRACT(data, '$.mode') as INT64) AS mode,
  JSON_EXTRACT_SCALAR(data, '$.trCatId') AS transaction_category_id,
  JSON_EXTRACT_SCALAR(data, '$.trTypeId') AS transaction_type_id,

  CAST(JSON_EXTRACT(data, '$.units') as INT64) AS units,
  CAST(JSON_EXTRACT(data, '$.xTimesInterval') as INT64) AS x_times_interval,

  CAST(JSON_EXTRACT(data, '$.amntIncrConfig.incrFreq') as INT64) AS amnt_incr_freq,
  CAST(JSON_EXTRACT(data, '$.amntIncrConfig.incrRate') as INT64) AS amnt_incr_rate,
  JSON_EXTRACT_SCALAR(data, '$.amntIncrConfig.incrStyle')        AS amnt_incr_style,
  CAST(JSON_EXTRACT(data, '$.amntIncrConfig.interval') as INT64) AS amnt_incr_interval,

  CAST(JSON_EXTRACT(data, '$.unitIncrConfig.incrFreq') as INT64) AS unit_incr_freq,
  CAST(JSON_EXTRACT(data, '$.unitIncrConfig.incrRate') as INT64) AS unit_incr_rate,
  JSON_EXTRACT_SCALAR(data, '$.unitIncrConfig.incrStyle')        AS unit_incr_style,
  CAST(JSON_EXTRACT(data, '$.unitIncrConfig.interval') as INT64) AS unit_incr_interval,

  JSON_EXTRACT_SCALAR(data, '$.fromMonth.slug') AS from_month,
  CAST(JSON_EXTRACT(data, '$.fromYear') as INT64) AS from_year,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,

FROM `project-kujali.kdev.kdev_budget_plans_raw_latest`