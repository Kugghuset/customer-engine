/*
Creates the NpsQuarantine table
*/

IF (OBJECT_ID('NpsQuarantine', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[NpsQuarantine] (
    [npsId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [npsTel] varchar(256) NULL,
    [npsDate] datetime2 NULL,
    [npsScore] smallint NULL,
    [npsComment] varchar(max) NULL,
    [npsFollowUp] varchar(max) NULL,
    [ticketId]  biginT NULL,
    [isLocal] bit NULL,
    [doNotContact] bit NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
