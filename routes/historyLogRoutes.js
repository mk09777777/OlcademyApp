const { Router } = require("express");
const router = Router();
const {
  getAllHistoryLog,
  getEntity,
  getLogsByUserRole,
  getLogsWithInDateRange,
  getLogsByActions,
  getLogsByEntityAndAction,
  getLogsByResponseTime,
  getArchievedLogs,
  searchByName,
} = require("../controller/historyLogController");
const authMiddleware = require("../middleware/auth");

//to create log we have the function inside utils folder named as historyLogRecorder

// GET route for retrieving all history logs
router.get("/", getAllHistoryLog);

// GET route for retrieving logs by entity
router.get("/entity", getEntity);

// GET route for retrieving logs by user role
router.get("/user-role", getLogsByUserRole);

// GET route for retrieving logs within a date range
router.get("/date-range", getLogsWithInDateRange);

// GET route for retrieving logs by action
router.get("/action", getLogsByActions);

// GET route for retrieving logs by entity and action
router.get("/entity-action", getLogsByEntityAndAction);

// GET route for retrieving logs sorted by response time
router.get("/response-time", getLogsByResponseTime);

// GET route for retrieving archived logs
router.get("/archived", getArchievedLogs);

// GET route for searching logs by user name
router.get("/search", searchByName);

module.exports = router;
