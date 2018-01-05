UPDATE api_concept SET name=(name || uuid), display_name=(display_name || uuid)
WHERE name IN (
    SELECT duplicates.name from (
        SELECT name, count(*)
        FROM api_concept
        GROUP BY name
        HAVING count(*) > 1
    ) as duplicates
);
