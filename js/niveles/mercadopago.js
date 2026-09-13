// ============================================
// MERCADO PAGO — Links por nivel, bundle y libre
// ============================================
// ⚠️ REEMPLAZA los "https://mpago.la/XXXX" por tus links reales
// Crea cada link en: https://www.mercadopago.com.mx/tools/receive-money
// Configura redirección a:
//   https://marcorojas17.github.io/YEJIDA-ASTRO-2036/niveles.html?nivel=X&ok=1
// ============================================

export const MP_LINKS = {
  1: "https://mpago.la/XXXXX1",   // $10  - Semilla Estelar
  2: "https://mpago.la/XXXXX2",   // $15  - Raíz Lunar
  3: "https://mpago.la/XXXXX3",   // $20  - Luna Creciente
  4: "https://mpago.la/XXXXX4",   // $25  - Mercurio Místico
  5: "https://mpago.la/XXXXX5",   // $30  - Venus Felina
  6: "https://mpago.la/XXXXX6",   // $35  - Sol Radiante
  7: "https://mpago.la/XXXXX7",   // $40  - Marte Guerrero
  8: "https://mpago.la/XXXXX8",   // $45  - Júpiter Sabio
  9: "https://mpago.la/XXXXX9"    // $50  - Saturno Maestro
};

export const MP_BUNDLES = {
  iniciado: "https://mpago.la/BUNDLE1",  // $25  - Niveles 1+2+3
  mistico:  "https://mpago.la/BUNDLE2",  // $50  - Niveles 4+5+6
  maestro:  "https://mpago.la/BUNDLE3",  // $90  - Niveles 7+8+9
  total:    "https://mpago.la/BUNDLE4"   // $150 - Los 9 niveles
};

export const MP_LIBRE = {
  10:  "https://mpago.la/LIBRE10",
  20:  "https://mpago.la/LIBRE20",
  50:  "https://mpago.la/LIBRE50",
  100: "https://mpago.la/LIBRE100",
  200: "https://mpago.la/LIBRE200"
};

export const NIVELES_INFO = {
  0: { nombre: "Semilla",         precio: 0,   emoji: "🌱" },
  1: { nombre: "Semilla Estelar", precio: 10,  emoji: "🌱" },
  2: { nombre: "Raíz Lunar",      precio: 15,  emoji: "🌙" },
  3: { nombre: "Luna Creciente",  precio: 20,  emoji: "☀️" },
  4: { nombre: "Mercurio Místico",precio: 25,  emoji: "💫" },
  5: { nombre: "Venus Felina",    precio: 30,  emoji: "💞" },
  6: { nombre: "Sol Radiante",    precio: 35,  emoji: "🌟" },
  7: { nombre: "Marte Guerrero",  precio: 40,  emoji: "🔥" },
  8: { nombre: "Júpiter Sabio",   precio: 45,  emoji: "💎" },
  9: { nombre: "Saturno Maestro", precio: 50,  emoji: "👑" }
};

// Abre el link de pago del nivel en nueva pestaña
export function abrirPagoNivel(nivel) {
  const url = MP_LINKS[nivel];
  if (!url || url.includes("XXXX")) {
    alert(`⚠️ El link del Nivel ${nivel} aún no está configurado.\n\nEdita js/niveles/mercadopago.js y pega tu link real de Mercado Pago.`);
    return;
  }
  window.open(url, "_blank", "noopener");
}

// Abre el link del bundle
export function abrirPagoBundle(nombre) {
  const url = MP_BUNDLES[nombre];
  if (!url || url.includes("BUNDLE")) {
    alert(`⚠️ El link del bundle "${nombre}" aún no está configurado.\n\nEdita js/niveles/mercadopago.js.`);
    return;
  }
  window.open(url, "_blank", "noopener");
}

// Abre el link de donación libre
export function abrirPagoLibre(monto) {
  const url = MP_LIBRE[monto];
  if (!url || url.includes("LIBRE")) {
    alert(`⚠️ El link de donación de $${monto} aún no está configurado.\n\nEdita js/niveles/mercadopago.js.`);
    return;
  }
  window.open(url, "_blank", "noopener");
}

// Devuelve toda la info de un nivel
export function infoNivel(nivel) {
  return NIVELES_INFO[nivel] || NIVELES_INFO[0];
}
