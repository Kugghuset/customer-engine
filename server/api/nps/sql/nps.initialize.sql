/*
Creates the NPS table
*/

IF (OBJECT_ID('NPS', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[NPS] (
    [npsId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [npsTel] varchar(256) NULL,
    [npsDate] datetime2 NULL,
    [npsScore] smallint NULL,
    [npsComment] varchar(max) NULL,
    [isLocal] bit NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
