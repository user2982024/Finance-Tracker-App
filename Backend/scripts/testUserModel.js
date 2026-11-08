
import mongoose from "mongoose";
import assert from "node:assert/strict";

import config from "../configs/config.js";
import User from "../models/user.model.js";

const testUserModel = async () => {
  let testUserId;

  try {
    // 1. Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected.");

    // 2. Ensure indexes, including the unique email index, exist.
    await User.init();

    const testEmail = `model-test-${Date.now()}@example.com`;

    // 3. Create a test user
    const user = await User.create({
      fullName: "Finance Tracker Test",
      email: testEmail,
      passwordHash: "fake-test-hash-not-a-real-password",
    });

    testUserId = user._id;

    console.log("Test 1: User creation successful.");

    // 4. Test duplicate email rejection
    let duplicateRejected = false;

    try {
      await User.create({
        fullName: "Duplicate Test",
        email: testEmail,
        passwordHash: "another-fake-hash",
      });
    } catch (error) {
      if (error.code === 11000) {
        duplicateRejected = true;
      } else {
        throw error;
      }
    }

    assert.equal(duplicateRejected, true);
    console.log("Test 2: Duplicate email rejected.");

    // 5. Test passwordHash is hidden in ordinary queries
    const fetchedUser = await User.findById(testUserId);

    assert.ok(fetchedUser);
    assert.equal(fetchedUser.passwordHash, undefined);

    console.log("Test 3: passwordHash hidden.");

    // 6. Test sensitive fields are excluded from JSON
    const userJSON = fetchedUser.toJSON();

    assert.equal(userJSON.passwordHash, undefined);
    assert.equal(userJSON.emailVerificationTokenHash, undefined);
    assert.equal(userJSON.passwordResetTokenHash, undefined);

    console.log("Test 4: Sensitive fields excluded from JSON.");

    // 7. Test default values
    assert.equal(user.role, "user");
    assert.equal(user.status, "active");
    assert.equal(user.isEmailVerified, false);
    assert.equal(user.preferences.defaultCurrency, "PKR");
    assert.equal(user.preferences.timezone, "Asia/Karachi");
    assert.equal(user.preferences.theme, "system");

    console.log("Test 5: Default values assigned correctly.");

    // 8. Test timestamps
    assert.ok(user.createdAt instanceof Date);
    assert.ok(user.updatedAt instanceof Date);

    console.log("Test 6: Timestamps generated successfully.");

    console.log("\nAll User Model tests passed!");
  } catch (error) {
    console.error("\nUser Model test failed:", error.message);
    process.exitCode = 1;
  } finally {
    // 9. Remove the temporary test user
    if (testUserId) {
      await User.deleteOne({ _id: testUserId });
      console.log("Temporary test user removed.");
    }

    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

testUserModel();
