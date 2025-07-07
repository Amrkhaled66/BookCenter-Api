import cron from "node-cron";
import releaseReservedStock from "../services/releaseReservedStock.js";

let isJobRunning = false; // Lock flag to prevent overlap

// Run the cron job every minute
cron.schedule("*/3 * * * *", async () => {
  if (isJobRunning) {
    console.log("🔒 Cron job is already running. Skipping this cycle.");
    return;
  }

  isJobRunning = true; // Set the lock flag

  try {
    console.log("⏰ Cron job running:", new Date().toLocaleString());
    await releaseReservedStock(); // Call the function to release stock
  } catch (error) {
    console.error("❌ Error in releaseReservedStock:", error);
  } finally {
    isJobRunning = false; // Release the lock flag
  }
});
