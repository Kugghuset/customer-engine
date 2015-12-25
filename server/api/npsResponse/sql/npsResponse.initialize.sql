/*
Creates the NPSResponse table
*/

IF (OBJECT_ID('NPSResponse', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[NPSResponse] (
    [npsResponseId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [npsResponseTel] varchar(256) NULL,
    [npsResponseDate] datetime2 NULL,
    [npsResponseScore] smallint NULL,
    [npsResponseComment] varchar(max) NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
