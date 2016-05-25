/*
Finds tickets by somethign and joins it. The something is determined by a where_clause set in JavaScript
*/

-- DECLARE @upperDateLimit DATETIME2 = '2016-02-28'
-- DECLARE @lowerDateLimit DATETIME2 = '2016-02-22'
-- DECLARE @threeMonthsAgo DATETIME2 = '2015-10-18'

SELECT
  MAX([A].[ticketId]) AS [ticketId]
  , MAX([A].[ticketDate]) AS [ticketDate]
  , MAX([D].[departmentName]) AS [departmentName]
  , MAX([A].[countryShort]) AS [shortcode]
  , [Q].[tel] AS [tel]
FROM [dbo].[Ticket] AS [A]

-- Joins the customerId
LEFT JOIN [dbo].[Customer] AS [F]
ON [A].[customerId] = [F].[customerId]

-- Joins the userId
LEFT JOIN [dbo].[User] AS [U]
ON [A].[userId] = [U].[userId]

-- Joins the person, which includes contact info
LEFT JOIN [dbo].[Person] AS [Q]
ON [A].[personId] = [Q].[personId]

-- Joins the departmentId
LEFT JOIN [dbo].[Department] AS [D]
ON [A].[departmentId] = [D].[departmentId]

WHERE [A].[ticketDate] < @upperDateLimit
  AND [A].[ticketDate] > @lowerDateLimit
  AND [Q].[tel] IS NOT NULL
  AND [Q].[tel] != ''
  AND NOT EXISTS(SELECT *
         FROM [dbo].[NPSSurveyResult]
         WHERE
            REPLACE([dbo].[NPSSurveyResult].[npsTel], '+', '') = [Q].[tel]
            AND (
        [dbo].[NPSSurveyResult].[npsDate] > @threeMonthsAgo
        OR [dbo].[NPSSurveyResult].[doNotContact] = 1)
      )
  AND NOT EXISTS(SELECT *
          FROM [dbo].[NpsQuarantine]
          WHERE
              REPLACE([dbo].[NpsQuarantine].[npsTel], '+', '') = [Q].[tel]
              AND (
        [dbo].[NpsQuarantine].[npsDate] > @threeMonthsAgo
        OR [dbo].[NpsQuarantine].[doNotContact] = 1)
        )

GROUP BY [Q].[tel]

ORDER BY MIN([A].[ticketDate]) DESC, MIN([A].[ticketId]) DESC

