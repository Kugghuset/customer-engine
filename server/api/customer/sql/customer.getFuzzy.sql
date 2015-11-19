/*
Gets organisations by a fuzzy search
*/

SELECT [customerId], [orgNr], [orgName], [customerName]
FROM [dbo].[Customer]
WHERE [orgNr] LIKE '%' + @query + '%'
   OR [orgName] LIKE '%' + @query + '%'
   OR [customerName] LIKE '%' + @query + '%';