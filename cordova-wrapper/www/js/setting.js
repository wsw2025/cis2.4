import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import {
  getAuth, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBk19z0f3n7ixniq-f7Bq1Zj4NYIXAZ7oI',
  authDomain: 'shareable-37f85.firebaseapp.com',
  projectId: 'shareable-37f85',
  storageBucket: 'shareable-37f85.appspot.com',
  messagingSenderId: '542630327474',
  appId: '1:542630327474:web:8258d25c6c24e0384185ab',
  measurementId: 'G-C3YDL8XPHE',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
document.addEventListener('DOMContentLoaded', () => {
  const storage = getStorage(); // Initialize Firebase Storage instance
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      getDocs(collection(db, 'users'))
        .then((querySnapshot) => {
          const itemList = document.getElementById('username'); // Get the container element
          const profilePic = document.getElementById('profile_image'); // Get the container element
          const email = document.getElementById('email');
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId) {
              console.log(data.email);
              const imageRef = storageRef(
                storage,
                `profile/${data.userId}.png`,
              ); // Construct the reference to the image file
              getDownloadURL(imageRef) // Fetch the URL for the image
                .then((url) => {
                  const image = document.createElement('div'); // Create a new div element
                  image.innerHTML = `
                  <img style="background-image: url('${url}'); width: 49px; height: 49px; left: 50px; top: 135px; position: absolute; box-shadow: 0px 4px 20px rgba(100.94, 100.94, 100.94, 0.35); border-radius: 9999px; border: 4px white solid" src="${url}">
                `;
                  profilePic.appendChild(image); // Append the div to the container element
                })
                .catch((error) => {
                });
              const div = document.createElement('div');
              div.innerHTML = `<div>${data.username}</div>`;
              itemList.appendChild(div);
              const mail = document.createElement('div');
              mail.textContent = data.email;
              email.appendChild(mail);
            }
          });
        })
        .catch((error) => {
          console.error('Error getting documents: ', error);
        });
    }
    else {
      window.location.href = 'login.html';
    }
  });
});
