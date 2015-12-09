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
  ('Customer Support'),
  ('Payment Operation'),
  ('Contract Operations'),
  ('Logistics'),
  ('Partner Service'),
  ('Marketing'),
  ('Product Operations'),
  ('Sales'),
  ('Visma')

END

IF NOT EXISTS(SELECT * FROM [dbo].[Department]
              WHERE [departmentName] = 'Visma')
  BEGIN
    DROP TABLE [dbo].[Department]
    
    CREATE TABLE [dbo].[Department] (
    [departmentId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [departmentName] varchar(256) NULL
    )
  
    INSERT INTO [dbo].[Department] (
      [departmentName]
    )
    VALUES
    ('Customer Support'),
    ('Payment Operation'),
    ('Contract Operations'),
    ('Logistics'),
    ('Partner Service'),
    ('Marketing'),
    ('Product Operations'),
    ('Sales'),
    ('Visma')
    
  END
