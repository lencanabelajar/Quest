// Airtable API Setup
import Airtable from "airtable";
import bcrypt from "bcryptjs"; // Correct import for bcryptjs
import fetch from "node-fetch"; // Untuk mengakses API eksternal jika diperlukan
import dotenv from "dotenv"; // Menggunakan dotenv untuk mengakses variabel di .env

dotenv.config(); // Memuat variabel .env

// Mengakses API key dan URL Airtable dari file .env
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID; // Base ID untuk Airtable
const baseUrl = process.env.AIRTABLE_BASE_URL; // Base URL jika diperlukan untuk akses langsung
const cloudinaryPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // Cloudinary preset jika menggunakan

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
    const hashedPassword = await bcrypt.hash(password, 10);  // Menggunakan bcryptjs untuk hashing

    // Membuat user baru di Airtable
    const newUser = await base("users").create([{
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
    }]);

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
    formData.append("upload_preset", cloudinaryPreset); // Ganti dengan preset Cloudinary Anda

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

// Fungsi untuk mengambil data leaderboard dari Airtable
export async function getLeaderboardData() {
  try {
    const records = await base("Leaderboard")
      .select()
      .firstPage();

    return records.map(record => ({
      name: record.fields.Name,
      score: record.fields.Score,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard data:", error.message);
    throw new Error(error.message);
  }
}

// Fungsi untuk mengambil komentar dari forum komunitas
export function getForumComments() {
  return new Promise((resolve, reject) => {
    base('Forum Comments')
      .select({
        view: 'Grid view', // Ganti sesuai dengan tampilan di Airtable
      })
      .firstPage((err, records) => {
        if (err) {
          reject(err);
        } else {
          const comments = records.map(record => ({
            username: record.get('Username'), // Pastikan sesuai dengan field di Airtable
            text: record.get('Comment'), // Pastikan sesuai dengan field di Airtable
          }));
          resolve(comments);
        }
      });
  });
}

// Fungsi untuk mengirim komentar ke Airtable
export function postComment(comment) {
  return new Promise((resolve, reject) => {
    base('Forum Comments').create([
      {
        fields: {
          Username: comment.username,
          Comment: comment.text,
        },
      },
    ], (err, records) => {
      if (err) {
        reject(err);
      } else {
        resolve(records);
      }
    });
  });
}

// Fungsi untuk mendapatkan anggota komunitas
export function getCommunityMembers() {
  return new Promise((resolve, reject) => {
    base('Community Members')
      .select({
        view: 'Grid view', // Ganti sesuai dengan tampilan di Airtable
      })
      .firstPage((err, records) => {
        if (err) {
          reject(err);
        } else {
          const members = records.map(record => ({
            username: record.get('Username'), // Pastikan sesuai dengan field di Airtable
            avatar: record.get('Avatar'), // Ganti dengan field avatar yang sesuai
            level: record.get('Level'), // Ganti dengan field level yang sesuai
          }));
          resolve(members);
        }
      });
  });
}

// Export semua fungsi
export { signUp, login, logout, updateProfilePicture, getLeaderboardData, getForumComments, postComment, getCommunityMembers };
