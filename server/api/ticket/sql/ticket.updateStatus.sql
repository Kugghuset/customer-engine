/*
Updates the status of the ticket
*/


SET XACT_ABORT ON

BEGIN TRAN

UPDATE [dbo].[Ticket]
SET
  [dbo].[Ticket].[status] = @status,
  [dbo].[Ticket].[dateUpdated] = GETUTCDATE()
  
WHERE [ticketId] = @ticketId

COMMIT TRAN
