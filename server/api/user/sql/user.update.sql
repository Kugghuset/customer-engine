/*
Updates the user
*/

SET XACT_ABORT ON

BEGIN TRAN

UPDATE [dbo].[User]
SET
  [dbo].[User].[email] = @email,
  [dbo].[User].[name] = @name,
  [dbo].[User].[departmentId] = @departmentId,
  [dbo].[User].[dateChanged] = GETUTCDATE()

WHERE [userId] = @userId

COMMIT TRAN
