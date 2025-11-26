/* === ELEMENTOS === */
const resultado = document.getElementById('resultado');
const resultadoDes = document.getElementById('resultadoDesencriptado');
const info = document.getElementById('info');
const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');
const btnEncriptar = document.getElementById('encriptar');
const btnDesencriptar = document.getElementById('desencriptar');

/* === INFO AUTOMÁTICA === */
info.textContent = `Gael Magaña Chan - 1A - ${new Date().toLocaleDateString()}`;

/* === CONTADOR === */
mensaje.addEventListener('input', () => {
  charCount.textContent = `${mensaje.value.length}/30`;
  mostrarMatrizMensaje();
});

/* === MATRIZ DEL MENSAJE === */
function mostrarMatrizMensaje() {
  let texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, "");

  if (texto.length === 0) {
    matrizMensaje.textContent = "Escribe un mensaje primero…";
    return;
  }

  let valores = texto.split('').map(c => c.charCodeAt(0) - 65);

  if (valores.length % 2 !== 0) valores.push(23);

  let salida = '[';
  for (let i = 0; i < valores.length; i += 2) {
    salida += `[${valores[i]}, ${valores[i+1]}] `;
  }
  salida += ']';

  matrizMensaje.textContent = salida;
}

/* === ENCRIPTAR === */
btnEncriptar.addEventListener('click', () => {

  const key = [
    [parseInt(k11.value), parseInt(k12.value)],
    [parseInt(k21.value), parseInt(k22.value)]
  ];

  if (key.flat().some(isNaN)) {
    resultado.textContent = "Error: Llena la matriz clave";
    return;
  }

  let texto = mensaje.value.toUpperCase();
  if (texto.length === 0) {
    resultado.textContent = "Error: No hay mensaje";
    return;
  }

  // Guardar posiciones de espacios
  let posicionesEspacios = [];
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === " ") posicionesEspacios.push(i);
  }

  // Quitar espacios para operar
  let limpio = texto.replace(/ /g, "");
  let nums = limpio.split("").map(c => c.charCodeAt(0) - 65);

  if (nums.length % 2 !== 0) nums.push(23);

  let enc = "";

  for (let i = 0; i < nums.length; i += 2) {
    let x = nums[i];
    let y = nums[i + 1];

    let c1 = (key[0][0] * x + key[0][1] * y) % 26;
    let c2 = (key[1][0] * x + key[1][1] * y) % 26;

    enc += String.fromCharCode(65 + c1);
    enc += String.fromCharCode(65 + c2);
  }

  // Restaurar espacios
  let encFinal = enc.split("");
  posicionesEspacios.forEach(pos => encFinal.splice(pos, 0, " "));

  resultado.textContent = encFinal.join("");
});

/* === DESENCRIPTAR === */
btnDesencriptar.addEventListener('click', () => {

  let texto = resultado.textContent;
  if (texto.length === 0) {
    resultadoDes.textContent = "Error: No hay texto encriptado";
    return;
  }

  const key = [
    [parseInt(k11.value), parseInt(k12.value)],
    [parseInt(k21.value), parseInt(k22.value)]
  ];

  let det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
  if (det < 0) det += 26;

  let detInv = inversoModulo(det, 26);
  if (detInv === -1) {
    resultadoDes.textContent = "Error: La matriz NO es invertible";
    return;
  }

  // adjunta
  let adj = [
    [key[1][1], -key[0][1]],
    [-key[1][0], key[0][0]]
  ].map(row => row.map(v => (v % 26 + 26) % 26));

  // inversa
  let inv = [
    [(adj[0][0] * detInv) % 26, (adj[0][1] * detInv) % 26],
    [(adj[1][0] * detInv) % 26, (adj[1][1] * detInv) % 26]
  ];

  // Guardar espacios
  let posicionesEspacios = [];
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === " ") posicionesEspacios.push(i);
  }

  // Quitar espacios
  let limpio = texto.replace(/ /g, "");
  let nums = limpio.split("").map(c => c.charCodeAt(0) - 65);

  let dec = "";

  for (let i = 0; i < nums.length; i += 2) {
    let p1 = (inv[0][0] * nums[i] + inv[0][1] * nums[i+1]) % 26;
    let p2 = (inv[1][0] * nums[i] + inv[1][1] * nums[i+1]) % 26;

    dec += String.fromCharCode(65 + p1);
    dec += String.fromCharCode(65 + p2);
  }

  // Recortar padding
  let letrasOriginales = mensaje.value.replace(/ /g, "").length;
  dec = dec.slice(0, letrasOriginales);

  // Restaurar espacios
  let final = dec.split("");
  posicionesEspacios.forEach(pos => final.splice(pos, 0, " "));

  resultadoDes.textContent = final.join("");
});

/* === INVERSO MODULAR == */
function inversoModulo(a, m) {
  a = (a % m + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return -1;
}
