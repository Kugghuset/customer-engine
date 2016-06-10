/*
Creates the NPSSurveyResult table
*/

IF (OBJECT_ID('NPSSurveyResult', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[NPSSurveyResult] (
    [npsId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [npsTel] varchar(256) NULL,
    [npsDate] datetime2 NULL,
    [npsScore] smallint NULL,
    [npsComment] varchar(max) NULL,
    [npsFollowUp] varchar(max) NULL,
    [ticketId] varchar(256) NULL,
    [isLocal] bit NULL,
    [doNotContact] bit NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
ELSE
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'npsFollowUp'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [npsFollowUp] varchar(max) NULL
  END
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'ticketId'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [ticketId] varchar(256) NULL
  END
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'doNotContact'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [doNotContact] bit NULL
  END

  -- Alter the type of the ticketId column
  IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = N'NPSSurveyResult'
              AND COLUMN_NAME = N'ticketId'
              AND DATA_TYPE = N'bigint')
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ALTER COLUMN [ticketId] VarChar(256) NULL
  END