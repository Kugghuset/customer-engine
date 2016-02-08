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
    [npsFollowUp] varchar(max) NULL,
    [ticketId]  biginT NULL,
    [isLocal] bit NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
ELSE
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'npsFollowUp'
                AND OBJECT_ID = OBJECT_ID(N'NPS'))
  BEGIN
    ALTER TABLE [dbo].[NPS]
    ADD [npsFollowUp] varchar(max) NULL
  END
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'ticketId'
                AND OBJECT_ID = OBJECT_ID(N'NPS'))
  BEGIN
    ALTER TABLE [dbo].[NPS]
    ADD [ticketId]  biginT NULL
  END