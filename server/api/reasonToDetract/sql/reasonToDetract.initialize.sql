/*
Creates the ReasonToDetract table
*/

IF (Object_ID('ReasonToDetract', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[ReasonToDetract] (
      [reasonToDetractId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [reasonToDetractName] varchar(255) NULL
    , [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  )
  
  -- Insert the base values
  INSERT INTO [dbo].[ReasonToDetract] (
    [reasonToDetractName]
  )
  VALUES
    ('No / Poor solution to problem')
  , ('Long time to solve the problem')
  , ('The same problem keeps on coming back / Customer had to call back multiple times on the same issue')
  , ('Many problems overall - things don''t work well')
  , ('Customer was transferred around multiple times')
  , ('No feedback when/if problem was resolved')
  , ('Hard to get through / Long waiting time')
  , ('Unfriendly / Unprofessional agent')
  , ('Low knowledge level of agent')
  , ('Poor language capabability of agent')
  , ('Agent did not understand my problem')
  , ('No specific reason given')
  , ('Customer don''t want to talk')
  , ('NPS score based on contact with someone else than Bambora Support')
  , ('Product or system related reason (e.g. HW/SW, reports, server downtime)')
END