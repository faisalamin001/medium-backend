const { Users } = require("../../models");
const bcrypt = require("bcrypt");

// Function to create an admin user
async function createAdmin() {
  try {
    const existingAdmin = await Users.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    const admin = new Users({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
}
createAdmin();
