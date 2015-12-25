/*
Gets all categories
*/

SELECT
  [npsResponseId],
  [npsResponseTel],
  [npsResponseDate],
  [npsResponseScore],
  [npsResponseComment],
  [dateCreated],
  [dateChanged]
FROM [dbo].[NPSResponse]
