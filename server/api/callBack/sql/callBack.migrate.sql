IF EXISTS(SELECT * FROM [dbo].[CallBack])
BEGIN

  -- Migrates the reference of ticketId on CallBacks to npsId directly
  IF NOT EXISTS(SELECT *
                FROM [dbo].[CallBack]
                WHERE [npsId] IS NOT NULL)
  BEGIN
    UPDATE [dbo].[CallBack]
      SET [npsId] = (
        SELECT [npsId]
        FROM [dbo].[NPSSurveyResult]
        WHERE [ticketId] = [dbo].[CallBack].[ticketId]
      )
    WHERE [npsId] IS NULL
  END

END