/*
Creates the Role table
*/

IF (OBJECT_ID('Role', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Role] (
    [roleId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [role] tinyint NOT NULL UNIQUE, -- Value 
    [roleName] varchar(256) NULL
  )
END
