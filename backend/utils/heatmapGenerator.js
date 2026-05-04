const Complaint = require("../models/Complaint");

const getHeatLevel = ({ totalComplaints, highPriorityCount, pendingCount }) => {
  if (highPriorityCount >= 3 || totalComplaints >= 8 || pendingCount >= 6) {
    return "Red";
  }

  if (highPriorityCount >= 1 || totalComplaints >= 4 || pendingCount >= 3) {
    return "Yellow";
  }

  return "Green";
};

const normalizeArea = (complaint) => {
  const city = complaint.location?.city || "Unknown City";
  const address = complaint.location?.address || "Unknown Area";

  const addressParts = address.split(",");
  const firstPart = addressParts[0]?.trim();

  return firstPart || city;
};

const buildHeatmapZonesFromComplaints = async () => {
  const complaints = await Complaint.find({})
    .populate("reportedBy", "name email phone")
    .sort({ createdAt: -1 });

  const zoneMap = {};

  complaints.forEach((complaint) => {
    const area = normalizeArea(complaint);
    const city = complaint.location?.city || "Unknown City";
    const zoneKey = `${area}-${city}`.toLowerCase();

    if (!zoneMap[zoneKey]) {
      zoneMap[zoneKey] = {
        zoneName: area,
        area: city,
        totalComplaints: 0,
        highPriorityCount: 0,
        mediumPriorityCount: 0,
        lowPriorityCount: 0,
        resolvedCount: 0,
        pendingCount: 0,
        centerLocation: {
          lat: complaint.location?.lat || 22.5726,
          lng: complaint.location?.lng || 88.3639,
        },
        complaints: [],
      };
    }

    zoneMap[zoneKey].totalComplaints += 1;
    zoneMap[zoneKey].complaints.push(complaint._id);

    if (complaint.urgency === "Critical" || complaint.urgency === "High") {
      zoneMap[zoneKey].highPriorityCount += 1;
    } else if (complaint.urgency === "Medium") {
      zoneMap[zoneKey].mediumPriorityCount += 1;
    } else {
      zoneMap[zoneKey].lowPriorityCount += 1;
    }

    if (
      complaint.status === "Resolved" ||
      complaint.status === "Citizen Verified" ||
      complaint.status === "Closed"
    ) {
      zoneMap[zoneKey].resolvedCount += 1;
    } else {
      zoneMap[zoneKey].pendingCount += 1;
    }
  });

  return Object.values(zoneMap).map((zone) => ({
    ...zone,
    heatLevel: getHeatLevel({
      totalComplaints: zone.totalComplaints,
      highPriorityCount: zone.highPriorityCount,
      pendingCount: zone.pendingCount,
    }),
  }));
};

const buildMapMarkersFromComplaints = async () => {
  const complaints = await Complaint.find({})
    .populate("reportedBy", "name email phone")
    .sort({ createdAt: -1 });

  return complaints
    .filter((complaint) => complaint.location?.lat && complaint.location?.lng)
    .map((complaint) => {
      let markerColor = "green";

      if (complaint.urgency === "Critical" || complaint.urgency === "High") {
        markerColor = "red";
      } else if (complaint.urgency === "Medium") {
        markerColor = "yellow";
      }

      if (
        complaint.status === "Resolved" ||
        complaint.status === "Citizen Verified" ||
        complaint.status === "Closed"
      ) {
        markerColor = "green";
      }

      return {
        id: complaint._id,
        complaintId: complaint.complaintId,
        title: complaint.title,
        category: complaint.category,
        urgency: complaint.urgency,
        aiScore: complaint.aiScore,
        status: complaint.status,
        department: complaint.department,
        location: complaint.location,
        markerColor,
        createdAt: complaint.createdAt,
      };
    });
};

module.exports = {
  buildHeatmapZonesFromComplaints,
  buildMapMarkersFromComplaints,
  getHeatLevel,
};