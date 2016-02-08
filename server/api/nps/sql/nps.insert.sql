/*
Inserts a NPS object into the table
*/

INSERT INTO [dbo].[NPSSurveyResult] (
  [npsTel],
  [npsDate],
  [npsScore],
  [npsComment],
  [isLocal]
)
VALUES (
  @npsTel,
  @npsDate,
  @npsScore,
  @npsComment,
  @isLocal
)

SELECT TOP 1
  [npsId],
  [npsTel],
  [npsDate],
  [npsScore],
  [npsComment],
  [dateCreated],
  [dateChanged]
FROM [dbo].[NPSSurveyResult]
ORDER BY [npsId] DESC