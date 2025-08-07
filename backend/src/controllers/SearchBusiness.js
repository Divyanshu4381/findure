// Agar user radius bhejta hai frontend se → usi radius me business dhoondo.

// Agar radius nahi bhejta → to default 3km se start karke 6, 9, 12, 15 km tak dhoondo.
// Smart Search + Recursive Nearby filter (auto radius step)
// Smart Search + Radius logic (user-provided or auto-expand)


import { ApiError } from "../utils/ApiError.js";
import { BusinessDetail } from "../models/Business_details.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Smart Search + Radius Logic (regex + smart nearby filter)
export const searchBusiness = asyncHandler(async (req, res) => {
  const { lat, lng, keyword = "", radius } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, "Location (lat, lng) is required");
  }

  const searchText = keyword.trim();
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxRadius = 15; // in KM
  const step = 3;
  const isUserRadius = !!radius;
  const userRadius = parseFloat(radius);

  // Step 1: Smart keyword-based filtering using RegExp
  let initialResults = [];
  if (searchText) {
    const regex = new RegExp(searchText, "i"); // Case-insensitive match
    initialResults = await BusinessDetail.find({
      $or: [
        { businessName: regex },
        { businessCategory: regex },
        { businessType: regex },
        { businessDescription: regex },
      ],
    });
  } else {
    initialResults = await BusinessDetail.find({});
  }

  // Step 2: Radius-based filtering
  const getNearbyResults = (currentRadius) =>
    initialResults.filter((biz) => {
      if (!biz.location || !biz.location.coordinates) return false;

      const [bizLng, bizLat] = biz.location.coordinates;
      const R = 6371; // Earth radius in KM
      const dLat = ((bizLat - userLat) * Math.PI) / 180;
      const dLng = ((bizLng - userLng) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((userLat * Math.PI) / 180) *
          Math.cos((bizLat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= currentRadius;
    });

  let filteredNearby = [];
  let usedRadius = step;

  if (isUserRadius) {
    filteredNearby = getNearbyResults(userRadius);
    usedRadius = userRadius;
  } else {
    while (usedRadius <= maxRadius) {
      filteredNearby = getNearbyResults(usedRadius);
      if (filteredNearby.length > 0) break;
      usedRadius += step;
    }
  }

  res.status(200).json({
    success: true,
    usedRadius: usedRadius > maxRadius ? maxRadius : usedRadius,
    count: filteredNearby.length,
    data: filteredNearby.slice(0, 10), // Limit to 10 results
  });
});