/*
Removes a ticket
TODO: edit this to only disable
*/

DELETE [dbo].[Ticket]
WHERE [dbo].[Ticket].[ticketId] = @ticketId
