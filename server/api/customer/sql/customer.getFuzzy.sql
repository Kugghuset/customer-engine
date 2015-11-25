/*
Gets organisations by a fuzzy search
*/

SELECT TOP 12  [customerId], [customerNumber], [orgNr], [orgName]
FROM [dbo].[Customer]
WHERE [orgNr] LIKE '%' + @query + '%'
   OR [orgName] LIKE '%' + @query + '%'
   OR [customerNumber] LIKE '%' + @query + '%';