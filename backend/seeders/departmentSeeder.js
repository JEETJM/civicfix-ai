const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Department = require("../models/Department");
const RoutingRule = require("../models/RoutingRule");
const { DEPARTMENT_TYPES } = require("../constants/departmentTypes");
const { COMPLAINT_CATEGORIES } = require("../constants/complaintCategories");

const departments = [
  {
    name: DEPARTMENT_TYPES.ROAD_MAINTENANCE,
    category: COMPLAINT_CATEGORIES.ROAD,
    description: "Handles broken roads, potholes, footpath damage, and road cracks.",
    officerName: "Road Officer",
    seniorOfficerName: "Senior Road Officer",
    email: "road@civicfix.ai",
    phone: "9000000001",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.SANITATION,
    category: COMPLAINT_CATEGORIES.SANITATION,
    description: "Handles garbage dumping, waste overflow, dirty public area, and dustbins.",
    officerName: "Sanitation Officer",
    seniorOfficerName: "Senior Sanitation Officer",
    email: "sanitation@civicfix.ai",
    phone: "9000000002",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.DRAINAGE,
    category: COMPLAINT_CATEGORIES.DRAINAGE,
    description: "Handles blocked drains, sewage overflow, and drainage issues.",
    officerName: "Drainage Officer",
    seniorOfficerName: "Senior Drainage Officer",
    email: "drainage@civicfix.ai",
    phone: "9000000003",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.STREETLIGHT_ELECTRICITY,
    category: COMPLAINT_CATEGORIES.ELECTRICITY,
    description: "Handles streetlight failure, electric poles, open wires, and electrical hazards.",
    officerName: "Electricity Officer",
    seniorOfficerName: "Senior Electricity Officer",
    email: "electricity@civicfix.ai",
    phone: "9000000004",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.WATER_SUPPLY,
    category: COMPLAINT_CATEGORIES.WATER,
    description: "Handles water leakage, pipe burst, no water supply, and contaminated water.",
    officerName: "Water Supply Officer",
    seniorOfficerName: "Senior Water Officer",
    email: "water@civicfix.ai",
    phone: "9000000005",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.PUBLIC_SAFETY,
    category: COMPLAINT_CATEGORIES.SAFETY,
    description: "Handles unsafe public places, open manholes, broken railings, and accident risks.",
    officerName: "Public Safety Officer",
    seniorOfficerName: "Senior Safety Officer",
    email: "safety@civicfix.ai",
    phone: "9000000006",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.PARKS_ENVIRONMENT,
    category: COMPLAINT_CATEGORIES.ENVIRONMENT,
    description: "Handles parks, fallen trees, pollution, and environmental issues.",
    officerName: "Environment Officer",
    seniorOfficerName: "Senior Environment Officer",
    email: "environment@civicfix.ai",
    phone: "9000000007",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.TRAFFIC,
    category: COMPLAINT_CATEGORIES.TRAFFIC,
    description: "Handles traffic signal problems, road blockage, illegal parking, and congestion.",
    officerName: "Traffic Officer",
    seniorOfficerName: "Senior Traffic Officer",
    email: "traffic@civicfix.ai",
    phone: "9000000008",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.HEALTH_HYGIENE,
    category: COMPLAINT_CATEGORIES.HEALTH,
    description: "Handles mosquito breeding, dirty water, public health risk, and hygiene issues.",
    officerName: "Health Officer",
    seniorOfficerName: "Senior Health Officer",
    email: "health@civicfix.ai",
    phone: "9000000009",
    area: "All Zones",
  },
  {
    name: DEPARTMENT_TYPES.GENERAL_CIVIC,
    category: COMPLAINT_CATEGORIES.OTHER,
    description: "Handles unclear complaints and issues needing manual review.",
    officerName: "General Civic Officer",
    seniorOfficerName: "Senior Civic Officer",
    email: "general@civicfix.ai",
    phone: "9000000010",
    area: "All Zones",
  },
];

const seedDepartments = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    await Department.deleteMany({});
    await RoutingRule.deleteMany({});

    const createdDepartments = await Department.insertMany(departments);

    const routingRules = createdDepartments.map((dept) => ({
      category: dept.category,
      departmentName: dept.name,
      priorityLevel: "Medium",
      assignedOfficer: dept.officerName,
      escalationOfficer: dept.seniorOfficerName,
      isActive: true,
    }));

    await RoutingRule.insertMany(routingRules);

    console.log("✅ 10 Departments seeded successfully");
    console.log("✅ Routing rules seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

seedDepartments();