const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');
const btnEncriptar = document.getElementById('encriptar');
const btnDesencriptar = document.getElementById('desencriptar');
const resultado = document.getElementById('resultado');
const resultadoDes = document.getElementById('resultadoDesencriptado');
const info = document.getElementById('info');

// Mostrar tu información
const hoy = new Date().toLocaleDateString();
info.textContent = `Gael Magaña Chan - 1A - ${hoy}`;

// Actualizar contador
mensaje.addEventListener('input', () => {
    charCount.textContent = `${mensaje.value.length}/30`;
    mostrarMatrizMensaje();
});

// Mostrar matriz del mensaje
function mostrarMatrizMensaje() {
    let texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (texto.length === 0) {
        matrizMensaje.textContent = "Escribe un mensaje primero…";
        return;
    }

    let valores = texto.split('').map(c => c.charCodeAt(0) - 65);

    if (valores.length % 2 !== 0) valores.push(23); // X

    let salida = '[';
    for (let i = 0; i < valores.length; i += 2) {
        salida += `[${valores[i]}, ${valores[i + 1]}] `;
    }
    salida += ']';

    matrizMensaje.textContent = salida;
}

// Encriptar
btnEncriptar.addEventListener('click', () => {
    const key = [
        [parseInt(k11.value), parseInt(k12.value)],
        [parseInt(k21.value), parseInt(k22.value)]
    ];

    if (key.flat().some(isNaN)) {
        resultado.textContent = "Error: Llena la matriz clave";
        return;
    }

    let texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (texto.length === 0) {
        resultado.textContent = "Error: No hay mensaje";
        return;
    }

    let det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
    if (det === 0) {
        resultado.textContent = "Error: La matriz NO es invertible";
        return;
    }

    let numeros = texto.split('').map(c => c.charCodeAt(0) - 65);
    if (numeros.length % 2 !== 0) numeros.push(23);

    let salida = "";
    for (let i = 0; i < numeros.length; i += 2) {
        let x = numeros[i], y = numeros[i + 1];
        let c1 = (key[0][0] * x + key[0][1] * y) % 26;
        let c2 = (key[1][0] * x + key[1][1] * y) % 26;
        salida += String.fromCharCode(65 + c1);
        salida += String.fromCharCode(65 + c2);
    }

    resultado.textContent = salida;
});

// Desencriptar
btnDesencriptar.addEventListener('click', () => {
    let texto = resultado.textContent.trim();

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

    let adj = [
        [key[1][1], -key[0][1]],
        [-key[1][0], key[0][0]]
    ];

    adj = adj.map(row => row.map(v => (v % 26 + 26) % 26));

    let inv = [
        [(adj[0][0] * detInv) % 26, (adj[0][1] * detInv) % 26],
        [(adj[1][0] * detInv) % 26, (adj[1][1] * detInv) % 26]
    ];

    let nums = texto.split('').map(c => c.charCodeAt(0) - 65);
    let salida = "";

    for (let i = 0; i < nums.length; i += 2) {
        let c1 = nums[i], c2 = nums[i + 1];
        let p1 = (inv[0][0] * c1 + inv[0][1] * c2) % 26;
        let p2 = (inv[1][0] * c1 + inv[1][1] * c2) % 26;
        salida += String.fromCharCode(65 + p1);
        salida += String.fromCharCode(65 + p2);
    }

    // ---- CORRECCIÓN: quitar la X SOLO si fue padding ----
    // Si el campo de mensaje original (textarea #mensaje) tiene longitud impar,
    // entonces el encriptado añadió una 'X' de padding y podemos eliminarla.
    // Si el textarea está vacío (por ejemplo el usuario lo borró), NO la quitamos.
    try {
        const originalLen = mensaje.value.length;
        if (originalLen > 0 && originalLen % 2 === 1 && salida.endsWith("X")) {
            salida = salida.slice(0, -1);
        }
    } catch (e) {
        // Si por algún motivo no podemos leer el textarea, no hacemos nada.
    }

    resultadoDes.textContent = salida;
});


    // Mod 26 correcto
    adj = adj.map(row => row.map(v => (v % 26 + 26) % 26));

    let inv = [
        [(adj[0][0] * detInv) % 26, (adj[0][1] * detInv) % 26],
        [(adj[1][0] * detInv) % 26, (adj[1][1] * detInv) % 26]
    ];

    let nums = texto.split('').map(c => c.charCodeAt(0) - 65);

    let salida = "";
    for (let i = 0; i < nums.length; i += 2) {
        let c1 = nums[i], c2 = nums[i + 1];
        let p1 = (inv[0][0] * c1 + inv[0][1] * c2) % 26;
        let p2 = (inv[1][0] * c1 + inv[1][1] * c2) % 26;
        salida += String.fromCharCode(65 + p1);
        salida += String.fromCharCode(65 + p2);
    }

    resultadoDes.textContent = salida;

// Inverso modular
function inversoModulo(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++)
        if ((a * x) % m === 1) return x;
    return -1;
}
