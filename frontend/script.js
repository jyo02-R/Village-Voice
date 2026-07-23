let imageData = "";

let mediaRecorder;
let audioChunks = [];
let audioData = "";
let audioBlob = null;

const villageData = {

    "Kothavalasa":[
        "Dathi",
        "Kothavalasa",
        "Kantakapalli",
        "Nelivada"
    ],

    "Bobbili":[
        "Piridi",
        "Bobbili",
        "Rangarayapuram"
    ],

    "Vizianagaram":[
        "Ayyannapeta",
        "Gunkalam",
        "Koratam"
    ]

};

const mandalSelect =
document.getElementById("mandal");

const villageSelect =
document.getElementById("village");

if(mandalSelect && villageSelect){

    mandalSelect.addEventListener(
        "change",
        function(){

            villageSelect.innerHTML =
            '<option value="">Select Village</option>';

            villageData[this.value].forEach(
                village => {

                    const option =
                    document.createElement("option");

                    option.value = village;
                    option.textContent = village;

                    villageSelect.appendChild(option);

                });

        });

}

// Registration
// =======================
// USER REGISTRATION
// =======================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

registerForm.addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const email = document.getElementById("email").value;
const mandal = document.getElementById("mandal").value;
const village = document.getElementById("village").value;
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

// Client-side validations
const nameRegex = /^[a-zA-Z\s]+$/;
if (!nameRegex.test(name.trim())) {
    alert("Name must contain only letters and spaces");
    return;
}

const phoneRegex = /^\d{10}$/;
if (!phoneRegex.test(phone.trim())) {
    alert("Phone number must be exactly 10 digits");
    return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email.trim())) {
    alert("Please enter a valid email address");
    return;
}

const usernameRegex = /^[a-zA-Z0-9_]+$/;
const normalizedUsername = username.trim().toLowerCase();
if (!usernameRegex.test(normalizedUsername) || normalizedUsername.length < 4) {
    alert("Username must be at least 4 characters and contain only letters, numbers, or underscores (no spaces)");
    return;
}

if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
}

const user={
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    mandal,
    village,
    username: normalizedUsername,
    password
};

try{

const response=await fetch("/api/users/register",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(user)

});

const data=await response.json();

if(response.ok){

alert("Registration Successful! A welcome confirmation email has been sent to your registered address.");

window.location.href="user-login.html";

}else{

alert(data.message);

}

}

catch(err){

alert("Backend Not Running");

console.log(err);

}

});

}

// Login
// =======================
// USER LOGIN
// =======================

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async function(e){

e.preventDefault();

try{

const response=await fetch("/api/users/login",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username:document.getElementById("loginUsername").value,

password:document.getElementById("loginPassword").value

})

});

const data=await response.json();

if(response.ok){

localStorage.setItem("token",data.token);

localStorage.setItem("currentUser",JSON.stringify(data.user));

alert("Login Successful");

window.location.href="user-dashboard.html";

}else{

alert(data.message);

}

}catch(err){

alert("Cannot connect to Backend");

console.log(err);

}

});

}
// IMAGE UPLOAD

const imageInput =
document.getElementById("image");

if(imageInput){

imageInput.addEventListener(
"change",
function(e){

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(){

imageData = reader.result;

};

reader.readAsDataURL(file);

});

}

// AUDIO RECORDING

const startBtn =
document.getElementById("startRecording");

const stopBtn =
document.getElementById("stopRecording");

if(startBtn && stopBtn){

startBtn.addEventListener(
"click",
async ()=>{

try{

const stream =
await navigator.mediaDevices.getUserMedia({
audio:true
});

mediaRecorder =
new MediaRecorder(stream);

audioChunks = [];

mediaRecorder.start();

document.getElementById(
"recordingStatus"
).innerText =
"Recording...";

mediaRecorder.ondataavailable =
event=>{

audioChunks.push(event.data);

};

}
catch(err){

alert(
"Microphone Permission Denied or Not Supported"
);

console.log(err);

}

});

stopBtn.addEventListener(
"click",
()=>{

mediaRecorder.stop();

mediaRecorder.onstop =
()=>{

audioBlob =
new Blob(audioChunks,{
type:"audio/webm"
});

const reader =
new FileReader();

reader.onloadend =
function(){

audioData =
reader.result;

};

reader.readAsDataURL(audioBlob);

document.getElementById(
"recordingStatus"
).innerText =
"Recording Saved";

};

});

}

// USER DASHBOARD

const currentUser =
JSON.parse(
localStorage.getItem("currentUser")
);

const welcome =
document.getElementById("welcomeUser");

if(welcome && currentUser){

welcome.innerHTML =
`Welcome ${currentUser.name}<br>
Village : ${currentUser.village}<br>
Mandal : ${currentUser.mandal}`;

}

// COMPLAINT SUBMIT
// =======================
// COMPLAINT SUBMIT
// =======================

const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {

complaintForm.addEventListener("submit", async function(e){

e.preventDefault();

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){

alert("Please Login First");

window.location.href="user-login.html";

return;

}

const formData = new FormData();

formData.append("complaintId","VV"+Date.now());

formData.append("userId",currentUser._id);

formData.append("name",currentUser.name);

formData.append("mandal",currentUser.mandal);

formData.append("village",currentUser.village);

formData.append("category",document.getElementById("category").value);

formData.append("language",document.getElementById("language").value);

formData.append("description",document.getElementById("description").value);

const image=document.getElementById("image").files[0];

if(image){

formData.append("image",image);

}

if(audioBlob){

formData.append("audio",audioBlob,"recording.webm");

}

try{

const response=await fetch("/api/complaints",{

method:"POST",

body:formData

});

const data=await response.json();

if(response.ok){

alert("Complaint Submitted Successfully");

complaintForm.reset();

audioBlob = null;

const recStatus = document.getElementById("recordingStatus");

if(recStatus) recStatus.innerText = "";

loadMyComplaints();

}else{

alert(data.message);

}

}catch(err){

console.log(err);

alert("Cannot Connect To Backend");

}

});

}
// =======================
// LOAD MY COMPLAINTS
// =======================

async function loadMyComplaints(){

const table=document.getElementById("myComplaints");

if(!table)return;

const currentUser=JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser)return;

try{

const response=await fetch(

"/api/complaints/"+currentUser._id

);

const complaints=await response.json();

table.innerHTML="";

complaints.forEach(c=>{

table.innerHTML+=`

<tr>

<td>${c.complaintId}</td>

<td>${c.category}</td>

<td>${c.status}</td>

</tr>

`;

});

}catch(err){

console.log(err);

}

}

loadMyComplaints();
// MY COMPLAINTS TABLE

const myTable=document.getElementById("myComplaints");

if(myTable){

const user=JSON.parse(localStorage.getItem("currentUser"));

fetch("/api/complaints/"+user._id)

.then(res=>res.json())

.then(data=>{

myTable.innerHTML="";

data.forEach(c=>{

myTable.innerHTML+=`

<tr>

<td>${c.complaintId}</td>

<td>${c.category}</td>

<td>${c.status}</td>

</tr>

`;

});

});

}
// Sarpanch Login
// =========================
// SARPANCH LOGIN
// =========================

const sarpanchLoginForm=document.getElementById("sarpanchLoginForm");

if(sarpanchLoginForm){

sarpanchLoginForm.addEventListener("submit",async function(e){

e.preventDefault();

try{

const response=await fetch("/api/admin/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username:document.getElementById("username").value,

password:document.getElementById("password").value

})

});

const data=await response.json();

if(data.success){

localStorage.setItem("adminToken",data.token);

localStorage.setItem("sarpanch",JSON.stringify(data.sarpanch));

window.location.href="sarpanch-dashboard.html";

}else{

alert(data.message);

}

}catch(err){

alert("Backend Not Running");

console.log(err);

}

});

}
// ADMIN DASHBOARD

const complaintTable=document.getElementById("complaintTable");

if(complaintTable){

const token=localStorage.getItem("adminToken");

fetch("/api/admin/complaints",{

headers:{

Authorization:"Bearer "+token

}

})

.then(res=>res.json())

.then(data=>{

complaintTable.innerHTML="";

data.complaints.forEach(c=>{

complaintTable.innerHTML+=`

<tr>

<td>${c.complaintId}</td>

<td>${c.name}</td>

<td>${c.category}</td>

<td>${c.status}</td>

<td>

<button onclick="completeComplaint('${c._id}')">

Complete

</button>

</td>

</tr>

`;

});

});

}
async function completeComplaint(id){

const token=localStorage.getItem("adminToken");

const response=await fetch(

"/api/admin/complaints/"+id,

{

method:"PUT",

headers:{

"Content-Type":"application/json",

Authorization:"Bearer "+token

},

body:JSON.stringify({

status:"Completed"

})

}

);

const data=await response.json();

alert(data.success?"Complaint Updated":"Failed");

location.reload();

}
function logout(){

localStorage.removeItem("currentUser");

localStorage.removeItem("token");

localStorage.removeItem("adminToken");

localStorage.removeItem("sarpanch");

window.location.href="index.html";

}
