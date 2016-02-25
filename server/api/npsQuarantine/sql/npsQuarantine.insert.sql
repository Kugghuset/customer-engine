/*
Inserts a NPS object into the table
*/

INSERT INTO [dbo].[NpsQuarantine] (
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
FROM [dbo].[NpsQuarantine]
ORDER BY [npsId] DESC