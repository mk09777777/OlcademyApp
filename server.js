require("dotenv").config(); // Load environment variables at the top
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const { otpRoutes } = require("./routes/otp");
const cacheControl = require("./middleware/cache_control");
// Import OAuth Configurations
const configureAuth = require("../Backend/config/auth.config");
const morgan = require("morgan");
const { calResponseTime } = require("./middleware");

const MenuRoutes = require("./routes/MenuRouter");
const LogNotification = require("./logger/notification/dataLogConfig");
const testRoutes = require("./routes/TryEndPoint");
const Notify = require("./models/logs/notify");
const Firm = require("./models/Firm");
const notifyRoutes = require("./routes/notify");
const userRoutes = require("./routes/userRoutes");
const historyLoggerRoute = require("./routes/historyLogRoutes");

const userRoutesAdmin = require("./routes/AdminDashboard/UserLogin");
const mailRoutes = require("./routes/AdminDashboard/MailRouter");
// const faqRoutes = require("./routes/AdminDashboard/FaqRoutes");
const settingsRoutes = require("./routes/AdminDashboard/SettingRoute");
const PolicyRoutes = require("./routes/AdminDashboard/PolicyRoutes");
const AckRoutes = require("./routes/AdminDashboard/AckRoutes");
const AgreementRoutes = require("./routes/AdminDashboard/Agreement");
const TwoFARoutes = require("./routes/AdminDashboard/TwoFARoute");
const ProfleRoutes = require("./routes/AdminDashboard/ProfileRoutes");
const cron = require("node-cron");
const { registerLogWithReponseTime } = require("./utils/index");
// const responseTime = require("response-time");

// Faq
const faqRoutesAdmin = require("./routes/AdminDashboard/FaqRoutes");
const faqRoutes = require("./routes/faqRoutes");

const connectToMongoDB = require("./config/database.config.js");
const OrderRoutes = require("./routes/OrderRoutes/Order");
const ManageStatusRoutes = require("./routes/OrderRoutes/ManageOrdersStatus");
const AnalyticsRoutes = require("./routes/AnalyticRoutes");
//ForTiffins
const TaxesAndChargesRoutes = require("./routes/Taxes&ChargesFotTiffinsRoutes");
//not for tiffins
const TaxAndChargesRoutes = require("./routes/taxAndChargesRoutes.js");
const Offers = require("./routes/Offer");
const documentRoutes = require("./routes/restaurantDocumentRoutes.js");
const termsRoutes = require("./routes/termsRoutes.js");

// const app = express();
const bodyParser = require("body-parser");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productsRoutes");
const claimRoutes = require("./routes/claimRoutes");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const routeConfig = require("./config/route.config");
const reviewRouter = require("./controller/reviewController.js");
const addressRoutes = require("./routes/addressRoutes");
const restaurantRoutes = require("./routes/claimRestaurantRoutes");
const restaurantClaimOwnersideRoutes = require("./routes/restaurantClaimOwersideRoutes");
const imageUploadTestRoutes = require("./config/cloud.config.sample.js");
const fs = require("fs");
const { insertData } = require("./utils/index.js");
const adminActionRoute = require("./routes/adminActionCenterRoutes.js");

const userStatsRoute = require("./routes/AdminDashboard/UserStats");
const orderSummary = require("./routes/AdminDashboard/OrderSummary.js");

const { default: mongoose } = require("mongoose");
//from .env file
const PORT = process.env.PORT || 4040;
const SESSION_SECRET = process.env.SESSION_SECRET || "supersecretkey";

// Restaurant Dashboard Routes
const categoryRoutes = require("./routes/RestaurantDasRoutes/CategoryRoutes");
const itemRoutes = require("./routes/RestaurantDasRoutes/ItemRoutes");
const comboRoutes = require("./routes/RestaurantDasRoutes/comboRoutes");
const offerRoutes = require("./routes/RestaurantDasRoutes/offers");
const operatingHoursOfferRoutes = require("./routes/RestaurantDasRoutes/operatingHoursOffers");
const bookingRoutes = require("./routes/RestaurantDasRoutes/bookings");
const TaxesRoutes = require("./routes/RestaurantDasRoutes/TaxesRoutes.js");
const ChargesRoutes = require("./routes/RestaurantDasRoutes/ChargesRoutes");

const adminDineinRoutes = require("./routes/AdminDashboard/Dinein");
app.use("/api/admin", adminDineinRoutes);
const Revenue=require("./routes/AdminDashboard/Revenue.js");
const {
  isAuthenticated,
} = require("./config/authHandlers.js");
// marketing dashboard
const bannerRoutes = require("./routes/marketing-dashboard/banners.js");
const collectionRoutes = require("./routes/marketing-dashboard/collections");
const templateRoutes = require("./routes/marketing-dashboard/emailTemplateRoutes");
const offerRoutesMarketing = require("./routes/marketing-dashboard/restuarantOffers.js");

const OfferMarketing = require("./models/marketing-dashboard/Offers");
const Banner = require("./models/marketing-dashboard/Banner");
const Collection = require("./models/marketing-dashboard/Collection");
const historyLogRecorder = require("./utils/historyLogRecorder");
const createApp = require("./Search/searchRoute.js");
const MenuRote = require("./routes/MenuRoute");

const adminRoutes = require("./routes/AdminDashboard/AdminRoute");
const userRole = require("./routes/AdminDashboard/UserRole.js");



const CartRoute = require("./routes/CartRoutes");
const orderCustomer = require("./controller/TakeAway/OrderControllers");
const {
  rebuildKDTree,
} = require("./controller/firm/getuserbaseRest_advfilter_similar.js");
const HistoryRouter = require("./routes/RestaurantDasRoutes/OrderHistory.js");
const {
  diningOrdersCron,
  takeawayOrdersCron,
} = require("./controller/RestaurantDasController/OrderHistoryControllers");
const AdminRouterLogin = require("./routes/RoleBasedRoutes");
const outletAdditionalSettings = require("./routes/RestaurantDasRoutes/AdditionalSettingsController.js");
const restaurantDashboardClaimRestaurants = require("./routes/RestaurantDasRoutes/cliamRestaurantsdashboardRoutes.js");

//search route
// const { default: mongoose } = require("mongoose");
//from .env file

// const Auth = require("./routes/auth");
// const otpRoutes = require("./routes/otp");
const connectDB = require("./config/database.config");
console.log(PORT);
connectToMongoDB();
rebuildKDTree();
connectDB();
const userNotify = require("./routes/userNotificationRoutes");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Olcademy API",
      version: "1.0.0",
      description: "API documentation for Olcademy project-z",
    },
    tags: [
      { name: "Products", description: "APIs related to products" },
      { name: "Firms", description: "APIs related to firms" },
      { name: "Vendors", description: "APIs related to vendors" },
      { name: "Claim Restaurant", description: "APIs related to Claims" },
    ],
    servers: [{ url: "https://olcademybackend-eob7.onrender.com" }],
  },
  apis: ["./routes/*.js"],
};

const allowedOrigins = [
  `${process.env.FRONTEND_URL}`,
  "https://project-z-6go8.onrender.com",
];

// const allowedOrigins = [`${process.env.FRONTEND_URL}`, "http://localhost:5173"];
const server = http.createServer(app); // Use HTTP server to attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinEntityRoom", (entityId) => {
    socket.join(entityId);
    console.log(`Socket ${socket.id} joined room for entity: ${entityId}`);
  });
  socket.on("joinUserNotification", (entityId) => {
    socket.join(entityId);
    console.log("join the notification", entityId);
  });
  socket.emit("testEvent", { message: "Hello from the server!" });
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use(express.json());
app.set("socketio", io);
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
      "token",
      "Origin", // Include standard headers
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);

// const server = http.createServer(app); // Use HTTP server to attach Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST", "DELETE", "PUT"],
//   },
// });

io.on("connection", (socket) => {
  socket.emit("testEvent", { message: "Hello from the server!" });
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
const TiffinAnalysis = require("./routes/TiffinDashboard/AnalysisOrder");
app.use(express.json());
mongoose.set("debug", true);

app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Security headers
app.use(express.urlencoded({ extended: true }));
// Apply cache control to all routes
app.use(cacheControl);
app.use(morgan("dev"));
app.use(calResponseTime); //to calculate response time

// **Session Middleware**
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset cookie maxAge on every request
    store: MongoStore.create({
      mongoUrl: `${process.env.MONGO_ATLAS_URI}`,
      // mongoUrl: `${process.env.MONGO_LOCAL_URL}`,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: "native",
    }),
    cookie: {
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Set to true in production
      httpOnly: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  })
);

// **Initialize Passport**
app.use(passport.initialize());
app.use(passport.session());
configureAuth(passport); // Load authentication strategies
// **Routes**
app.use("/api", auth);
app.use("/api", otpRoutes);
const OTP = require("./routes/UserVerifyOtp/otp");
app.use("/api", OTP);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// bulk upload to the database
app.get("/feed-db", async (req, res) => {
  const readAndFeed = function () {
    fs.readFile("../../data/final.json", "utf8", async (err, data) => {
      if (err) throw err;
      const jsonData = JSON.parse(data);
      // console.log(jsonData.length);
      await insertData(jsonData);
    });
  };
  readAndFeed();
  res.send("Data Refreshed");
});

// ***** MOUNT ADMIN FAQ ROUTES EARLY *****
app.use("/api/admin/faq", faqRoutesAdmin);
// Mount the general FAQ routes (handled by faqController)
app.use("/api/faq", faqRoutes); // <<< Mount general routes here
// **************************************

// app.get("/get-session", (req, res) => {
//   console.log(req.session.user);
//   res.redirect("http://localhost:5173");
// });
app.get("/get-session", (req, res) => {
  console.log(req.session.user);
  res.redirect("https://project-z-6go8.onrender.com");
});

// for sample data for testing the cloud image insertion and deletion
// app.use("/image", imageUploadTestRoutes);

// app.get("/append-data", async (req, res) => {
//   const data = await Firm.find({});
// });

// API Routesuser
app.use("/api", MenuRoutes);
app.use("/api", OrderRoutes);
app.use("/api", AnalyticsRoutes);
app.use("/api/user", userNotify);
//history for orders
diningOrdersCron();
takeawayOrdersCron();
//for tiffins
app.use("/api", TaxesAndChargesRoutes);
//not for tiffins
app.use("/api", TaxAndChargesRoutes);
app.use("/api", Offers);
app.use("/api/tiffin", TiffinAnalysis);
app.use("/api", ManageStatusRoutes(io));
app.use("/api", CartRoute);
app.use("/api", orderCustomer);
app.use("/claim", claimRoutes);
app.use("/cliam-rest", restaurantDashboardClaimRestaurants);
app.use("/firm", firmRoutes);
app.use("/products", productRoutes);
app.use("/api/restaurant-claims", restaurantClaimOwnersideRoutes);
app.use("/api", outletAdditionalSettings);
app.use("/api", restaurantRoutes);
app.use("/", addressRoutes);
app.use("/api", HistoryRouter);

app.use("/api", adminActionRoute);
app.use("/user", userRoutes);
app.use("/notify", notifyRoutes);

app.use("/user", userRoutesAdmin);
app.use("/email", mailRoutes);
app.use("/api/dashboard", AdminRouterLogin);
app.use("/api/admin/faq", faqRoutes);
app.use("/settings", settingsRoutes);
app.use("/policy", PolicyRoutes);
app.use("/ack", AckRoutes);
app.use("/agree", AgreementRoutes);
app.use("/2fa", TwoFARoutes);
app.use("/profile", ProfleRoutes);
app.use("/api", reviewRouter);
app.use("/logs", historyLoggerRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", userStatsRoute); // Mount user stats route
app.use("/api/admin", orderSummary);
app.use("/api/admin", userRole); // Mount order summary route

app.use("/api/revenue", Revenue);

// const adminDashboardRouter = require("./routes/AdminDashboard/TopfiveRestuants.js");
// app.use("/api/admin", adminDashboardRouter);

// app.use("/add-vendor", vendorRoutes);
// app.use("/test", testRoutes);
// app.use("/product", product); This route is in use

// Restaurant Dashboard Routes setup

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/documents",
  express.static(path.join(__dirname, "uploads/documents"))
);

app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/operating-hours", operatingHoursOfferRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/UserBookings",isAuthenticated,bookingRoutes)
app.use("/api/taxes", TaxesRoutes);
app.use("/api/charges", ChargesRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/terms", termsRoutes);

//-------->Search---------->
app.use("/", createApp);

// -----------> marketing dashboard <------------
app.use("/banners", bannerRoutes);
// Change this line
app.use("/collections", collectionRoutes);
// To this
app.use("/api/marketing-dashboard/collections", collectionRoutes);
app.use("/templates", templateRoutes);
app.use("/offers", offerRoutesMarketing);

// Default route
// app.use("/", (req, res) => {
//   res.send("<h1>This is Olcademy project</h1>");
// });

// const historyLoggingMiddleware = (req, res, next) => {
//   // This could be more sophisticated, e.g., using res.on('finish')
//   // to guarantee it runs after the response is sent.

//   const logInfo = res.locals.logData;

//   if (logInfo) {
//     try {
//       if (logInfo.success && logInfo.document) {
//         historyLogRecorder(
//           req,
//           logInfo.entity,
//           logInfo.action,
//           [logInfo.document._id], // Extract ID
//           logInfo.message || "Log recorded successfully"
//         );
//       } else if (!logInfo.success && logInfo.message) {
//         // Log failed attempts / specific messages
//         historyLogRecorder(
//           req,
//           logInfo.entity,
//           logInfo.action,
//           logInfo.entityId,
//           logInfo.message
//         );
//       } else if (logInfo.error) {
//         // Log errors caught by handlers
//         historyLogRecorder(
//           req,
//           logInfo.entity || "Unknown", // Attempt to get entity
//           logInfo.action || req.method, // Attempt to get action
//           logInfo.entityId || (req.params?.id ? [req.params.id] : []), // Attempt to get ID
//           `Error during ${logInfo.action || req.method} on ${
//             logInfo.entity || "entity"
//           }: ${logInfo.error.message}`
//         );
//       }
//       // Add more conditions as needed based on what logData contains
//     } catch (logError) {
//       console.error("CRITICAL: History logging failed!", logError);
//     }
//   }
//   // Ensure next() is called if this middleware isn't the absolute last thing
//   if (typeof next === "function") {
//     next();
//   }
// };

// app.use(historyLoggingMiddleware);
//clear recentlyviewed restaurants by user
require("./utils/recentlyviewedrestcleaner.js");

// Function to update offer statuses
const updateOfferStatuses = async () => {
  try {
    const now = new Date();
    await OfferMarketing.updateMany(
      { startDate: { $gt: now } },
      { $set: { status: "Upcoming" } }
    );
    await OfferMarketing.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "Active" } }
    );
    await OfferMarketing.updateMany(
      { endDate: { $lt: now } },
      { $set: { status: "Expired" } }
    );
  } catch (error) {
    console.error("Error updating Offer statuses:", error.message);
  }
};

// Function to update banner statuses
const updateBannerStatuses = async () => {
  try {
    const now = new Date();

    await Banner.updateMany(
      { startDate: { $gt: now } },
      { $set: { status: "Upcoming" } }
    );
    await Banner.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "Active" } }
    );
    await Banner.updateMany(
      { endDate: { $lt: now } },
      { $set: { status: "Inactive" } }
    );
  } catch (error) {
    console.error("Error updating banner statuses:", error.message);
  }
};

// Function to update collection statuses
const updateCollectionStatuses = async () => {
  try {
    const now = new Date();

    await Collection.updateMany(
      { startDate: { $gt: now } },
      { $set: { status: "Upcoming" } }
    );
    await Collection.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "Active" } }
    );
    await Collection.updateMany(
      { endDate: { $lt: now } },
      { $set: { status: "Inactive" } }
    );
  } catch (error) {
    console.error("Error updating Collection statuses:", error.message);
  }
};

// Run both status updates together every minute
cron.schedule("* * * * *", async () => {
  await updateOfferStatuses();
  await updateBannerStatuses();
  await updateCollectionStatuses();
});

// Function to archive logs older than 3 months
const archiveOldLogs = async () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const result = await HistoryLog.updateMany(
      {
        timestamp: { $lt: threeMonthsAgo },
        archived: false, // Only update if not already archived
      },
      { $set: { archived: true } }
    );

    console.log(`Archived ${result.modifiedCount} old logs.`);
  } catch (err) {
    console.error("Error archiving logs:", err);
  }
};

//get archieved at the 2am in morning of the mentioned months
//On1st of the month
cron.schedule("0 2 1 January,April,July,Octobar *", () => {
  console.log("excuted on evry three months");
  archiveOldLogs;
});

// Start the server

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
