/*
Updates a customer.
*/

IF EXISTS(SELECT *
          FROM [dbo].[Customer]
          WHERE [CustomerId] = @customerId
            AND ([isLocal] = 0 OR [isLocal] IS NULL))
BEGIN
  THROW 50000, 'Illegal update. Cannot update non-local customers', 1
END

UPDATE [dbo].[Customer]
SET
  [customerNumber] = @customerNumber,
  [orgName] = @orgName,
  [orgNr] = @orgNr,
  [isLocal] = 1,
  [isMerged] = 0,
  [dateChanged] = GETUTCDATE()
WHERE [customerId] = @customerId


SELECT [customerId],
       [customerNumber],
       [orgNr],
       [orgName],
       [isLocal],
       [isMerged],
       [dateCreated],
       [dateChanged]
FROM [dbo].[Customer]
WHERE [customerId] = @customerId
