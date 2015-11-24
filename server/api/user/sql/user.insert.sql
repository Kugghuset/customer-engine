/*
Inserts a user and returns it.
*/

SET XACT_ABORT ON

BEGIN TRAN

INSERT INTO [dbo].[User] (
  [email],
  [name]
)
VALUES (
  @email,
  @name
)

COMMIT TRAN

SELECT TOP 1 [userId], [email], [name]
FROM [dbo].[User]
ORDER BY [userId] DESC
