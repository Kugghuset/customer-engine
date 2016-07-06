/*
Sets up a view for 
*/

CREATE VIEW [vi_CallBackView] AS
SELECT
    CASE
      WHEN [NPS].[npsTel] LIKE '+45%' THEN 'DK'
      WHEN [NPS].[npsTel] LIKE '+47%' THEN 'NO'
      WHEN [NPS].[npsTel] LIKE '+358%' THEN 'FI'
      ELSE 'SE'
    END AS [groupingCountry]
  , [T].[ticketId] AS [ticketId]
  , [Ut].[name] AS [ticketUserName]
  , [Ut].[userId] AS [ticketUserId]
  , [C].[customerId] AS [customerId]
  , [C].[customerNumber] AS [customerNumber]
  , [C].[orgName] AS [customerName]
  , [C].[orgNr] AS [customerRegistrationNumber]
  , SUBSTRING([NPS].[npsTel], 2, LEN([NPS].[npsTel]) - 1) AS [tel]
  , [Ca].[categoryName] AS [callCategory1]
  , [SCa].[subcategoryName] AS [callCategory2]
  , [DCa].[descriptorName] AS [callCagetory3]
  , [T].[summary] AS [ticketSummary]
  , [NPS].[npsId] AS [npsId]
  , [NPS].[npsDate] AS [npsDate]
  , [NPS].[npsScore] AS [npsScore]
  , [NPS].[npsComment] AS [npsComment]
  , [NPS].[npsFollowUp] AS [npsFollowUpComment]
  , [NPS].[dateCreated] AS [npsDateCreated]
  , [Ua].[userId] AS [callBackUserId]
  , [Ua].[name] AS [callBackUserName]
  , [CB].[callBackStatus] AS [callBackStatus]
  , [CB].[postCallBackNpscScore] AS [callBackPostCallBackNpscScore]
  , [CB].[agentName] AS [callBackAgentName]
  , [CB].[reasonToPromote1] AS [callBackReasonToPromote1]
  , [CB].[reasonToPromote2] AS [callBackReasonToPromote2]
  , [CB].[reasonToDetract1] AS [callBackReasonToDetract1]
  , [CB].[reasonToDetract2] AS [callBackReasonToDetract2]
  , [CB].[callBackFollowUpAction] AS [callBackFollowUpAction]
  , [CB].[callBackComment] AS [callBackComment]
  , [CB].[callBackId] AS [callBackId]
  , [CB].[isClosed] AS [callBackIsClosed]
FROM [dbo].[NPSSurveyResult] AS [NPS]

LEFT JOIN [dbo].[Ticket] AS [T]
ON [T].[ticketId] = [NPS].[ticketId]

LEFT JOIN [CallBack] AS [CB]
ON [CB].[npsId] = [NPS].[npsId]

LEFT JOIN [dbo].[Person] AS [P]
ON [P].[personId] = [T].[personId]

LEFT JOIN [dbo].[Customer] AS [C]
ON [T].[customerId] = [C].[customerId]

-- User on ticket
LEFT JOIN [dbo].[User] AS [Ut]
ON [T].[userId] = [Ut].[userId]

-- Assigned user
LEFT JOIN [dbo].[User] as [Ua]
ON [Ua].[userId] = [CB].[userId]

LEFT JOIN [dbo].[CategoryBlob] AS [CaB]
ON [CaB].[ticketId] = [T].[ticketId]

LEFT JOIN [dbo].[Category] AS [Ca]
ON [Ca].[categoryId] = [CaB].[categoryId]

LEFT JOIN [dbo].[Subcategory] AS [SCa]
ON [SCa].[subcategoryId] = [CaB].[subcategoryId]

LEFT JOIN [dbo].[Descriptor] AS [DCa]
ON [DCa].[descriptorId] = [CaB].[descriptorId]

LEFT JOIN [dbo].[Department] AS [D]
ON [D].[departmentId] = [T].[departmentId]

LEFT JOIN [dbo].[Department] AS [tD]
ON [tD].[departmentId] = [T].[transferredDepartmentId]

LEFT JOIN [dbo].[Product] AS [Pr]
ON [Pr].[productId] = [T].[productId]

WHERE [npsScore] IS NOT NULL
