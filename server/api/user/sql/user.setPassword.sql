/*
Updates the user
*/

SET XACT_ABORT ON

BEGIN TRAN
UPDATE [dbo].[User]
SET
  [dbo].[User].[password] = @password

WHERE [userId] = @userId
  
COMMIT TRAN
