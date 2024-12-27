// Airtable API Setup
import Airtable from "airtable";
import bcrypt from 'bcryptjs'; // Correct import for bcryptjs

// Mengakses API Key dan Base ID dari environment variables (GitHub Secrets)
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

// Validasi API Key dan Base ID
if (!apiKey || !baseId) {
  throw new Error("Airtable API Key atau Base ID tidak ditemukan. Pastikan Anda sudah mengatur process.env dengan benar.");
}

// Inisialisasi Airtable Base
const base = new Airtable({ apiKey }).base(baseId);

// Fungsi untuk validasi input
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6; // Minimum panjang password
};

// Fungsi untuk sign-up
export const signUp = async (email, password) => {
  try {
    if (!validateEmail(email)) throw new Error("Email tidak valid");
    if (!validatePassword(password)) throw new Error("Password harus memiliki panjang minimal 6 karakter");

    const username = email.split("@")[0]; // Gunakan bagian awal email sebagai username
    const hashedPassword = await bcrypt.hash(password, 10);  // Use bcryptjs for hashing

    const newUser = await base("users").create([
      {
        fields: {
          email,
          username,
          passwordHash: hashedPassword,
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
    return newUser[0].fields; // Mengembalikan data pengguna yang baru dibuat
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    throw new Error(error.message);
  }
};

// Fungsi untuk login
export const login = async (email, password) => {
  try {
    if (!validateEmail(email)) throw new Error("Email tidak valid");

    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User tidak ditemukan");
    }

    const user = records[0].fields;

    // Menggunakan bcrypt untuk membandingkan password dengan hash
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error("Password tidak valid");
    }

    console.log("User logged in:", user);
    localStorage.setItem("user", JSON.stringify(user)); // Simpan user ke localStorage
    alert("Login berhasil!");
    window.location.replace("html/home.html");
  } catch (error) {
    console.error("Error during login:", error.message);
    alert(`Error: ${error.message}`);
  }
};


// Fungsi untuk logout
export const logout = () => {
  localStorage.removeItem("user"); // Hapus data user dari localStorage
  console.log("User logged out");
  alert("Logout berhasil!");
  window.location.replace("index.html");
};

// Fungsi untuk mengunggah gambar profil
export const uploadProfilePicture = async (file, email) => {
  try {
    const fileName = `${email}_profile_picture`; // Nama file unik berdasarkan email pengguna
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_cloudinary_upload_preset"); // Ganti dengan preset Cloudinary Anda

    const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.secure_url) throw new Error("Gagal mengupload gambar profil");

    const imageUrl = data.secure_url; // Ambil URL gambar yang berhasil diupload
    const user = await updateProfilePicture(imageUrl, email);
    return user;
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    throw new Error(error.message);
  }
};

// Fungsi untuk memperbarui profil
export const updateProfilePicture = async (imageUrl, email) => {
  try {
    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User tidak ditemukan");
    }

    const userId = records[0].id;
    await base("users").update([{
      id: userId,
      fields: {
        profilePicture: imageUrl,
      },
    }]);

    console.log("Profile picture updated");
    alert("Gambar profil berhasil diperbarui!");
    return records[0].fields;
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    throw new Error(error.message);
  }
};

// Fungsi untuk menentukan level berdasarkan XP
const updateLevel = (xp) => {
  if (xp >= 1500) return "Diamond";
  if (xp >= 1000) return "Gold";
  if (xp >= 500) return "Silver";
  return "Bronze";
};

// Fungsi untuk memperbarui XP dan level user
export const updateUserLevel = async (email, xp) => {
  try {
    if (!validateEmail(email)) throw new Error("Email tidak valid");

    const records = await base("users")
      .select({
        filterByFormula: `email = '${email}'`,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error("User tidak ditemukan");
    }

    const userId = records[0].id;
    const level = updateLevel(xp);

    await base("users").update([{
      id: userId,
      fields: {
        xp,
        level,
      },
    }]);

    console.log("XP and level updated");
    alert("XP dan level berhasil diperbarui!");
  } catch (error) {
    console.error("Error updating XP and level:", error.message);
    alert(`Error: ${error.message}`);
  }
};

// Fungsi untuk menampilkan profil pengguna
export const displayUserProfile = async (email) => {
  try {
    const records = await base("users")
      .select({ filterByFormula: `email = '${email}'` })
      .firstPage();
    if (records.length === 0) {
      throw new Error("User tidak ditemukan");
    }
    return records[0].fields;  // Mengembalikan profil pengguna
  } catch (error) {
    console.error("Error displaying user profile:", error.message);
    throw new Error(error.message);
  }
};

// Fungsi untuk mengambil item dari toko
export const getStoreItems = async () => {
  try {
    const records = await base("store")
      .select()
      .firstPage();
    return records.map(record => record.fields);
  } catch (error) {
    console.error("Error fetching store items:", error.message);
    throw new Error(error.message);
  }
};

// Fungsi untuk membeli item
export const purchaseItem = async (userEmail, itemId) => {
  try {
    const userRecords = await base("users")
      .select({ filterByFormula: `email = '${userEmail}'` })
      .firstPage();
    if (userRecords.length === 0) {
      throw new Error("User tidak ditemukan");
    }
    const user = userRecords[0].fields;
    // Logika untuk mengurangi XP atau Quest Tokens berdasarkan item
    // Update user setelah pembelian item
    await base("users").update([{
      id: userRecords[0].id,
      fields: { questTokens: user.questTokens - 1 }  // Contoh: mengurangi Quest Tokens
    }]);
    return "Item purchased successfully";
  } catch (error) {
    console.error("Error purchasing item:", error.message);
    throw new Error(error.message);
  }
};

// Fungsi untuk menyimpan pengguna ke Airtable
export const saveUserToAirtable = async (userData) => {
  try {
    const newUser = await base("users").create([{
      fields: userData
    }]);
    return newUser[0].fields;
  } catch (error) {
    console.error("Error saving user to Airtable:", error.message);
    throw new Error(error.message);
  }
};

// Export fungsi-fungsi yang dibuat
export { signUp, login, logout, updateProfile, uploadProfilePicture, updateUserLevel };
