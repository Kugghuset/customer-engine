/*
Creates the Descriptor table
*/

IF (OBJECT_ID('Descriptor', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Descriptor] (
    [descriptorId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [descriptorName] varchar(256),
    [subcategoryId] bigint NULL -- parent
  )
  
  INSERT INTO [dbo].[Descriptor] (
    [descriptorName],
    [subcategoryId]
  )
  VALUES
    ('Account setup', 8),
    ('Implementation', 11),
    ('Test', 11),
    ('Webmanager', 11),
    ('Set-up', 11),
    ('Refund', 17),
    ('Gerneral transaction problems', 17),
    ('S&R', 18),
    ('DOA', 18),
    ('Swap service', 18),
    ('General', 18),
    ('Communication problems', 22),
    ('Printer problems', 22),
    ('Blue screen', 22),
    ('Chip reader', 22),
    ('Terminal settings', 22),
    ('Power problems', 22),
    ('Cross sell', 26)
END
