/*
Gets organisations by a fuzzy search
*/

SELECT [customerId], [orgNr], [orgName]
FROM [dbo].[Customer]
WHERE [orgNr] LIKE '%' + @query + '%'
   OR [orgName] LIKE '%' + @query + '%';