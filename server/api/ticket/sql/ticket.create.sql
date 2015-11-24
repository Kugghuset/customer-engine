/*
Inserts a new ticket and a categoryBlob
*/

SET XACT_ABORT ON

BEGIN TRAN

INSERT INTO [dbo].[Ticket] (
  [name],
  [email],
  [tel],
  [summary],
  [transferred],
  [successful],
  [customerId],
  [userId],
  [ticketDate]
)
VALUES (
  @name,
  @email,
  @tel,
  @summary,
  @transferred,
  @successful,
  @customerId,
  @userId,
  @ticketDate
)

INSERT INTO [dbo].[CategoryBlob] (
  [ticketId],
  [categoryId],
  [subCategoryId],
  [descriptorId]
)
SELECT MAX([dbo].[Ticket].[ticketId]) AS [ticketId],
  @categoryId AS [categoryId],
  @subCategoryId AS [subCategoryId],
  @descriptorId AS [descriptorId]
FROM [dbo].[Ticket]


SELECT TOP 1 [name],
  [email],
  [tel],
  [summary],
  [transferred],
  [successful],
  [customerId],
  [userId]
FROM [dbo].[Ticket]
ORDER BY [ticketId] DESC

COMMIT TRAN

-- Select the newly created ticket.
