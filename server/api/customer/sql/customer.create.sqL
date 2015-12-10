/*
Creates a new customer and tags it as isLocal
*/

SET XACT_ABORT ON

BEGIN TRAN

INSERT INTO [dbo].[Customer] (
  [orgName],
  [orgNr],
  [customerNumber],
  [isLocal]
)
VALUES (
  @orgName,
  @orgNr,
  @customerNumber,
  1
)

COMMIT TRAN

SELECT TOP 1
  [customerId],
  [customerNumber],
  [orgNr],
  [orgName]
FROM [dbo].[Customer]
ORDER BY [customerId] DESC
