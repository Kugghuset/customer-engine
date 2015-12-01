/*
Finds a ticket by its ticketId and joins it.
*/

SELECT
  [A].[ticketId],
  [A].[name],
  [A].[email],
  [A].[tel],
  [A].[altTel],
  [A].[summary],
  [A].[transferred],
  [A].[successful],
  [A].[status],
  [A].[country] AS [country.short],
  [A].[customerId] AS [customer.customerId],
  [F].[customerNumber] AS [customer.customerNumber],
  [F].[orgName] AS [customer.orgName],
  [F].[orgNr] AS [customer.orgNr],
  [A].[userId] AS [user.userId],
  [U].[email] AS [user.email],
  [U].[name] AS [user.name],
  [A].[ticketDate],
  [B].[categoryId] AS [category.categoryId],
  [C].[categoryName] AS [category.categoryName],
  [B].[subcategoryId] AS [subcategory.subcategoryId],
  [D].[subcategoryName] AS [subcategory.subcategoryName],
  [B].[descriptorId] AS [descriptor.descriptorId],
  [E].[descriptorName] AS [descriptor.descriptorName],
  [A].[departmentId] AS [department.departmentId],
  [G].[departmentName] AS [department.departmentName],
  [A].[isSubmitted]
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

-- Gets only the matching ticket
WHERE [A].[ticketId]=@ticketId