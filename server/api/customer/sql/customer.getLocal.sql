/*
Gets organistaions which are created inside Tickety
*/

SELECT [customerId],
       [customerNumber],
       [orgNr],
       [isLocal],
       [isMerged]
FROM [dbo].[Customer]
WHERE [isLocal] = 1
