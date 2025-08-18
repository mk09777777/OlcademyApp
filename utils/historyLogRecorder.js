const HistoryLog = require("../models/historyLog");
const requestIp = require("request-ip");

const historyLogRecorder = async (
  req,
  entity,
  action,
  entityId,
  description = "New log recorded"
) => {
  try {
    if (!Array.isArray(entityId)) {
      entityId = [entityId];
    }
      
    const logQuery = { entity, action, entityId, description };

    logQuery.performedBy = req.session.user.id || null;
    logQuery.userRole = req.session.user?.role;
    logQuery.responseTime = req.responseTime || "N/A";
    logQuery.route = req.originalUrl;
    logQuery.method = req.method;
    logQuery.ipAddress = requestIp.getClientIp(req);
    logQuery.originalUrl = req.path;

    const historyLog = await HistoryLog.create(logQuery);
    console.log(historyLog);
    if (!historyLog) {
      console.log("Inside throw statement");
      throw new Error("History log could not be created");
    }
  } catch (err) {
    console.log("History log Error", err);
  }
};

module.exports = historyLogRecorder;
