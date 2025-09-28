import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const caption = document.getElementById("caption");
const tags = document.getElementById("tags");
const postBtn = document.getElementById("postBtn");

let selectedFile = null;

// Preview image
imageInput.addEventListener("change", e => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}" style="max-width:100%;border-radius:8px;">`;
    };
    reader.readAsDataURL(selectedFile);
  }
});

// Upload post
postBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }
  if (!selectedFile) {
    alert("Choose an image.");
    return;
  }

  try {
    const fileRef = ref(storage, "posts/" + Date.now() + "_" + selectedFile.name);
    await uploadBytes(fileRef, selectedFile);
    const imageUrl = await getDownloadURL(fileRef);

    await addDoc(collection(db, "posts"), {
      uid: user.uid,
      username: user.displayName || user.email.split("@")[0],
      caption: caption.value,
      tags: tags.value,
      imageUrl,
      createdAt: serverTimestamp(),
      likes: 0,
    });

    alert("Post uploaded!");
    caption.value = "";
    tags.value = "";
    preview.innerHTML = "";
    selectedFile = null;
  } catch (err) {
    console.error("Error posting:", err);
    alert("Failed to post.");
  }
});
