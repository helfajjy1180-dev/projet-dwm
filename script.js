// ===== LISTE COMPLETE DES SALLES =====
let salles = [];

for(let i = 1; i <= 20; i++) {
  salles.push({
    nom: "Salle " + i,
    cap: Math.floor(Math.random() * 120) + 20,
    desc: "Salle équipée pour cours et réunions",
    img: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg"
  });
}

// ===== HISTORIQUE DES RÉSERVATIONS =====
let historique = [];

// ===== BASE DE DONNÉES DES UTILISATEURS INSCRITS =====
let utilisateurs = [];

// ===== FONCTION POUR VÉRIFIER LES CONFLITS =====
function verifierConflit(salle, date, heure) {
    return historique.some(reservation => 
        reservation.salle === salle && 
        reservation.date === date && 
        reservation.heure === heure
    );
}

// ===== FONCTION POUR AFFICHER UNE ALERTE PERSONNALISÉE =====
function showAlert(message, type = 'danger') {
    const existingAlert = document.querySelector('.alert-custom');
    if(existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-custom`;
    alertDiv.innerHTML = `
        <strong>${type === 'danger' ? '❌ Erreur' : '✅ Succès'} :</strong> ${message}
        <button type="button" class="btn-close ms-3" onclick="this.parentElement.remove()"></button>
    `;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if(alertDiv) alertDiv.remove();
    }, 3000);
}

// ===== AFFICHAGE DES SALLES =====
function render(data) {
  let container = document.getElementById("sallesContainer");
  if (!container) return;
  container.innerHTML = "";

  data.forEach(s => {
    container.innerHTML += `
    <div class="card-horizontal">
      <img src="${s.img}" alt="${s.nom}">
      <div class="p-3 flex-grow-1 d-flex justify-content-between">
        <div>
          <h5>${s.nom}</h5>
          <p>${s.desc}</p>
          <small>Capacité: ${s.cap} personnes</small>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-success" onclick="selectSalle('${s.nom}')">
            Réserver
          </button>
        </div>
      </div>
    </div>`;
  });
}

// ===== FONCTIONS POUR AFFICHER/MASQUER LES FORMULAIRES =====
function showInscriptionForm() {
    document.getElementById("inscription").style.display = "block";
    document.getElementById("reservation").style.display = "none";
    document.getElementById("inscription").scrollIntoView({ behavior: "smooth" });
}

function showReservationForm() {
    document.getElementById("reservation").style.display = "block";
    document.getElementById("inscription").style.display = "none";
    document.getElementById("reservation").scrollIntoView({ behavior: "smooth" });
}

function hideAllForms() {
    document.getElementById("inscription").style.display = "none";
    document.getElementById("reservation").style.display = "none";
}

// ===== GESTIONNAIRE D'ÉVÉNEMENT POUR LES BOUTONS =====
document.addEventListener("DOMContentLoaded", function() {
  // Bouton Inscription dans la navbar
  const btnInscriptionNav = document.getElementById("btnInscription");
  // Bouton Reservation dans la navbar
  const btnReservationNav = document.getElementById("btnReservationNav");
  // Boutons supplémentaires
  const showInscriptionBtn = document.getElementById("showInscriptionBtn");
  const showReservationBtn = document.getElementById("showReservationBtn");
  
  const inscriptionSection = document.getElementById("inscription");
  const reservationSection = document.getElementById("reservation");

  // Cacher les deux formulaires au départ
  if(inscriptionSection) inscriptionSection.style.display = "none";
  if(reservationSection) reservationSection.style.display = "none";

  // Événement pour le bouton Inscription (navbar)
  if(btnInscriptionNav) {
    btnInscriptionNav.addEventListener("click", function(e) {
      e.preventDefault();
      showInscriptionForm();
    });
  }

  // Événement pour le bouton Réservation (navbar)
  if(btnReservationNav) {
    btnReservationNav.addEventListener("click", function(e) {
      e.preventDefault();
      showReservationForm();
    });
  }

  // Événement pour le bouton S'inscrire (supplémentaire)
  if(showInscriptionBtn) {
    showInscriptionBtn.addEventListener("click", function() {
      showInscriptionForm();
    });
  }

  // Événement pour le bouton Réservation (supplémentaire)
  if(showReservationBtn) {
    showReservationBtn.addEventListener("click", function() {
      showReservationForm();
    });
  }

  // Remplir le select des salles
  let select = document.getElementById("salleSelect");
  if (select) {
    salles.forEach(s => {
      select.innerHTML += `<option>${s.nom}</option>`;
    });
  }

  // Initialiser l'affichage des salles
  render(salles);
  updateTable();
});

// ===== RECHERCHE GLOBALE =====
function searchSalle(val) {
  let filtered = salles.filter(s => 
    s.nom.toLowerCase().includes(val.toLowerCase())
  );
  render(filtered);
}

// ===== SELECT SALLE =====
function selectSalle(nom) {
  let select = document.getElementById("salleSelect");
  if (select) {
    select.value = nom;
    showReservationForm(); // Afficher le formulaire de réservation
  }
}

// ===== GESTIONNAIRE POUR LE FORMULAIRE D'INSCRIPTION =====
document.addEventListener("DOMContentLoaded", function() {
  const formInscription = document.getElementById("formInscription");
  if (formInscription) {
    formInscription.addEventListener("submit", function(e) {
      e.preventDefault();
      
      let nom = document.getElementById("nomInscription").value.trim();
      let email = document.getElementById("emailInscription").value.trim();
      let password = document.getElementById("passwordInscription").value;
      let confirmPassword = document.getElementById("confirmPassword").value;
      
      // Validation
      if (!nom || !email || !password || !confirmPassword) {
        showAlert("Veuillez remplir tous les champs", "danger");
        return;
      }
      
      if (password !== confirmPassword) {
        showAlert("Les mots de passe ne correspondent pas", "danger");
        return;
      }
      
      if (password.length < 6) {
        showAlert("Le mot de passe doit contenir au moins 6 caractères", "danger");
        return;
      }
      
      // Vérifier si l'email existe déjà
      if (utilisateurs.some(u => u.email === email)) {
        showAlert("Cet email est déjà utilisé", "danger");
        return;
      }
      
      // Ajouter l'utilisateur
      utilisateurs.push({ nom, email, password });
      
      // Réinitialiser le formulaire
      document.getElementById("nomInscription").value = "";
      document.getElementById("emailInscription").value = "";
      document.getElementById("passwordInscription").value = "";
      document.getElementById("confirmPassword").value = "";
      
      showAlert(`✅ Inscription réussie ! Bienvenue ${nom}`, "success");
      
      // Optionnel : masquer le formulaire après inscription
      setTimeout(() => {
        document.getElementById("inscription").style.display = "none";
      }, 2000);
    });
  }
});

// ===== GESTIONNAIRE POUR LE FORMULAIRE DE RÉSERVATION AVEC CONFLIT =====
document.addEventListener("DOMContentLoaded", function() {
  const formRes = document.getElementById("formRes");
  if (formRes) {
    formRes.addEventListener("submit", function(e) {
      e.preventDefault();

      let select = document.getElementById("salleSelect");
      let date = document.getElementById("date");
      let heure = document.getElementById("heure");
      let nomReservant = document.getElementById("nomReservant");

      if (!select || !date || !heure || !nomReservant) return;

      let salle = select.value;
      let dateVal = date.value;
      let heureVal = heure.value;
      let nom = nomReservant.value.trim();

      // Validation des champs
      if (!salle || !dateVal || !heureVal || !nom) {
        showAlert("Veuillez remplir tous les champs", "danger");
        return;
      }

      // Vérification des conflits
      if (verifierConflit(salle, dateVal, heureVal)) {
        showAlert(`❌ Conflit : La salle "${salle}" est déjà réservée le ${dateVal} à ${heureVal}.`, "danger");
        return;
      }

      // Ajout de la réservation
      let reservation = { 
        salle, 
        date: dateVal, 
        heure: heureVal,
        reservant: nom,
        dateReservation: new Date().toLocaleString()
      };
      
      historique.push(reservation);
      updateTable();

      // Réinitialiser les champs
      date.value = "";
      heure.value = "";
      nomReservant.value = "";

      showAlert(`✅ Réservation confirmée : ${salle} le ${dateVal} à ${heureVal}`, "success");
      
      // Optionnel : masquer le formulaire après réservation
      setTimeout(() => {
        document.getElementById("reservation").style.display = "none";
      }, 2000);
    });
  }
});

// ===== TABLE HISTORIQUE =====
function updateTable() {
  let table = document.getElementById("historiqueTable");
  if (!table) return;
  table.innerHTML = "";

  if (historique.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">Aucune réservation pour le moment</td>
      </tr>
    `;
    return;
  }

  historique.forEach((r, i) => {
    table.innerHTML += `
    <tr>
      <td>${r.salle}</td>
      <td>${r.date}</td>
      <td>${r.heure}</td>
      <td>${r.reservant}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteRes(${i})">
          Annuler
        </button>
       </td>
    </tr>`;
  });
}

// ===== ANNULATION =====
function deleteRes(i) {
  const reservation = historique[i];
  historique.splice(i, 1);
  updateTable();
  showAlert(`✅ Réservation annulée : ${reservation.salle} le ${reservation.date} à ${reservation.heure}`, "success");
}
