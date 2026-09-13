// ============================================
// TRACKER — Desbloqueo de niveles por URL
// ============================================
// Flujo:
//   1. Usuario paga en Mercado Pago
//   2. MP lo redirige a niveles.html?nivel=3&ok=1
//   3. Este módulo lee la URL y guarda el nivel en localStorage
//   4. Los niveles <= actual se marcan como desbloqueados
// ============================================

import { infoNivel } from "./mercadopago.js";

const KEY_NIVEL    = "yejida_nivel";
const KEY_FECHA    = "yejida_ultima_donacion";
const KEY_HISTORIAL = "yejida_historial";

// Lee ?nivel=X&ok=1 y desbloquea
export function checkPago() {
  const params = new URLSearchParams(location.search);
  const nivel  = parseInt(params.get("nivel"));
  const ok     = params.get("ok");
  const cancel = params.get("cancel");

  if (ok === "1" && nivel >= 1 && nivel <= 9) {
    const actual = getNivelActual();
    if (nivel > actual) {
      setNivelActual(nivel);
      agregarHistorial(nivel);
      mostrarBendicion(nivel);
    }
    history.replaceState({}, "", location.pathname);
  }

  if (cancel === "1") {
    mostrarMensaje("😿 No pasa nada. Los gatitos te esperan cuando quieras 🐱");
    history.replaceState({}, "", location.pathname);
  }
}

// Obtiene el nivel actual del usuario
export function getNivelActual() {
  return parseInt(localStorage.getItem(KEY_NIVEL) || "0");
}

// Guarda el nivel actual
export function setNivelActual(n) {
  localStorage.setItem(KEY_NIVEL, n);
  localStorage.setItem(KEY_FECHA, new Date().toISOString());
}

// Historial de donaciones
function agregarHistorial(nivel) {
  const hist = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || "[]");
  hist.push({ nivel, fecha: new Date().toISOString() });
  localStorage.setItem(KEY_HISTORIAL, JSON.stringify(hist));
}

export function getHistorial() {
  return JSON.parse(localStorage.getItem(KEY_HISTORIAL) || "[]");
}

// Muestra la bendición al desbloquear
function mostrarBendicion(nivel) {
  const info = infoNivel(nivel);
  const overlay = document.createElement("div");
  overlay.className = "bendicion-overlay";
  overlay.innerHTML = `
    <div class="bendicion-card">
      <div class="bendicion-emoji">${info.emoji}</div>
      <h2>✦ ¡Desbloqueado! ✦</h2>
      <p class="bendicion-nivel">Nivel ${nivel} · ${info.nombre}</p>
      <p class="bendicion-gatito">🐱 Has alimentado gatitos con tu aporte</p>
      <p class="bendicion-mensaje">
        "Cuando tú agarras un poco de la esencia,<br>
        tú la tienes en su totalidad."
        <br><em>— Baal Shem Tov</em>
      </p>
      <button class="btn btn-primario" onclick="this.closest('.bendicion-overlay').remove()">
        Continuar mi viaje ✦
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Inyecta estilos del overlay
  if (!document.getElementById("bendicion-estilos")) {
    const style = document.createElement("style");
    style.id = "bendicion-estilos";
    style.textContent = `
      .bendicion-overlay {
        position: fixed;
        inset: 0;
        background: rgba(5, 5, 15, 0.92);
        backdrop-filter: blur(14px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1.5rem;
        animation: fadeIn 0.4s ease;
      }
      .bendicion-card {
        max-width: 480px;
        width: 100%;
        background: linear-gradient(135deg, rgba(18,18,42,0.95), rgba(201,162,39,0.12));
        border: 2px solid #c9a227;
        border-radius: 24px;
        padding: 3rem 2rem;
        text-align: center;
        box-shadow: 0 0 60px rgba(201, 162, 39, 0.5);
        animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .bendicion-emoji {
        font-size: 5rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 25px rgba(255, 183, 3, 0.8));
        animation: pulso 2s ease-in-out infinite;
      }
      .bendicion-card h2 {
        font-family: var(--fuente-t, Georgia, serif);
        font-size: 2rem;
        color: #ffb703;
        margin-bottom: 1rem;
        text-shadow: 0 0 25px rgba(255, 183, 3, 0.6);
      }
      .bendicion-nivel {
        font-family: var(--fuente-t, Georgia, serif);
        font-size: 1.4rem;
        color: #c9a227;
        margin-bottom: 0.75rem;
      }
      .bendicion-gatito {
        color: #90be6d;
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
      .bendicion-mensaje {
        color: var(--texto-2, #a8a8c5);
        font-style: italic;
        font-size: 0.95rem;
        margin-bottom: 2rem;
        line-height: 1.7;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Muestra mensaje suave (cancelación)
function mostrarMensaje(msg) {
  const div = document.createElement("div");
  div.className = "aviso-suave";
  div.textContent = msg;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #c9a227, #ffb703);
    color: #0a0a1a;
    padding: 12px 24px;
    border-radius: 999px;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(255, 183, 3, 0.5);
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  `;
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transition = "opacity 0.5s";
    setTimeout(() => div.remove(), 500);
  }, 3500);
}

// Pinta los niveles desbloqueados en la página
export function pintarNiveles() {
  const actual = getNivelActual();

  // Actualiza la barra de progreso general
  const barra = document.getElementById("progresoBarra");
  const texto = document.getElementById("progresoTexto");
  if (barra) barra.style.width = (actual / 9 * 100) + "%";
  if (texto) {
    texto.textContent = actual === 0
      ? "Nivel 0 de 9 · Empieza gratis 🌱"
      : `Nivel ${actual} de 9 · ${infoNivel(actual).emoji} ${infoNivel(actual).nombre}`;
  }

  // Marca cada card de nivel
  document.querySelectorAll(".nivel-card").forEach(card => {
    const n = parseInt(card.dataset.nivel);
    const btn = card.querySelector(".btn-donar");

    if (n <= actual) {
      card.classList.add("desbloqueado");
      if (btn) {
        btn.textContent = "✅ Desbloqueado";
        btn.classList.add("desbloqueado");
        btn.removeAttribute("href");
      }
    } else if (n === actual + 1) {
      card.style.borderColor = "#ffb703";
      if (btn) {
        btn.textContent = `🔓 Desbloquear por $${infoNivel(n).precio}`;
      }
    }
  });
}

// Puntos / huellitas estelares
export function sumarPuntos(cantidad) {
  const actuales = parseInt(localStorage.getItem("yejida_puntos") || "0");
  localStorage.setItem("yejida_puntos", actuales + cantidad);
}

// Racha diaria
export function actualizarRacha() {
  const hoy = new Date().toDateString();
  const ultima = localStorage.getItem("yejida_racha_fecha");
  let racha = parseInt(localStorage.getItem("yejida_racha") || "0");

  if (ultima === hoy) return racha;

  const ayer = new Date(Date.now() - 86400000).toDateString();
  racha = (ultima === ayer) ? racha + 1 : 1;

  localStorage.setItem("yejida_racha", racha);
  localStorage.setItem("yejida_racha_fecha", hoy);
  return racha;
}
