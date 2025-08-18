const restaurantMeta1 = {
  nType: "restaurant",
  action: "update",
  actor: "restaurant_admin_456",
  target: { model: "Firm", id: "23op9c1d1ab4567cde321" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Changed operating hours for weekends.",
};

const restaurantMeta2 = {
  nType: "restaurant",
  action: "delete",
  actor: "restaurant_admin_678",
  target: { model: "Firm", id: "9de345opq1d3c8f123" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Closed the Downtown branch permanently.",
};

const restaurantMeta3 = {
  nType: "restaurant",
  action: "feature",
  actor: "restaurant_admin_123",
  target: { model: "Firm", id: "feat1234c2d9a8d" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Highlighted weekend buffet offer.",
};

const restaurantMeta4 = {
  nType: "restaurant",
  action: "update",
  actor: "restaurant_admin_999",
  target: { model: "Firm", id: "spec2345d9c7f" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Modified 2-for-1 pizza promotion duration.",
};

const restaurantMeta5 = {
  nType: "restaurant",
  action: "add",
  actor: "restaurant_admin_789",
  target: { model: "Firm", id: "allergenInfo123" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Added allergen information for new desserts.",
};

const orderMeta1 = {
  nType: "order",
  action: "create",
  actor: "customer_101",
  target: { model: "Order", id: "order234df9c" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Customer placed a lunch order for pickup.",
};

const orderMeta2 = {
  nType: "order",
  action: "update",
  actor: "restaurant_admin_123",
  target: { model: "Order", id: "order9987abc" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Updated order status to 'Ready for pickup.'",
};

const orderMeta3 = {
  nType: "order",
  action: "cancel",
  actor: "customer_345",
  target: { model: "Order", id: "cancel123df9" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Customer canceled a dinner delivery order.",
};

const orderMeta4 = {
  nType: "order",
  action: "refund",
  actor: "restaurant_admin_678",
  target: { model: "Order", id: "refund98734" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Issued a refund due to incorrect order delivery.",
};

const orderMeta5 = {
  nType: "order",
  action: "assign",
  actor: "delivery_partner_678",
  target: { model: "Order", id: "delivery001" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Assigned delivery task to rider.",
};

const flagMeta1 = {
  nType: "flag",
  action: "report",
  actor: "customer_987",
  target: { model: "Review", id: "reviewFlag001" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Customer flagged review as offensive.",
};

const flagMeta2 = {
  nType: "flag",
  action: "mark",
  actor: "moderator_321",
  target: { model: "Order", id: "orderFlag098" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Marked order for fraud investigation.",
};

const flagMeta3 = {
  nType: "flag",
  action: "validate",
  actor: "moderator_123",
  target: { model: "MenuItem", id: "menuFlag001" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Validated flagged item for incorrect pricing.",
};

const flagMeta4 = {
  nType: "flag",
  action: "dismiss",
  actor: "moderator_678",
  target: { model: "Complaint", id: "complaint987" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Dismissed false customer complaint.",
};

const flagMeta5 = {
  nType: "flag",
  action: "investigate",
  actor: "moderator_009",
  target: { model: "Transaction", id: "transFlag009" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Investigated flagged payment transaction.",
};

const marketMeta1 = {
  nType: "marketing",
  action: "createCampaign",
  actor: "restaurant_admin_123",
  target: { model: "MarketingCampaign", id: "campaign0987" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Created campaign for New Year's offers.",
};

const marketMeta2 = {
  nType: "marketing",
  action: "launch",
  actor: "marketing_manager_456",
  target: { model: "AdCampaign", id: "adLaunch123" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Launched summer special ad campaign.",
};

const marketMeta3 = {
  nType: "marketing",
  action: "update",
  actor: "restaurant_admin_789",
  target: { model: "PromotionalOffer", id: "promoUpdate678" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Updated promotional discount to 20%.",
};

const marketMeta4 = {
  nType: "marketing",
  action: "analyze",
  actor: "marketing_analyst_009",
  target: { model: "AdPerformance", id: "analysis987" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Analyzed performance of the last email campaign.",
};

const marketMeta5 = {
  nType: "marketing",
  action: "terminate",
  actor: "marketing_manager_111",
  target: { model: "Campaign", id: "terminate432" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Terminated underperforming social media campaign.",
};

const tiffinMeta1 = {
  nType: "tiffin",
  action: "suspend",
  actor: "moderator_101",
  target: { model: "TiffinService", id: "tiffin9874" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Tiffin service temporarily suspended for quality issues.",
};

const tiffinMeta2 = {
  nType: "tiffin",
  action: "verify",
  actor: "moderator_321",
  target: { model: "TiffinService", id: "tiffin4321" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Verified registration documents for new tiffin service.",
};

const tiffinMeta3 = {
  nType: "tiffin",
  action: "removeListing",
  actor: "moderator_567",
  target: { model: "TiffinService", id: "tiffin1234" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Removed tiffin service listing due to multiple complaints.",
};

const tiffinMeta4 = {
  nType: "tiffin",
  action: "monitor",
  actor: "moderator_678",
  target: { model: "OrderActivity", id: "orderTiffin789" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Monitored sudden spike in tiffin order cancellations.",
};

const tiffinMeta5 = {
  nType: "tiffin",
  action: "update",
  actor: "moderator_111",
  target: { model: "TiffinServicePolicy", id: "policy2345" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Updated policy to ensure better packaging for deliveries.",
};

const eventMeta1 = {
  nType: "event",
  action: "approve",
  actor: "moderator_999",
  target: { model: "LiveEvent", id: "event4567" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Approved live cooking event scheduled for the weekend.",
};

const eventMeta2 = {
  nType: "event",
  action: "cancel",
  actor: "moderator_567",
  target: { model: "LiveEvent", id: "event0987" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Canceled live music event due to violation of guidelines.",
};

const eventMeta3 = {
  nType: "event",
  action: "flag",
  actor: "moderator_345",
  target: { model: "LiveEvent", id: "event9988" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Flagged an unauthorized event with explicit content.",
};

const eventMeta4 = {
  nType: "event",
  action: "monitor",
  actor: "moderator_123",
  target: { model: "LiveEventAudience", id: "audience1234" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Monitored user engagement during a live baking event.",
};

const eventMeta5 = {
  nType: "event",
  action: "addNotice",
  actor: "moderator_987",
  target: { model: "LiveEvent", id: "eventNotice345" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Added notice about delay in live event streaming.",
};

const commentsMeta1 = {
  nType: "comment",
  action: "delete",
  actor: "moderator_888",
  target: { model: "Comment", id: "comment456" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Deleted offensive comment on a restaurant listing.",
};

const commentsMeta2 = {
  nType: "comment",
  action: "approve",
  actor: "moderator_999",
  target: { model: "Comment", id: "comment789" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Approved positive feedback comment from a customer.",
};

const commentsMeta3 = {
  nType: "comment",
  action: "flag",
  actor: "moderator_555",
  target: { model: "Comment", id: "comment333" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Flagged a comment for spreading misinformation.",
};

const commentsMeta4 = {
  nType: "comment",
  action: "monitor",
  actor: "moderator_123",
  target: { model: "CommentThread", id: "thread987" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Monitored a heated discussion on a food delivery delay.",
};

const commentsMeta5 = {
  nType: "comment",
  action: "respond",
  actor: "moderator_666",
  target: { model: "Comment", id: "comment999" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Responded to a customer query on delivery issues.",
};
// -----------------------------------
const chatsMeta1 = {
  nType: "chat",
  action: "monitor",
  actor: "moderator_444",
  target: { model: "ChatSession", id: "chat123" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Monitored chat session between customer and support.",
};

const chatsMeta2 = {
  nType: "chat",
  action: "flag",
  actor: "moderator_333",
  target: { model: "ChatMessage", id: "message456" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Flagged abusive message from a customer in chat.",
};

const chatsMeta3 = {
  nType: "chat",
  action: "terminate",
  actor: "moderator_987",
  target: { model: "ChatSession", id: "chat789" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Terminated chat session due to spam.",
};

const chatsMeta4 = {
  nType: "chat",
  action: "review",
  actor: "moderator_999",
  target: { model: "ChatHistory", id: "history987" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Reviewed chat history for dispute resolution.",
};

const chatsMeta5 = {
  nType: "chat",
  action: "restore",
  actor: "moderator_123",
  target: { model: "ChatSession", id: "chatRestore345" },
  restaurantId: "5fd1d2b3e3c19f4567c3ab21",
  remarks: "Restored deleted chat session for investigation.",
};

module.exports = {
  restaurantMeta1,
  restaurantMeta2,
  restaurantMeta3,
  restaurantMeta4,
  restaurantMeta5,
  orderMeta1,
  orderMeta2,
  orderMeta3,
  orderMeta4,
  orderMeta5,
  flagMeta1,
  flagMeta2,
  flagMeta3,
  flagMeta4,
  flagMeta5,
  marketMeta1,
  marketMeta2,
  marketMeta3,
  marketMeta4,
  marketMeta5,
  tiffinMeta1,
  tiffinMeta2,
  tiffinMeta3,
  tiffinMeta4,
  tiffinMeta5,
  eventMeta1,
  eventMeta2,
  eventMeta3,
  eventMeta4,
  eventMeta5,
  commentsMeta1,
  commentsMeta2,
  commentsMeta3,
  commentsMeta4,
  commentsMeta5,
  chatsMeta1,
  chatsMeta2,
  chatsMeta3,
  chatsMeta4,
  chatsMeta5,
};
