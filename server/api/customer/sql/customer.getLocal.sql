/*
Gets organistaions which are created inside Tickety
*/

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
