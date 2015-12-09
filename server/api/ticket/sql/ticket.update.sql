/*
Inserts a new ticket and a categoryBlob
*/

SET XACT_ABORT ON

BEGIN TRAN

UPDATE [dbo].[Ticket]
SET
  [dbo].[Ticket].[name] = @name,
  [dbo].[Ticket].[email] = @email,
  [dbo].[Ticket].[tel] = @tel,
  [dbo].[Ticket].[altTel] = @altTel,
  [dbo].[Ticket].[summary] = @summary,
  [dbo].[Ticket].[transferred] = @transferred,
  [dbo].[Ticket].[status] = @status,
  [dbo].[Ticket].[isReseller] = @isReseller,
  [dbo].[Ticket].[country] = @country,
  [dbo].[Ticket].[customerId] = @customerId,
  [dbo].[Ticket].[userId] = @userId,
  [dbo].[Ticket].[departmentId] = @departmentId,
  [dbo].[Ticket].[ticketDate] = @ticketDate,
  [dbo].[Ticket].[dateUpdated] = GETUTCDATE()
  

WHERE [ticketId] = @ticketId

UPDATE [dbo].[CategoryBlob]
SET
  [dbo].[CategoryBlob].[categoryId]= @categoryId,
  [dbo].[CategoryBlob].[subcategoryId]= @subcategoryId,
  [dbo].[CategoryBlob].[descriptorId]= @descriptorId

WHERE [dbo].[CategoryBlob].[ticketId] = @ticketId

COMMIT TRAN

