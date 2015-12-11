/*
Updates the status of the ticket
*/


SET XACT_ABORT ON

BEGIN TRAN

UPDATE [dbo].[Ticket]
SET
  [dbo].[Ticket].[status] = @status,
  [dbo].[Ticket].[dateUpdated] = GETUTCDATE(),
  [dbo].[Ticket].[ticketDateClosed] =
    CASE
      WHEN @status = 'Closed' THEN GETUTCDATE()
      ELSE NULL
    END
  
WHERE [ticketId] = @ticketId

COMMIT TRAN
