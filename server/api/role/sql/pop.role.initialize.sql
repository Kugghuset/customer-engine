/*
Creates the Category table and populates it with data
*/

IF (OBJECT_ID('Role', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Role] (
    [roleId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [role] tinyint NOT NULL UNIQUE, -- Value 
    [roleName] varchar(256) NULL
  )
END

-- Populate the table if there's nothing in it
IF NOT EXISTS (SELECT * FROM [dbo].[Role])
BEGIN
  INSERT INTO [dbo].[Role] (
      [role]
    , [roleName]
  )
  VALUES
    (1, 'Agent')
  , (10, 'Admin')
  , (100, 'God')
END