/*
Finds tickets which has been sent NPS SMS.
*/

-- Declare in JavaScript
-- DECLARE @offset int = 0
-- DECLARE @top int = 20

SELECT
    [A].[ticketId]
  , [Q].[personId] AS [person.personId]
  , [Q].[name] AS [person.name]
  , [Q].[email] AS [person.email]
  , [Q].[tel] AS [person.tel]
  , [Q].[altTel] AS [person.altTel]
  , [A].[isReseller]
  , [A].[summary]
  , [A].[transferred]
  , [A].[status]
  , [A].[countryShort] AS [country.short]
  , [A].[countryFull] AS [country.full]
  , CASE
      WHEN [NPS].[npsTel] LIKE '+45%' THEN 'DK'
      WHEN [NPS].[npsTel] LIKE '+47%' THEN 'NO'
      WHEN [NPS].[npsTel] LIKE '+358%' THEN 'FI'
      ELSE 'SE'
    END AS [groupingCountry]
  , [A].[customerId] AS [customer.customerId]
  , [F].[customerNumber] AS [customer.customerNumber]
  , [F].[orgName] AS [customer.orgName]
  , [F].[orgNr] AS [customer.orgNr]
  , [A].[userId] AS [user.userId]
  , [U].[email] AS [user.email]
  , [U].[name] AS [user.name]
  , [A].[ticketDate]
  , [A].[ticketDateClosed]
  , [A].[dateUpdated]
  , [B].[categoryId] AS [category.categoryId]
  , [C].[categoryName] AS [category.categoryName]
  , [B].[subcategoryId] AS [subcategory.subcategoryId]
  , [D].[categoryId] AS [subcategory.categoryId]
  , [D].[subcategoryName] AS [subcategory.subcategoryName]
  , [B].[descriptorId] AS [descriptor.descriptorId]
  , [E].[descriptorName] AS [descriptor.descriptorName]
  , [E].[subcategoryId] AS [descriptor.subcategoryId]
  , [G].[departmentId] AS [department.departmentId]
  , [G].[departmentName] AS [department.departmentName]
  , [H].[departmentId] AS [transferredDepartment.departmentId]
  , [H].[departmentName] AS [transferredDepartment.departmentName]
  , [A].[productId] AS [product.productId]
  , [P].[productName] AS [product.productName]
  , [P].[country] AS [product.country]
  , [NPS].[npsId] AS [nps.npsId]
  , [NPS].[npsTel] AS [nps.npsTel]
  , [NPS].[npsScore] AS [nps.npsScore]
  , [NPS].[npsComment] AS [nps.npsComment]
  , [NPS].[npsDate] AS [nps.npsDate]
  , [NPS].[npsFollowUp] AS [nps.npsFollowUp]
  , [NPS].[doNotContact] AS [nps.doNotContact]
  , [CB].[callBackId] AS [callBack.callBackId]
  , [CB].[callBackDate] AS [callBack.callBackDate]
  , [CB].[callBackStatus] AS [callBack.callBackStatus]
  , [CB].[agentName] AS [callBack.agentName]
  , [CB].[reasonToPromote1] AS [callBack.reasonToPromote1]
  , [CB].[reasonToPromote2] AS [callBack.reasonToPromote2]
  , [CB].[reasonToDetract1] AS [callBack.reasonToDetract1]
  , [CB].[reasonToDetract2] AS [callBack.reasonToDetract2]
  , [CB].[callBackFollowUpAction] AS [callBack.callBackFollowUpAction]
  , [CB].[callBackComment] AS [callBack.callBackComment]
  , [CB].[isClosed] AS [callBack.isClosed]
  , [CB].[dateClosed] AS [callBack.dateClosed]
  , [CB].[ticketId] AS [callBack.ticketId]
  , [U2].[email] AS [callBack.user.userId]
  , [U2].[email] AS [callBack.user.email]
  , [U2].[name] AS [callBack.user.name]
FROM [dbo].[Ticket] AS [A]

-- Joins the categoryBlob, which is only used for joining the different levels of categories
LEFT JOIN [dbo].[CategoryBlob] AS [B]
ON [A].[ticketId] = [B].[ticketId]

-- Joins the category
LEFT JOIN [dbo].[Category] AS [C]
ON [B].[categoryId] = [C].[categoryId]

-- Joins the subcategory
LEFT JOIN [dbo].[Subcategory] AS [D]
ON [B].[subcategoryId] = [D].[subcategoryId]

-- Joins the descriptors
LEFT JOIN [dbo].[Descriptor] AS [E]
ON [B].[descriptorId] = [E].[descriptorId]

-- Joins the customerId
LEFT JOIN [dbo].[Customer] AS [F]
ON [A].[customerId] = [F].[customerId]

-- Joins the userId
LEFT JOIN [dbo].[User] AS [U]
ON [A].[userId] = [U].[userId]

-- Joins the departmentId
LEFT JOIN [dbo].[Department] AS [G]
ON [A].[departmentId] = [G].[departmentId]

-- Joins the departmentId
LEFT JOIN [dbo].[Department] AS [H]
ON [A].[transferredDepartmentId] = [H].[departmentId]

-- Joins the productId
LEFT JOIN [dbo].[Product] AS [P]
ON [A].[productId] = [P].[productId]

-- Joins the person, which includes contact info
LEFT JOIN [dbo].[Person] AS [Q]
ON [A].[personId] = [Q].[personId]

LEFT JOIN [dbo].[CallBack] AS [CB]
ON [A].[ticketId] = [CB].[ticketId]

LEFT JOIN [dbo].[User] AS [U2]
ON [CB].[userId] = [U2].[userId]

-- Inner join on NPSSurveyResult, which only gets those where there's an npsScore
INNER JOIN [dbo].[NPSSurveyResult] AS [NPS]
ON [A].[ticketId] = [NPS].[ticketId]
  WHERE [npsScore] IS NOT NULL

ORDER BY [A].[ticketDate] DESC, [A].[ticketId] DESC
OFFSET @offset ROWS FETCH NEXT @top ROWS ONLY

SELECT COUNT(*)
FROM [dbo].[Ticket] AS [A]
INNER JOIN [dbo].[NPSSurveyResult] AS [NPS]
ON [A].[ticketId] = [NPS].[ticketId]

LEFT JOIN [dbo].[CallBack] AS [CB]
ON [A].[ticketId] = [CB].[ticketId]
  WHERE [npsScore] IS NOT NULL