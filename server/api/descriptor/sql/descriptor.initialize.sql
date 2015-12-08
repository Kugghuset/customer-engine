/*
Creates the Descriptor table
*/

IF (OBJECT_ID('Descriptor', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Descriptor] (
    [descriptorId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [descriptorName] varchar(256),
    [subcategoryId] bigint NULL, -- parent
    [disabled] bit NULL
  )
END

