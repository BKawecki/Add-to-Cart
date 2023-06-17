import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLYvt_pBdUu3fOw9WfaAS9PCbOiPwno3U",
  authDomain: "add-to-cart-41a9f.firebaseapp.com",
  databaseURL:
    "https://add-to-cart-41a9f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "add-to-cart-41a9f",
  storageBucket: "add-to-cart-41a9f.appspot.com",
  messagingSenderId: "365674746794",
  appId: "1:365674746794:web:341a67d83f6c86e0f891d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userEmail = document.getElementById('userEmail');
const userPassword = document.getElementById('userPassword');
const authForm = document.getElementById('authForm');
const authContent = document.getElementById('authContent');
const registerButton = document.getElementById('registerButton');
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');

authContent.style.display = 'none';

const userRegister = async() => {
  const registerEmail = userEmail.value;
  const registerPassword = userPassword.value;
  createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    alert('Your account has been created');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
    alert('Enter information into the fields');
  })
}

const userSignIn = async() => {
  const signInEmail = userEmail.value;
  const signInPassword = userPassword.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
  .then((userCredential) => {
    const user = userCredential.user;
    alert('You have signed in successfully');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  })
}

const checkAuthState = async() => {
  onAuthStateChanged(auth, user => {
    if (user) {
      authForm.style.display = 'none';
      authContent.style.display = 'block';
    } else {
      authForm.style.display = 'block';
      authContent.style.display = 'none';
    }
  })
}

const userSignOut = async() => {
  await signOut(auth);
}

checkAuthState();

registerButton.addEventListener('click', userRegister);
signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);

// Cart app js 
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputField = document.getElementById('input-field');
const addBtn = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');


function clearInput() {
    inputField.value = "";
}

function addListItem(input) {
    let itemID = input[0];
    let itemValue = input[1];

    const shoppingListItem = document.createElement('li');

    shoppingListItem.addEventListener('dblclick', () => {
        let locationInDB = ref(database, `shoppingList/${itemID}`);
        remove(locationInDB);
    });

    shoppingListItem.append(itemValue);
    shoppingListEl.append(shoppingListItem);
}

function clearShoppingList() {
    shoppingListEl.innerHTML = "";
}

function logElement() {
    let inputValue = inputField.value;
    if (inputValue === "") {
        return;
    }
    push(shoppingListInDB, inputValue);

    clearInput();
}

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());

        clearShoppingList();
    
        itemsArray.forEach(item => {
            if(item) {
                addListItem(item);
            }
        });
    } else {
        shoppingListEl.innerHTML = "No items here..."
    }
    
})

addBtn.addEventListener('click', logElement);
