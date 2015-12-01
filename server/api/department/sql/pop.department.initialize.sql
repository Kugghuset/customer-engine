/*
Creates the Department table
*/

IF (OBJECT_ID('Department', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Department] (
    [departmentId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [departmentName] varchar(256) NULL
  )
  
  INSERT INTO [dbo].[Department] (
    [departmentName]
  )
  VALUES
  ('Sales'),
  ('IT'),
  ('Marketing'),
  ('Tech support'),
  ('Customer support')
END
