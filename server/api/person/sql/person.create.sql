/*
Creates a new person and tags it as isLocal
*/

SET XACT_ABORT ON

BEGIN TRAN

INSERT INTO [dbo].[Person] (
  [name],
  [email],
  [tel],
  [altTel],
  [customerId]
)
VALUES (
  @name,
  @email,
  @tel,
  @altTel,
  @customerId
)

COMMIT TRAN

SELECT TOP 1
  [personId],
  [name],
  [email],
  [tel],
  [altTel]
FROM [dbo].[Person]
ORDER BY [personId] DESC
