// Import Firebase services yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAby85hg5ayrVnADryYAWh7V_TvLqEeSv4",
  authDomain: "quest-b1nk4.firebaseapp.com",
  projectId: "quest-b1nk4",
  storageBucket: "quest-b1nk4.firebasestorage.app",
  messagingSenderId: "559058404556",
  appId: "1:559058404556:web:02c4b557a8731165b9ae69",
  measurementId: "G-1KZFH2ZCH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Sign Up Function with async/await
const signUp = async (email, password) => {
  try {
    console.log("Starting signUp with:", email, password); // Debugging

    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user); // Debugging

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: email.split('@')[0],  // Menggunakan bagian email sebelum @ sebagai username
      level: "Pemula",  // Level default
      createdAt: new Date(),
      xp: 0,            // XP default
      questTokens: 5,    // Quest Tokens default
      tasksCompleted: [] // Daftar tugas yang telah diselesaikan (kosong untuk sementara)
    });

    console.log("User data saved to Firestore");
    window.location.replace("/html/home.html");  // Redirect after registration
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    alert(`Error: ${error.message}`); // Alert user for error
  }
};

// Login Function
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("User logged in:", user);

      // Cek XP dan tentukan level saat login
      const userDoc = doc(db, "users", user.uid);
      getDoc(userDoc).then(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const xp = userData.xp || 0;  // Pastikan ada nilai xp
          const level = getLevelFromXP(xp);  // Update level berdasarkan XP
          updateDoc(userDoc, {
            lastLogin: Timestamp.now(),
            level: level,  // Level yang baru
          });
        }
      });

      window.location.replace("../html/home.html");
    })
    .catch(error => {
      console.error("Error during login:", error.message);
      alert(`Error: ${error.message}`);
    });
};

// Fungsi untuk menentukan level berdasarkan XP
const getLevelFromXP = (xp) => {
  if (xp >= 1500) return "Diamond";
  if (xp >= 1000) return "Gold";
  if (xp >= 500) return "Silver";
  return "Bronze";  // Default level
};

// Logout Function
const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
      window.location.replace("index.html");  // Redirect to login page after logout
    })
    .catch(error => {
      console.error("Error during logout:", error.message);
    });
};

// Firebase Auth State Listener
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user);
    document.getElementById("username-display").innerText = user.email.split('@')[0];
  } else {
    console.log("User is signed out");
    window.location.replace("index.html");  // Redirect to login page if the user is not authenticated
  }
});

// Profile Update Function
const updateProfile = (newEmail, newUsername) => {
  const user = auth.currentUser;
  if (user) {
    setDoc(doc(db, "users", user.uid), {
      email: newEmail,
      username: newUsername
    }, { merge: true })  // Gunakan { merge: true } untuk tidak menimpa data lainnya
    .then(() => {
      console.log("User profile updated");
    }).catch(error => {
      console.error("Error updating profile:", error.message);
    });
  }
};

// Fungsi untuk meng-upload gambar profil
const uploadProfilePicture = (file, uid) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a valid image file.');
    return Promise.reject('Invalid file type');
  }

  const storageRef = ref(storage, 'profile-pictures/' + file.name);
  return uploadBytes(storageRef, file)  // Mengupload file ke Firebase Storage
    .then(snapshot => {
      console.log('Uploaded a file!');
      return getDownloadURL(storageRef);  // Mendapatkan URL gambar yang di-upload
    })
    .then(url => {
      // Simpan URL gambar profil ke Firestore
      setDoc(doc(db, "users", uid), { profilePicture: url }, { merge: true })
        .then(() => {
          console.log("Profile picture uploaded and URL saved");
        }).catch(error => {
          console.error("Error updating profile picture:", error.message);
        });
      return url;  // Mengembalikan URL untuk digunakan di register.js
    })
    .catch(error => {
      console.error("Error uploading file:", error.message);
      return Promise.reject(error);  // Menyebabkan error jika upload gagal
    });
};

// Panggil fungsi ini saat login atau setelah update XP
const updateLevel = (userId, xp) => {
  let level = "Bronze";  // Default level

  // Logika untuk menentukan level berdasarkan XP
  if (xp >= 1500) {
    level = "Diamond";  // XP >= 1500 berarti Diamond
  } else if (xp >= 1000) {
    level = "Gold";  // XP >= 1000 berarti Gold
  } else if (xp >= 500) {
    level = "Silver";  // XP >= 500 berarti Silver
  }

  // Update level di Firestore
  updateDoc(doc(db, "users", userId), {
    level: level
  });
};

// Panggil fungsi ini saat login atau setelah update XP
const updateUserLevelAfterLogin = (userId) => {
  const userDoc = doc(db, "users", userId);
  getDoc(userDoc).then(docSnap => {
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const xp = userData.xp || 0;
      updateLevel(userId, xp); // Update level berdasarkan XP
    }
  });
};

export { signUp, login, logout, updateProfile, uploadProfilePicture, updateUserLevelAfterLogin };
