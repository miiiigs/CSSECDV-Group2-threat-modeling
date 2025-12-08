document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".box");
  const labRadios = document.querySelectorAll("input[name='lab']");
  let currentLab = "1";

const seats = document.querySelectorAll(".box .computer");
let labNum_global;

seats.forEach((seat, index) => {
  seat.classList.remove("reserved", "selected", "selectable");
  seat.onclick = null;

  const seatNumber = index + 1;
  const nameLabel = seat.querySelector(".name");

  seat.classList.add("selectable");
  seat.addEventListener("click", () => {
    if (!seat.classList.contains("reserved")) {
      seat.classList.toggle("selected");
      console.log(`Seat ${seatNumber} selected in Lab ${labNum_global}`);
    }
  });
});

async function updateSeatStatus(labNumber) {
  currentLab = labNumber;

  labNum_global = labNumber;

  const date = document.getElementById("reservation-date")?.value;
  const startTime = document.getElementById("start_time")?.value;
  const endTime = document.getElementById("end_time")?.value;
  if (!date || !startTime || !endTime) return;

  try {
    const res = await fetch(
      `/api/reservations/available?lab=${labNumber}&date=${date}&start=${startTime}&end=${endTime}`
    );
    const data = await res.json();
    console.log("Response data:", data);
    
    const availableSeats = data.availableSeats;
    const reservedSeatsMap = data.reservedSeatsMap || {};

    const seats = document.querySelectorAll(".box .computer");

    seats.forEach((seat, index) => {
      seat.classList.remove("reserved", "selected", "selectable");
      seat.onclick = null;

      const seatNumber = index + 1;
      const numberLabel = seat.querySelector(".number");
      const nameLabel = seat.querySelector(".name");

      if (reservedSeatsMap.hasOwnProperty(seatNumber)) {
        seat.classList.add("reserved");
        const reservedBy = reservedSeatsMap[seatNumber];
        nameLabel.innerHTML = reservedBy === "Anonymous" ? "Anonymous" : `${reservedBy}`;
      } else {
        nameLabel.innerHTML = "";
      }
    });
  } catch (error) {
    console.error("Failed to fetch reservation data:", error);
  }
}


  labRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      updateSeatStatus(e.target.value);
    });
  });
  

const dateInput = document.getElementById("reservation-date");
const timeInput = document.getElementById("start_time");
const endInput = document.getElementById("end_time");

if (dateInput && timeInput && endInput) {
  dateInput.addEventListener("change", () => updateSeatStatus(currentLab));
  timeInput.addEventListener("change", () => updateSeatStatus(currentLab));
  endInput.addEventListener("change", () => updateSeatStatus(currentLab));
}

  updateSeatStatus(currentLab);
});

// ----------------- Login Handler -----------------
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ✅ FIXED HERE
      });

      const data = await res.json();

      if (res.ok) {
          sessionStorage.setItem("currentUser", email);
          window.location.href = "/index";
      } else {
          const loginError = document.getElementById("login-error");
          if (loginError) {
            loginError.textContent = data.message || "Invalid email or password.";
          }
      }
    } catch (err) {
      console.error("Login error:", err);
        const loginError = document.getElementById("login-error");
        if (loginError) {
          loginError.textContent = "Error connecting to server.";
        }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const inputs = ['username', 'fullname', 'studentid'];

  inputs.forEach(id => {
    document.getElementById(id).addEventListener("input", runSearch);
  });

  async function runSearch() {
    const params = new URLSearchParams({
      username: document.getElementById("username").value,
      fullname: document.getElementById("fullname").value,
      studentid: document.getElementById("studentid").value,
    });

    const res = await fetch(`/api/search-users?${params.toString()}`);
    const users = await res.json();

    const viewBox = document.getElementById("view_box");
    viewBox.innerHTML = "";

    users.forEach(user => {
      const div = document.createElement("div");
      div.className = "user_card";

      const imgSrc = user.profilePicBase64
        ? `data:${user.profilePicContentType};base64,${user.profilePicBase64}`
        : "/data/defaultpfp.png";

      div.innerHTML = `
        <div class="view_slide">
          <div class="view_slide_top">
            <a class="profile-pic" src="${user.profilePicBase64}">
              <div id="${user.id}" class="pfp_image">
                <p></p>
              </div>
            </a>
            <div class="reservation_description">
              <p><strong>${user.username}</strong></p><br>
              <p>${user.id}<p><br>
              <p>${user.lastName},${user.firstName}<p><br>
            </div>
          </div>
        </div>

      `;

      viewBox.appendChild(div);
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const form = document.getElementById("edit-profile-form");
  const inputs = form.querySelectorAll("input, textarea");

  editBtn.addEventListener("click", () => {
    inputs.forEach((el) => el.removeAttribute("readonly"));
    saveBtn.style.display = "inline";
    editBtn.style.display = "none";
    document.getElementById("profilePicInput").style.display = "block";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const res = await fetch("/api/profile/update", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile updated.");
      window.location.reload();
    } else {
      alert(data.message || "Failed to update profile.");
    }
  });
});



// ----------------- Reservation Handler -----------------
document.addEventListener("DOMContentLoaded", () => {
  const reserveButton = document.getElementById("reserve-button");

  reserveButton?.addEventListener("click", async () => {
    const selectedDate = document.getElementById("reservation-date").value;
    const startTime = document.getElementById("start_time").value;
    const endTime = document.getElementById("end_time")?.value;
    const labNumber = document.querySelector(
      'input[name="lab"]:checked'
    )?.value;
    const anon = document.querySelector("#anon-checkbox")?.checked;
    const selectedComputers = document.querySelectorAll(".computer.selected");
    const username = anon ? "Anonymous" : sessionStorage.getItem("currentUser");

    if (!selectedDate || !startTime || !endTime || !labNumber) {
      alert("Please complete all reservation fields.");
      return;
    }

    if (!selectedComputers.length) {
      alert("Please select at least one seat to reserve.");
      return;
    }

    if (!anon && !username) {
      alert("Please login to make a reservation.");
      return;
    }


    // Helper to convert time value (e.g., '0900') to 'HH:MM' format
    function toHHMM(val) {
      if (!val || val.length !== 4) return val;
      return val.slice(0,2) + ':' + val.slice(2);
    }

    for (const comp of selectedComputers) {
      const seatNumber = comp.querySelector(".number").textContent;

      const response = await fetch("/api/seats/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labNumber: parseInt(labNumber),
          seatNumber: parseInt(seatNumber),
          date: selectedDate,
          startTime: toHHMM(startTime),
          endTime: toHHMM(endTime),
          user: username,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        comp.classList.add("reserved");
        comp.classList.remove("selected");
        comp.querySelector(".name").textContent = username;
      } else {
        alert(data.message || "Reservation failed.");
      }
    }

    updateSeatStatus(labNumber);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("reservation-date");

  if (dateInput) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }
});


// ----------------- Delete User Handler -----------------
document.addEventListener("DOMContentLoaded", async () =>{
    const inp = document.getElementById("searchInput").value;

    if(inp){
      const sf = document.getElementById("searchField").value;
      const params = new URLSearchParams({sf: inp});

      const res = await fetch(`/api/search-users?${params.toString()}`);
      const user = await res.json();
      document.getElementById("searchField").value = user.email;

      const div = document.createElement("div");
      div.id = "view_box";
      div.style.width = "100%";
      div.style.borderCollapse = "collapse";

      div.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
              <thead>
              <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
              </tr>
              </thead>
              <tbody id="tBodyId">
                    <tr>
                        <td><input type="radio" name="selectedUser" value=${user.id} required/></td>
                        <td>${user.id}</td>
                        <td>${user.lastName}, ${user.firstName}</td>
                        <td>${user.email}</td>
                    </tr>   
              </tbody>
          </table>
      `;
    }
  });

// ----------------- Delete Reservation Handler -----------------
// Use event delegation to handle delete button clicks (works even if buttons are added dynamically)
console.log("Delete reservation handler script loaded");

document.addEventListener("click", async (e) => {
  if (e.target.closest(".delete-reservation-btn")) {
    e.preventDefault();
    const button = e.target.closest(".delete-reservation-btn");
    
    const reservationId = button.getAttribute("data-reservation-id");
    const labNumber = button.getAttribute("data-lab");
    const seatNumbers = button.getAttribute("data-seat");
    const date = button.getAttribute("data-date");
    const startTime = button.getAttribute("data-start");
    const endTime = button.getAttribute("data-end");

    console.log("Delete button clicked for reservation:", reservationId);

    // Confirm deletion
    const confirmDelete = confirm(
      `Are you sure you want to delete this reservation?\n\n` +
      `Lab: ${labNumber}\n` +
      `Seats: ${seatNumbers}\n` +
      `Date: ${date}\n` +
      `Time: ${startTime} - ${endTime}`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log("Sending delete request to:", `/api/reservations/${reservationId}`);
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        alert("Reservation deleted successfully!");
        // Remove the reservation element from the DOM
        const reservationElement = button.closest(".view_slide");
        reservationElement.remove();
        
        // If no more reservations, show "No reservations found" message
        const remainingReservations = document.querySelectorAll(".view_slide");
        if (remainingReservations.length === 0) {
          const viewBox = document.getElementById("view_box");
          viewBox.innerHTML = "<p>No reservations found.</p>";
        }
      } else {
        alert(data.message || "Failed to delete reservation.");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Error deleting reservation. Please try again.");
    }
  }
});

// ----------------- Search Reservations Handler -----------------
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const clearSearchBtn = document.getElementById("clear-search-btn");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const username = document.getElementById("search-username").value.trim();
      const lab = document.getElementById("search-lab").value;
      const pcno = document.getElementById("search-pcno").value.trim();
      
      // Build query parameters
      const params = new URLSearchParams();
      if (username) params.append("username", username);
      if (lab) params.append("lab", lab);
      if (pcno) params.append("pcno", pcno);
      
      // Redirect to the same page with search parameters
      const currentUrl = window.location.pathname;
      const searchUrl = params.toString() ? `${currentUrl}?${params.toString()}` : currentUrl;
      window.location.href = searchUrl;
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      // Clear all search fields
      document.getElementById("search-username").value = "";
      document.getElementById("search-lab").value = "";
      document.getElementById("search-pcno").value = "";
      
      // Redirect to the page without search parameters
      window.location.href = window.location.pathname;
    });
  }
});