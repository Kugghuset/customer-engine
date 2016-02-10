/*
Updates the user
*/

SET XACT_ABORT ON

BEGIN TRAN

IF EXISTS(SELECT * FROM [dbo].[User]
          WHERE [email] = @email
            AND [userId] != @userId)
BEGIN
  SELECT 'Email already exists.' AS [error]
END
ELSE
  UPDATE [dbo].[User]
  SET
      [dbo].[User].[email] = @email
    , [dbo].[User].[name] = @name
    , [dbo].[User].[departmentId] = @departmentId
    -- , [dbo].[User].[role] = @role
    , [dbo].[User].[dateChanged] = GETUTCDATE()
  
  WHERE [userId] = @userId
  
COMMIT TRAN
