// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
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
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

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
      return Promise.resolve(); // Pastikan promise selesai sebelum melanjutkan
    })
    .catch(error => {
      console.error("Error during sign-up:", error.message);
      return Promise.reject(error); // Menangani error dan menolaknya kembali
    });
};

// Login Function
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("User logged in:", user);
      window.location.href = "../html/home.html";  // Redirect to home page after login
    })
    .catch(error => {
      console.error("Error during login:", error.message);
    });
};

// Logout Function
const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
      window.location.href = "index.html";  // Redirect to login page after logout
    })
    .catch(error => {
      console.error("Error during logout:", error.message);
    });
};

// Firebase Auth State Listener
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user);
    // Display user information in the dashboard
    document.getElementById("username-display").innerText = user.email.split('@')[0];
  } else {
    console.log("User is signed out");
    // Redirect to login page if not authenticated
    window.location.href = "index.html";  // Redirect to login page if the user is not authenticated
  }
});

// Upload Profile Picture to Firebase Storage
const uploadProfilePicture = (file) => {
  const storageRef = ref(storage, 'profile-pictures/' + file.name);
  uploadBytes(storageRef, file).then(snapshot => {
    console.log('Uploaded a file!');
    getDownloadURL(storageRef).then(url => {
      const user = auth.currentUser;
      updateDoc(doc(db, "users", user.uid), {
        profilePicture: url
      }).then(() => {
        console.log("Profile picture uploaded and URL saved");
      }).catch(error => {
        console.error("Error updating user profile:", error);
      });
    });
  }).catch(error => {
    console.error("Error uploading file:", error);
  });
};

// Function to display user profile information
const displayUserProfile = (userId) => {
  getDoc(doc(db, "users", userId)).then(docSnap => {
    if (docSnap.exists()) {
      const userData = docSnap.data();
      document.getElementById("user-email").innerText = userData.email;
      document.getElementById("user-level").innerText = userData.level;
      if (userData.profilePicture) {
        document.getElementById("profile-img").src = userData.profilePicture;
      }
    } else {
      console.log("No such document!");
    }
  }).catch(error => {
    console.error("Error getting document:", error);
  });
};

// Redirect if user is not authenticated (useful for pages like home)
const redirectIfNotAuthenticated = () => {
  onAuthStateChanged(auth, user => {
    if (!user) {
      // If user is not authenticated, redirect to login
      window.location.href = "index.html";
    }
  });
};

export { signUp, login, logout, uploadProfilePicture, displayUserProfile, redirectIfNotAuthenticated };

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user); // Debugging
  } else {
    console.log("User is signed out");
    // Redirect to login page if not authenticated
    window.location.href = "index.html";  // Redirect to login page if the user is not authenticated
  }
});
