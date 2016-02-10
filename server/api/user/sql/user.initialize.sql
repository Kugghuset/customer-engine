/*
Initializes the User if it's not created already.
*/

IF (OBJECT_ID('User', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[User] (
    [userId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [email] varchar(256) UNIQUE NOT NULL,
    [password] varchar(256) NULL,
    [name] varchar(256) NULL,
    [role] tinyint DEFAULT 1 NULL,
    [lastLoggedin] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
ELSE
  -- Add password column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'password'
                AND Object_ID = Object_ID(N'User'))
  BEGIN
      ALTER TABLE [dbo].[User]
      ADD [password] varchar(256) NULL
  END
  
  -- Add departmentId column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'departmentId'
                AND Object_ID = Object_ID(N'User'))
  BEGIN
      ALTER TABLE [dbo].[User]
      ADD [departmentId] bigint NULL
  END
  
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'lastLoggedin'
                AND Object_ID = Object_ID(N'User'))
  BEGIN
      ALTER TABLE [dbo].[User]
      ADD [lastLoggedin] datetime2 DEFAULT GETUTCDATE() NULL
  END
  
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'role'
                AND Object_ID = Object_ID(N'User'))
  BEGIN
      ALTER TABLE [dbo].[User]
      ADD [role] tinyint DEFAULT 1 NULL
      
      EXEC('
        UPDATE [dbo].[User]
        SET [role] = 1
      ')
  END
  