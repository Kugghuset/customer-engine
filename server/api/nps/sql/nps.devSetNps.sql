/*
Sets the ticketId of every NPSSurveyResult to an actual ticket.

Used for development reasons.
*/

DECLARE @id BigInt = 0
DECLARE @max BigInt
SELECT @max = MAX([ticketId]) FROM [tickety].[dbo].[Ticket]

DECLARE @npsId BigInt
SELECT @npsId = MIN([npsId]) FROM [tickety].[dbo].[NPSSurveyResult] WHERE [ticketId] IS NOT NULL

WHILE (1=1)
BEGIN
	IF @id = @max
		BEGIN
			BREAK
		END
	ELSE
		SELECT @id = MIN([ticketId]) FROM [tickety].[dbo].[Ticket] WHERE [ticketId] > @id
		SELECT @npsId = MIN([npsId]) FROM [tickety].[dbo].[NPSSurveyResult] WHERE [ticketId] IS NOT NULL AND [npsId] > @npsId

		UPDATE [tickety].[dbo].[NPSSurveyResult]
		SET [ticketId] = @id
		WHERE [npsId] = @npsId
		
		CONTINUE
END
