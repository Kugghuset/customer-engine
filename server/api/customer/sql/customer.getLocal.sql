/*
Gets organistaions which are created inside Tickety
*/

-- Current page
SELECT [customerId],
       [customerNumber],
       [orgNr],
       [orgName],
       [isLocal],
       [isMerged],
       [dateCreated],
       [dateChanged]
FROM [dbo].[Customer]
WHERE [isLocal] = 1
ORDER BY [orgName], [orgNr], [customerNumber]
{ offset }

-- Customer count
SELECT COUNT(*) AS [customerCount]
FROM [dbo].[Customer]
WHERE [isLocal] = 1