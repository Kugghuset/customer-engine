/*
Creates the NPSSurveyResult table
*/

IF (OBJECT_ID('NPSSurveyResult', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[NPSSurveyResult] (
      [npsId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL
    , [npsTel] varchar(256) NULL
    , [npsDate] datetime2 NULL
    , [npsScore] smallint NULL
    , [npsComment] varchar(max) NULL
    , [npsFollowUp] varchar(max) NULL
    , [ticketId] bigint NULL
    , [zendeskId] varchar(255) NULL
    , [shortcode] varchar(255) NULL
    , [serviceName] varchar(255) NULL
    , [isLocal] bit NULL
    , [doNotContact] bit NULL
    , [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
    , [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
ELSE
  -- Add the npsFollowUp field
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'npsFollowUp'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [npsFollowUp] varchar(max) NULL
  END

  -- Add the ticketId field§
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'ticketId'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [ticketId] bigint NULL
  END

  -- Add the doNotContact field
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'doNotContact'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [doNotContact] bit NULL
  END

  -- Add the zendeskId field
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'zendeskId'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [zendeskId] varchar(255) NULL
  END

  -- Add the serviceName field
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'serviceName'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [serviceName] varchar(255) NULL
  END

  -- Add the shortcode field
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'shortcode'
                  AND OBJECT_ID = OBJECT_ID(N'NPSSurveyResult'))
  BEGIN
    ALTER TABLE [dbo].[NPSSurveyResult]
    ADD [shortcode] varchar(255) NULL
  END
