// Initialiser AOS pour les animations de défilement après le chargement du contenu
document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
});

// Masquer le loader une fois la page chargée
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
});

// Définir la date cible pour le compte à rebours (1er février 2025 à 6h00)
const targetDate = new Date("February 1, 2025 06:00:00").getTime();

// Mettre à jour le compte à rebours chaque seconde
const countdownFunction = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  // Calculer le temps restant
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Afficher les résultats
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (daysElement && hoursElement && minutesElement && secondsElement) {
    daysElement.innerText = days < 10 ? "0" + days : days;
    hoursElement.innerText = hours < 10 ? "0" + hours : hours;
    minutesElement.innerText = minutes < 10 ? "0" + minutes : minutes;
    secondsElement.innerText = seconds < 10 ? "0" + seconds : seconds;
  }

  // Si le compte à rebours est terminé
  if (distance < 0) {
    clearInterval(countdownFunction);
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
      countdownElement.innerHTML = "<h2 data-i18n='Le Challenge 21 a commencé !'>Le Challenge 21 a commencé !</h2>";
    }
    const launchButton = document.getElementById("launchButton");
    if (launchButton) {
      launchButton.style.display = "block";
    }
    translatePage(); // Traduire le nouveau contenu
  }
}, 1000);

// Initialiser particles.js avec des particules vertes
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#28a745"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false
    },
    "size": {
      "value": 3,
      "random": true
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#28a745",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      }
    },
    "modes": {
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      }
    }
  },
  "retina_detect": true
});

// Ajouter la classe 'scrolled' à la navbar lors du défilement
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('nav');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Fonction de traduction
function translatePage(lang = null) {
  let selectedLang = lang || localStorage.getItem('selectedLang') || navigator.language.slice(0, 2);

  // Liste des langues supportées
  const supportedLangs = ['en', 'fr']; // Ajoutez d'autres codes de langue si nécessaire

  // Si la langue n'est pas supportée, utiliser le français par défaut
  if (!supportedLangs.includes(selectedLang)) {
    selectedLang = 'fr';
  }

  console.log(`Langue sélectionnée : ${selectedLang}`);

  // Charger le fichier JSON de la langue sélectionnée
  fetch(`lang/${selectedLang}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Impossible de charger le fichier de langue: ${selectedLang}.json`);
      }
      return response.json();
    })
    .then(translations => {
      console.log(`Traductions chargées pour ${selectedLang}:`, translations);
      const elems = document.querySelectorAll('[data-i18n]');
      elems.forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        // Vérifier si la clé existe dans les traductions
        if (translations[key]) {
          if (elem.tagName.toLowerCase() === 'meta') {
            elem.setAttribute('content', translations[key]);
          } else {
            elem.innerHTML = translations[key];
          }
          // Mettre à jour l'attribut 'data-text' si nécessaire
          if (elem.hasAttribute('data-text')) {
            elem.setAttribute('data-text', translations[key]);
          }
        } else {
          // Si la traduction est manquante, utiliser le texte par défaut
          if (elem.tagName.toLowerCase() !== 'meta') {
            elem.innerHTML = key;
          }
          if (elem.hasAttribute('data-text')) {
            elem.setAttribute('data-text', key);
          }
        }
      });

      // Mettre à jour l'attribut 'lang' de la balise HTML
      document.documentElement.lang = selectedLang;

      // Stocker la langue sélectionnée
      localStorage.setItem('selectedLang', selectedLang);
    })
    .catch(error => {
      console.error(`Erreur lors du chargement du fichier de langue ${selectedLang}:`, error);
      // Gérer l'erreur (par exemple, afficher un message ou utiliser une langue par défaut)
    });
}

// Exécuter la fonction de traduction une fois le contenu chargé
document.addEventListener('DOMContentLoaded', () => {
  translatePage();

  // Gérer le clic sur les options de langue
  const languageSelectors = document.querySelectorAll('.language-select');
  languageSelectors.forEach(selector => {
    selector.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = e.currentTarget.getAttribute('data-lang');
      console.log(`Langue sélectionnée via le sélecteur : ${selectedLang}`);
      translatePage(selectedLang);
    });
  });

  // Empêcher le changement de curseur sur les éléments du timer
  const timerElements = document.querySelectorAll('#countdown .countdown-item, #countdown .countdown-number, #countdown .countdown-label');
  timerElements.forEach(elem => {
    elem.style.cursor = 'default';
  });

  // Fonctionnalité pour le bouton 'En lire plus'
  const readMoreButton = document.getElementById('readMoreButton');
  const readMoreSection = document.getElementById('readMoreSection');
  const readMoreContent = document.getElementById('readMoreContent');
  const backButton = document.getElementById('backButton');
  const mainContent = document.querySelector('.main-content');

  // Contenu du texte (converti en HTML)
  const contentHTML = `
    <!-- Votre contenu HTML ici -->
    <h2>👋 Bienvenue dans la communauté Challenge 21 !</h2>
    <p><em>Veuillez noter : Challenge 21 est un projet en cours. La présentation ci-dessous décrit les fonctionnalités et caractéristiques finales envisagées.</em></p>
    <p>Je suis ravi de vous présenter notre prochaine <strong>application</strong>, spécifiquement conçue pour vous aider à <strong>prendre le contrôle de vos habitudes</strong> et à transformer votre quotidien. Voici un aperçu de ce que vous pouvez attendre de cette application innovante :</p>
    <hr>
    <h3>🔄 Prenez le contrôle de vos habitudes en 21 jours</h3>
    <p>Saviez-vous qu'il ne faut que <strong>21 jours</strong> pour adopter ou abandonner une habitude ? Notre application est construite autour de cette idée pour vous offrir une approche <strong>efficace et structurée</strong>. Voici comment cela fonctionne :</p>
    <h4>1. Créez vos routines personnalisées</h4>
    <ul>
      <li>📅 <strong>Routines sur 21 jours</strong> : Créez des routines simples et efficaces que vous pouvez suivre pendant 21 jours pour soit <strong>adopter de nouvelles habitudes</strong>, soit <strong>vous débarrasser des anciennes</strong>.</li>
      <li>💡 <strong>Aide à la création de routines</strong> : Besoin d'inspiration ? Utilisez nos <strong>routines préétablies</strong> adaptées à différents styles de vie et objectifs, que vous pouvez personnaliser selon vos besoins.</li>
    </ul>
    <h4>2. Gérez vos tâches quotidiennes</h4>
    <ul>
      <li>✅ <strong>To-Do List intégrée</strong> : Organisez vos journées avec une liste de tâches séparée, <strong>facile à utiliser</strong> et <strong>rapide à remplir</strong>, pour vous aider à rester <strong>concentré</strong> sur vos objectifs.</li>
    </ul>
    <hr>
    <h3>🎮 Gamification pour une motivation accrue</h3>
    <p>Nous intégrons des <strong>éléments de gamification</strong> pour rendre votre parcours encore plus engageant :</p>
    <ul>
      <li>⚡ <strong>Progression simple et rapide</strong> : Interagissez avec l'application de manière fluide, sans perdre de temps.</li>
      <li>🏅 <strong>Défis quotidiens</strong> : Relevez des défis quotidiens et <strong>gagnez des points</strong> pour chaque tâche accomplie.</li>
    </ul>
    <hr>
    <h3>🎯 Objectifs spécialisés : Adopter ou abandonner une habitude</h3>
    <p>L'application propose également des plans détaillés pour vous aider à :</p>
    <ul>
      <li>🚭 <strong>Abandonner une mauvaise habitude</strong> : Que ce soit la cigarette, la procrastination ou autre, suivez des programmes spécifiques conçus pour vous aider à <strong>vous libérer</strong> de ces comportements.</li>
      <li>🏃 <strong>Adopter une nouvelle habitude</strong> : Commencez à marcher, faites du sport, améliorez votre alimentation, et bien plus encore avec nos <strong>plans personnalisés</strong>.</li>
    </ul>
    <hr>
    <h3>🌐 Un réseau social pour vous connecter et vous motiver</h3>
    <p>Notre objectif est de créer une <strong>véritable communauté</strong> où vous pouvez :</p>
    <ul>
      <li>💬 <strong>Communiquer avec d'autres utilisateurs</strong> : Partagez vos routines, comparez vos progrès et <strong>soutenez-vous mutuellement</strong>.</li>
      <li>🤝 <strong>Défis et compétitions en groupe</strong> : Organisez des compétitions amicales avec vos amis ou rejoignez de grands groupes pour des <strong>défis stimulants</strong>.</li>
      <li>📊 <strong>Classements et mode Ranked</strong> : Participez à des <strong>classements nationaux et mondiaux</strong> pour suivre vos progrès et rester motivé.</li>
    </ul>
    <hr>
    <h3>🔍 Matchmaking intelligent</h3>
    <p>Trouvez des partenaires de routine avec des objectifs similaires grâce à notre <strong>système de matchmaking</strong> :</p>
    <ul>
      <li>🤝 <strong>Ambitions similaires</strong> : Soyez mis en relation avec des personnes ayant des objectifs <strong>compatibles</strong> pour maximiser vos chances de succès.</li>
      <li>🕒 <strong>Défis de 21 jours</strong> : Lancez des défis de 21 jours avec de nouveaux partenaires et <strong>gagnez des points</strong> dans notre système de classement.</li>
    </ul>
    <hr>
    <h3>📈 Partagez vos succès</h3>
    <p>Vous souhaitez montrer vos progrès au monde entier ?</p>
    <ul>
      <li>📱 <strong>Partage sur les réseaux sociaux</strong> : Connectez-vous facilement à d'autres plateformes pour <strong>partager vos réussites</strong> et inspirer votre entourage.</li>
      <li>🔍 <strong>Interface de suivi des progrès</strong> : Visualisez vos progrès et ceux de vos amis grâce à une interface <strong>intuitive et attrayante</strong>.</li>
    </ul>
    <hr>
    <h3>🚀 Rejoignez-nous dès maintenant !</h3>
    <p>Ne laissez plus vos habitudes dicter votre vie. Avec notre application, <strong>prenez le contrôle de votre vie</strong>, un jour à la fois, entouré d'une <strong>communauté motivée et solidaire</strong>. <strong>Téléchargez l'application dès aujourd'hui</strong> et commencez votre transformation !</p>
    <p>Merci de faire partie de <strong>Challenge 21</strong>, et ensemble, créons des <strong>habitudes qui changent la vie</strong> !</p>
    <hr>
    <h3>❓ Vous avez des questions ?</h3>
    <p>N'hésitez pas à <strong>poser toutes vos questions</strong> ou à <strong>partager vos premières impressions</strong> dans le canal dédié. Nous sommes impatients de vous accompagner dans cette aventure vers une <strong>meilleure version de vous-même</strong> !</p>
    <p>✨ <strong>À bientôt sur Challenge 21 !</strong></p>
  `;

  // Gestion de l'affichage de la nouvelle section "En lire plus"
  if (readMoreButton && readMoreSection && backButton && mainContent && readMoreContent) {
    readMoreButton.addEventListener('click', () => {
      // Afficher la section "En lire plus"
      readMoreSection.classList.add('active');
      mainContent.style.display = 'none'; // Masquer le contenu principal
      readMoreContent.innerHTML = contentHTML;
      window.scrollTo(0, 0); // Remonter en haut de la page
    });

    backButton.addEventListener('click', () => {
      // Retour au contenu principal
      readMoreSection.classList.remove('active');
      mainContent.style.display = 'flex'; // Afficher le contenu principal
      window.scrollTo(0, 0); // Remonter en haut de la page
    });
  }

  // Gestion de la bulle de texte existante (speechBubble)
  const speechBubble = document.getElementById('speechBubble');
  if (speechBubble) {
    speechBubble.style.display = 'none'; // Initialement cachée
  }

  // Renommer le bouton "Suivre le projet" en "Rejoindre le Discord" avec l'icône Discord
  const launchButton = document.getElementById('launchButton');
  if (launchButton) {
    launchButton.innerHTML = `<i class="bi bi-discord"></i> Rejoindre le Discord`;
  }
});
