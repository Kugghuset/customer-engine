/*
Creates the ReasonToPromote table
*/

IF (Object_ID('ReasonToPromote', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[ReasonToPromote] (
      [reasonToPromoteId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [reasonToPromoteName] varchar(255) NULL
    , [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  )
  
  -- Insert the base values
  INSERT INTO [dbo].[ReasonToPromote] (
    [reasonToPromoteName]
  )
  VALUES
      ('Problem resolved instantly')
    , ('Problem solved within reasonable time')
    , ('Problem was resolved permanently')
    , ('Few problems - things generally works well')
    , ('Few/no transfers')
    , ('Feedback when problem was resolved')
    , ('Easy to get through / Short waiting time')
    , ('Friendly & professional agent')
    , ('High knowledge level of agent')
    , ('Good language capabability of agent')
    , ('Agent understood my problem')
    , ('No specific reason given')
    , ('Customer don''t want to talk')
    , ('NPS score based on contact with someone else than Bambora Support')
    , ('Product or system related reason (e.g. HW/SW, reports)')
END