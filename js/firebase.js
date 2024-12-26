// Import Firebase services yang dibutuhkan
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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

// Sign Up Function
const signUp = (email, password) => {
  console.log("Starting signUp with:", email, password); // Debugging
  return createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("User created:", user); // Debugging
      return setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: email.split('@')[0],  // Menggunakan bagian email sebelum @ sebagai username
        level: "Pemula",  // Level default
        createdAt: new Date()
      });
    })
    .then(() => {
      console.log("User data saved to Firestore");
      window.location.replace("../html/home.html");  // Redirect after registration
    })
    .catch(error => {
      console.error("Error during sign-up:", error.message);
      alert(`Error: ${error.message}`); // Alert user for error
    });
};

// Login Function
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("User logged in:", user);
      
     // Update lastLogin di Firestore setelah login
      updateDoc(doc(db, "users", user.uid), {
        lastLogin: firebase.firestore.Timestamp.now()  // Update timestamp login
      });      
      
      window.location.replace("../html/home.html");  // Redirect to home page after login
    })
    .catch(error => {
      console.error("Error during login:", error.message);
      alert(`Error: ${error.message}`); // Alert user for error
    });
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
    }).then(() => {
      console.log("User profile updated");
    }).catch(error => {
      console.error("Error updating profile:", error.message);
    });
  }
};

// Upload Profile Picture
const uploadProfilePicture = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a valid image file.');
    return;
  }

  const storageRef = ref(storage, 'profile-pictures/' + file.name);
  uploadBytes(storageRef, file).then(snapshot => {
    console.log('Uploaded a file!');
    getDownloadURL(storageRef).then(url => {
      const user = auth.currentUser;
      setDoc(doc(db, "users", user.uid), { profilePicture: url }, { merge: true })
        .then(() => {
          console.log("Profile picture uploaded and URL saved");
        }).catch(error => {
          console.error("Error updating profile picture:", error.message);
        });
    });
  }).catch(error => {
    console.error("Error uploading file:", error.message);
  });
};

const updateLevel = (userId, xp) => {
  let level = "Bronze";  // Default level

  // Logika untuk menentukan level berdasarkan XP
  if (xp >= 1000) {
    level = "Gold";  // XP >= 1000 berarti Gold
  } else if (xp >= 500) {
    level = "Silver";  // XP >= 500 berarti Silver
  } else if (xp >= 100) {
    level = "Bronze";  // XP >= 100 berarti Bronze
  }

  // Jika XP lebih tinggi, beri level Diamond
  if (xp >= 1500) {
    level = "Diamond";  // Diamond level untuk XP >= 1500
  }

  // Update level di Firestore
  updateDoc(doc(db, "users", userId), {
    level: level
  });
};

// Panggil fungsi ini saat login atau setelah update XP
updateLevel(user.uid, user.xp);

updateDoc(doc(db, "users", user.uid), {
  lastLogin: firebase.firestore.Timestamp.now(),  // Update last login time
  level: "Bronze",  // Atur level, bisa diubah berdasarkan XP
  questTokens: 5,   // Menyimpan jumlah token
  tasksCompleted: [], // Daftar tugas yang telah diselesaikan
  xp: 100           // XP pengguna
});

export { signUp, login, logout, updateProfile, uploadProfilePicture };
