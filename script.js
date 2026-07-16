function popup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

fetch("/contacts")
.then(res=>res.json())
.then(contacts=>{
    let box=document.getElementById("contacts");

    contacts.forEach(contact => {
        box.innerHTML+=`
            <div class="contact-card">
                <h3>${contact.name}</h3>
                <p>📞 ${contact.phone}</p>
                <p>✉️ ${contact.email}</p>
                    <button onclick="deleteContact('${contact._id}')">Delete</button>
            </div>`;
    });
});

function deleteContact(id) {
    fetch("/delete-contact", {
        method: "POST",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id="+id
    })
    .then(()=>{
        location.reload();
    });
}

const form = document.getElementById("form");

form.addEventListener("submit", function (e){
    e.preventDefault();
    fetch("/add-contact",{
        method: "POST",
        body: new URLSearchParams(new FormData(form))
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        form.reset();
        closePopup();
        location.reload();
    });
});