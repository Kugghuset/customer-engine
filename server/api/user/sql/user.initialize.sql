/*
Initializes the User if it's not created already.
*/

IF (OBJECT_ID('User', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[User] (
    [userId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [email] varchar(256) UNIQUE NOT NULL,
    [name] varchar(256) NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END