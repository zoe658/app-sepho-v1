function generer() {
  const prompt = document.getElementById("prompt").value;
  const resultat = document.getElementById("resultat");
  const loading = document.getElementById("loading");
  const bouton = document.getElementById("btn");

  if (!prompt.trim()) {
    resultat.innerText = "Écris d'abord une demande.";
    return;
  }

  bouton.disabled = true;
  loading.style.display = "block";
  resultat.innerHTML = "";

  fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: prompt })
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      bouton.disabled = false;
      loading.style.display = "none";

      if (!data.result) {
        resultat.innerText = "Aucun résultat reçu.";
        return;
      }

      resultat.innerHTML = formaterTexte(data.result);
    })
    .catch(function () {
      bouton.disabled = false;
      loading.style.display = "none";
      resultat.innerText = "Erreur serveur";
    });
}

function formaterTexte(texte) {
  return texte
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/### (.*?)\n/g, "<h3>$1</h3>")
    .replace(/\n/g, "<br>");
}

function copier() {
  const texte = document.getElementById("resultat").innerText;

  if (!texte) {
    return;
  }

  navigator.clipboard.writeText(texte);
}

function resetForm() {
  document.getElementById("prompt").value = "";
  document.getElementById("resultat").innerHTML = "";
  document.getElementById("loading").style.display = "none";
  document.getElementById("btn").disabled = false;
}