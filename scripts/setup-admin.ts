import { auth } from "../src/lib/auth";

async function setup() {
  console.log("Setting up admin user...");
  try {
    // Better Auth's programmatic sign up
    // This requires calling the API directly or using the server-side methods
    const user = await auth.api.signUpEmail({
      body: {
        email: "10mm2.adrian@gmail.com",
        password: "PasswordPortofolio495;",
        name: "Adriansigma12",
      },
      asResponse: false,
    });
    console.log("Admin setup complete!", user);
  } catch (error) {
    console.error("Failed to setup admin:", error);
  }
}

setup();
