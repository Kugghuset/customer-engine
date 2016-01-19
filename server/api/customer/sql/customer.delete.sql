/*
Deletes a customer from the DB
*/

IF EXISTS(SELECT *
          FROM [dbo].[Ticket]
          WHERE [customerId] = @customerId)
BEGIN
  THROW 50001, 'Illegal delete. Tickets exists with a reference to the customer', 1
END

IF EXISTS(SELECT *
          FROM [dbo].[Customer]
          WHERE [customerId] = @customerId
            AND (
              ([isLocal] IS NULL OR [isLocal] = 0)
             OR [isMerged] = 1))
BEGIN
  THROW 50002, 'Illegal delete. The customer is not local', 1
END

DELETE [dbo].[Customer]
WHERE [dbo].[Customer].[customerId] = @customerId