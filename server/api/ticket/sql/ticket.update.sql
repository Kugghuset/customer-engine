/*
Inserts a new ticket and a categoryBlob
*/

SET XACT_ABORT ON

BEGIN TRAN

{updateOrCreate}

-- Ticket
UPDATE [dbo].[Ticket]
SET
  [dbo].[Ticket].[personId] = @personId,
  [dbo].[Ticket].[isReseller] = @isReseller,
  [dbo].[Ticket].[summary] = @summary,
  [dbo].[Ticket].[transferred] = @transferred,
  [dbo].[Ticket].[status] = @status,
  [dbo].[Ticket].[country] = @country,
  [dbo].[Ticket].[customerId] = @customerId,
  [dbo].[Ticket].[userId] = @userId,
  [dbo].[Ticket].[departmentId] = @departmentId,
  [dbo].[Ticket].[transferredDepartmentId] = @transferredDepartmentId,
  [dbo].[Ticket].[productId] = @productId,
  [dbo].[Ticket].[ticketDate] = @ticketDate,
  [dbo].[Ticket].[dateUpdated] = GETUTCDATE(),
  [dbo].[Ticket].[ticketDateClosed] = @ticketDateClosed
  

WHERE [ticketId] = @ticketId

UPDATE [dbo].[CategoryBlob]
SET
  [dbo].[CategoryBlob].[categoryId]= @categoryId,
  [dbo].[CategoryBlob].[subcategoryId]= @subcategoryId,
  [dbo].[CategoryBlob].[descriptorId]= @descriptorId

WHERE [dbo].[CategoryBlob].[ticketId] = @ticketId

COMMIT TRAN

