CREATE FUNCTION `project-kujali.kdev`.EXTRACT_MAP_KEYS_AND_VALUES(json_string STRING)
RETURNS ARRAY<STRUCT<key STRING, value STRING>>
LANGUAGE js AS """
  let map_obj = JSON.parse(json_string);
  
  return Object.entries(map_obj).map(
    (obj) => Object.fromEntries([["key", obj[0]],["value",  obj[1]]])
  );
""";