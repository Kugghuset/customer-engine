/*
Gets organisations by a fuzzy search
*/


SELECT TOP 10 [customerId], [customerNumber], [orgNr], [orgName], [isLocal], [isMerged]
FROM [dbo].[Customer]
WHERE [orgNr] = @query

UNION

SELECT TOP 10 [customerId], [customerNumber], [orgNr], [orgName], [isLocal], [isMerged]
FROM [dbo].[Customer]
WHERE [customerNumber] = @query

UNION

SELECT TOP 30 [customerId], [customerNumber], [orgNr], [orgName], [isLocal], [isMerged]
FROM [dbo].[Customer]
WHERE [orgName] LIKE '%' + @query + '%'

