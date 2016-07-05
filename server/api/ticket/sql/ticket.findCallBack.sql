SELECT
    [groupingCountry] AS [groupingCountry]
  , [ticketId] AS [ticketId]
  , [ticketUserName] AS [user.name]
  , [ticketUserId] AS [user.userId]
  , [customerId] AS [customer.customerId]
  , [customerNumber] AS [customer.customerNumber]
  , [customerName] AS [customer.orgName]
  , [customerRegistrationNumber] AS [customer.orgNr]
  , [tel] AS [person.tel]
  , [callCategory1] AS [category.categoryName]
  , [callCategory2] AS [subcategory.subcategoryName]
  , [callCagetory3] AS [descriptor.descriptorName]
  , [ticketSummary] AS [summary]
  , [npsId] AS [nps.npsId]
  , [npsScore] AS [nps.npsScore]
  , [npsDate] AS [nps.npsDate]
  , [npsComment] AS [nps.npsComment]
  , [npsFollowUpComment] AS [nps.followUpComment]
  , [npsDateCreated] AS [nps.dateCreated]
  , [callBackUserId] AS [callBack.user.userId]
  , [callBackUserName] AS [callBack.user.name]
  , [callBackStatus] AS [callBack.callBackStatus]
  , [callBackAgentName] AS [callBack.agentName]
  , [callBackReasonToPromote1] AS [callBack.reasonToPromote1]
  , [callBackReasonToPromote2] AS [callBack.reasonToPromote2]
  , [callBackReasonToDetract1] AS [callBack.reasonToDetract1]
  , [callBackReasonToDetract2] AS [callBack.reasonToDetract2]
  , [callBackFollowUpAction] AS [callBack.callBackFollowUpAction]
  , [callBackComment] AS [callBack.callBackComment]
  , [callBackId] AS [callBack.callBackId]
  , [callBackIsClosed] AS [callBack.isClosed]
FROM [dbo].[vi_CallBackView]
WHERE 1=1
  AND [ticketId] IS NOT NULL
  {filter}

SELECT COUNT(*)
FROM [dbo].[vi_CallBackView]
WHERE 1=1
  AND [ticketId] IS NOT NULL
  {filter}