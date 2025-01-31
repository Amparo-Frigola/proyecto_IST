
/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["corazones", "picas", "rombos", "treboles"];
	
// Array de número de cartas
numeros = ["as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jota", "reina", "rey"];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
//let numeros = [10, "jota", "reina", "rey"];

// paso (top y left) en pixeles de una carta a la anterior en un mazo
let paso = 3;

// Tapetes				
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial   = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial     = document.getElementById("cont_inicial");
let cont_sobrantes   = document.getElementById("cont_sobrantes");
let cont_receptor1   = document.getElementById("cont_receptor1");
let cont_receptor2   = document.getElementById("cont_receptor2");
let cont_receptor3   = document.getElementById("cont_receptor3");
let cont_receptor4   = document.getElementById("cont_receptor4");
let cont_movimientos = document.getElementById("cont_movimientos");

// Tiempo
let cont_tiempo  = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos 	   = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

			
// Rutina asociada a botón reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego debería comenzar al cargar la página: no se debe esperar a pulsar el botón de Reiniciar
/* !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!!!!! */
comenzar_juego();
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// Desarrollo del comienzo de juego
function comenzar_juego() {

	/* Crear el mazo inicial con toda la baraja. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazo_inicial. 
	*/

	/* !!!!!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! */	
	
	// Se asegura de que el mazo inicial está vacío	
	mazo_inicial = [];
	
	// Recorre las posibles combinaciones de número y palo, generando los src e ID de imagen
	for (var i = 0; i < palos.length; i++)  // 'filas'
	{
		for (var j = 0; j < numeros.length; j++)  // 'columnas'
		{
			let carta = document.createElement("img");

			// src se genera según la estructura de carpetas donde están las imágenes
			carta.setAttribute("src", "img/baraja/" + numeros[j] + "-" + palos[i] + ".png");

			// id generado identificando la carta que es (número y palo)
			carta.setAttribute("id", numeros[j] + "-" + palos[i]);

			// datos del programador
			carta.setAttribute("data-palo", palos[i]);
			carta.setAttribute("data-nombre", numeros[j]);

			// color según palo
			if (palos[i] == "corazones" || palos[i] == "rombos") {
				carta.setAttribute("data-color", "rojo");
			} else {
				carta.setAttribute("data-color", "negro");
			}

			// push al vector
			mazo_inicial.push(carta);
		}
	}
	// A la salida de los bucles tenemos un vector de palos.length * numeros.length 
	// posiciones con elementos imagen con el src e id correspondiente

	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
	

	// Barajar
	barajar(mazo_inicial);

	// Dejar mazo_inicial en tapete inicial
	cargar_tapete_inicial(mazo_inicial);

	// Puesta a cero de contadores de mazos
	set_contador(cont_inicial, mazo_inicial.length);
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);
			
	// Arrancar el conteo de tiempo
	arrancar_tiempo();

} // comenzar_juego






/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
		00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

function arrancar_tiempo(){ // Ya completamente implementado: estúdiese
	if (temporizador) clearInterval(temporizador);

	let hms = function (){
	let seg = Math.trunc( segundos % 60 );
	let min = Math.trunc( (segundos % 3600) / 60 );
	let hor = Math.trunc( (segundos % 86400) / 3600 );
	let tiempo =  ( (hor<10)? "0"+hor : ""+hor ) 
			+ ":" + ( (min<10)? "0"+min : ""+min )  
			+ ":" + ( (seg<10)? "0"+seg : ""+seg );
	set_contador(cont_tiempo, tiempo);
	segundos++;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000); // hms() será invocado cada segundo               	
} // arrancar_tiempo

		



		
/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido 
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/
function barajar(mazo) {
	/* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
	
	for (var i = 0; i < mazo.length; i++)  //
	{
		let j = Math.floor(Math.random() * mazo.length);
		let aux = mazo[i];
		mazo[i] = mazo[j];
		mazo[j] = aux;
	}

	// no hace falta devolver nada, se trabaja por referencia.

	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
} // barajar


		
/**
	En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos de DOM todos los elementos <img> del array mazo actual.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(mazo) {
	/* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	

	for (var i = 0; i < mazo.length; i++)  //
	{
		// Ajustes de posición
		mazo[i].style.width = "50px";
		mazo[i].style.position = "absolute";
		mazo[i].style.top = i * paso + "px";  // cambiado de 5 a 3 píxeles para que no salga del tapete
		mazo[i].style.left = mazo[i].style.top;  // misma posición horizontal y vertical

		tapete_inicial.appendChild(mazo[i]);  // creación del objeto html en el tapete
	}

	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */	
} // cargar_tapete_inicial


/**
	Esta función debe incrementar el número correspondiente al contenido textual
	del elemento que actúa de contador
*/
function inc_contador(contador){
	contador.innerHTML = +contador.innerHTML + 1; // Obsérvese el operador + antes de contador.innerHTML
} // inc_contador


/**
	Idem que anterior, pero decrementando 
*/
function dec_contador(contador){
	/* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
	contador.innerHTML = +contador.innerHTML - 1;
	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */	
} // dec_contador



/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function set_contador(contador, valor) {
	/* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */
	contador.innerHTML = valor;
	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */	
} // set_contador


