// Airtable API Setup
import Airtable from "airtable";

// Variabel untuk menyimpan API Key dan Base ID
const apiKey = "patldQvubyvfB9WHz.e3e7e086a4955a095285cedef6b688de39ca9a18f1c309584b001fdf14e89cf2";
const baseId = "appTXPks4klq2Mni1";

// Inisialisasi Airtable Base
const base = new Airtable({ apiKey }).base(baseId);

export { base };
import { base } from "./airtable.js";

const signUp = async (email, password) => {
  try {
    const username = email.split("@")[0]; // Gunakan bagian awal email sebagai username
    const newUser = await base("users").create([
      {
        fields: {
          email: email,
          username: username,
          passwordHash: btoa(password), // Simpan password dalam bentuk hash sederhana (gunakan metode hashing aman seperti bcrypt untuk produksi)
          level: "Pemula",
          createdAt: new Date().toISOString(),
          xp: 0,
          questTokens: 5,
          tasksCompleted: [],
        },
      },
    ]);

    console.log("User created:", newUser);
    alert("Sign-up berhasil!");
    window.location.replace("html/home.html");
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    alert(`Error: ${error.message}`);
  }
};
const login = async (email, password) => {
  try {
    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User not found");
    }

    const user = records[0].fields;

    if (atob(user.passwordHash) !== password) {
      throw new Error("Invalid password");
    }

    console.log("User logged in:", user);
    alert("Login berhasil!");
    window.location.replace("html/home.html");
  } catch (error) {
    console.error("Error during login:", error.message);
    alert(`Error: ${error.message}`);
  }
};
const logout = () => {
  console.log("User logged out");
  alert("Logout berhasil!");
  window.location.replace("index.html");
};

const updateProfile = async (email, newUsername) => {
  try {
    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User not found");
    }

    const userId = records[0].id;
    await base("users").update([
      {
        id: userId,
        fields: {
          username: newUsername,
        },
      },
    ]);

    console.log("Profile updated");
    alert("Profil berhasil diperbarui!");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    alert(`Error: ${error.message}`);
  }
};

const uploadProfilePicture = async (imageUrl, email) => {
  try {
    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User not found");
    }

    const userId = records[0].id;
    await base("users").update([
      {
        id: userId,
        fields: {
          profilePicture: imageUrl,
        },
      },
    ]);

    console.log("Profile picture updated");
    alert("Gambar profil berhasil diperbarui!");
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    alert(`Error: ${error.message}`);
  }
};

const updateLevel = (xp) => {
  if (xp >= 1500) return "Diamond";
  if (xp >= 1000) return "Gold";
  if (xp >= 500) return "Silver";
  return "Bronze";
};

const updateUserLevel = async (email, xp) => {
  try {
    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User not found");
    }

    const userId = records[0].id;
    const level = updateLevel(xp);

    await base("users").update([
      {
        id: userId,
        fields: {
          xp: xp,
          level: level,
        },
      },
    ]);

    console.log("XP and level updated");
    alert("XP dan level berhasil diperbarui!");
  } catch (error) {
    console.error("Error updating XP and level:", error.message);
    alert(`Error: ${error.message}`);
  }
};

export { signUp, login, logout, updateProfile, uploadProfilePicture, updateUserLevel };
