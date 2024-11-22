import { actualizarPuntajeEmpatados,actualizarPuntajePerdidos, 
        actualizarPuntajeGanados } from "./scriptPuntaje.js";

import {mensajeResultado,escojaUnaOpcion, seguroDeseaNuevoJuego} from "./scriptModales.js";

import {calcularYDibujarLineaGanadora, ocultarLineaGanadora} from "./scriptLineaGanador.js"

// checkboxs de la elección del usuario para jugar si es (O) o (X)
const eleccionO = document.getElementById('eleccionO');
const eleccionX = document.getElementById('eleccionX');

//Select de modo de juego 0 => fácil, 1 => medio, 2 => Difícil, 3 => imposible
export const modoJuego = document.getElementById('modoJuego');
//variable que guarda al empezar el juego el valor de modoJuego
let nivel;

// Contenedores secundarios los cuales representan cada una de las posiciones en el triqui
export const contenedoresSecundarios = document.getElementsByClassName('secundario');

//variable de inicio del juego
let jugando = false;

//variable de selección del usuario
let letraUsuario = "Ninguna";

// variable de selección del pc según la del usuario
let letraPc = "Ninguna";

//variable de cada una de las jugadas contando las del usuario y del pc
let jugada = 0;

//variable matriz del tablero de juego
let matrizJuego = [
    ["0","0","0"],
    ["0","0","0"],
    ["0","0","0"]
];
// La ubicación dentro del juego de cada div esta marcada con un id
// de tal forma que la anterior variable seria el equivalente a la siguiente
//     [0,1,2],
//     [3,4,5],
//     [6,7,8]


let columna = 0;
let fila = 0;

//variable para el contenedor que selecciona el usuario o el pc para pintar jugada
let contenedorSeleccionado

//arreglo para la segunda jugada si el usuario elije la posición 4 que es la central
// y también para la cuarta jugada y hacer imposible que el usuario gane
const arregloParaNoDejarGanar = [0,2,6,8];

//arreglo especial para evitar que el usuario gane en modo imposible, cuando su primera jugada es en una esquina
//y la segunda en las casillas 1,7,3 o 5 separada de la primera jugada.
const arregloEspecial = [[1,7],[3,5]];

// variable para saber si el usuario selecciono el centro en la primera jugada
let usuarioCentro = false;

//variable para almacenar las casillas que ya han sido pintadas
let casillasOcupadas = [];

//matriz con las diferentes combinaciones posibles para ganar
const combinacionesGanadoras=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

//arreglo que se va armando según cada una de las combinacionesGanadoras
let arregloAVerificar = ["0","0","0"];

//variables que almacenaran el contenedorInicial y el contenedorFinal de la jugada ganadora
let contenedorInicial;
let contenedorFinal;

//botón para empezar un nuevo juego
const btnNuevoJuego = document.getElementById('nuevoJuego');

//Eventos de escucha para que al seleccionar un checkbox el otro se deseleccione
// y asignación de la elección en la variable letraSeleccion
eleccionO.addEventListener('change',()=>{
    if(eleccionO.checked){
        eleccionX.checked = false;
        letraUsuario = "O";
        letraPc = "X";
    }else{
        letraUsuario = "Ninguna";
    }
    
});

eleccionX.addEventListener('change',()=>{
    if(eleccionX.checked){
        eleccionO.checked = false;
        letraUsuario = "X";
        letraPc = "O";
    }else{
        letraUsuario = "Ninguna";
    }  
});


//evento de escucha de un click en toda la pagina con el fin de:
// poder dibujar la selección del usuario según el contenedor secundario donde se haga click.
// y posteriormente a ello que el programa dibuje su elección (O) o (X)
// la función es asíncrona ya que al modificar el DOM es necesario darle un tiempo para que 
// termine su ejecución y las variables se asignen correctamente
document.addEventListener('click', async function(event){

    //Es necesario usar la siguiente función para evitar que el evento de escucha de un click
    //se propague y genere un doble evento en la escucha de un cambio en el select modo de juego
    event.stopPropagation();

    if(event.target.classList[1] == 'secundario' && !jugando && jugada == 0 ){
        if(letraUsuario != "Ninguna"){
            jugando = true;
            eleccionO.disabled = true;
            eleccionX.disabled = true;
            modoJuego.disabled = true;
            nivel = modoJuego.value;
            window.location.href = "#juego"
        }else{
            escojaUnaOpcion();
        }
            
    }
    
    if(event.target.classList[1] == 'secundario' && jugando ){
        
        contenedorSeleccionado = parseInt(event.target.id);

        // confirmación para evitar que se repita un cuadro ya dibujado
        if(casillasOcupadas.indexOf(contenedorSeleccionado) == -1){
            //fue necesario convertir la función a await para que espere una promesa la cual indica 
            // que paso el tiempo necesario para la actualización del DOM
            await pintarYGuardarJugada(contenedorSeleccionado,letraUsuario);
            
            verificarGanador();

            // jugada del programa
            if(jugando){
                if(nivel != 0){
                    if(jugada == 1){
                        if(contenedorSeleccionado == 4){
                            usuarioCentro = true;
                            // se realiza la selección de cualquiera de las esquinas
                            contenedorSeleccionado = arregloParaNoDejarGanar[Math.round(Math.random() * 3)];
                        }else{
                            // se selecciona el cuadro del centro
                            contenedorSeleccionado = 4;
                        }
                    }else{
                        opcionParaBloquear();
                    }
                } else{
                    seleccionAlAzar();
                }
                await pintarYGuardarJugada(contenedorSeleccionado,letraPc);

                verificarGanador();
            }
            
        
        }
    }

});

// función con una promesa para dar un tiempo necesario para la actualización del DOM y permitir que las variables
// siguientes se asignen correctamente.
function pintarYGuardarJugada(id, letra){
    return new Promise( (resolve)=>{
        contenedoresSecundarios[id].innerHTML = `<p class="color${letra}"> ${letra} </p>`;

        convertirIdAUbicacionMatriz(id);
        matrizJuego[columna][fila] = letra;
        casillasOcupadas.push(id);
        jugada++;

        //Simulación de una tarea asíncrona
        setTimeout(() => {
            const nuevoElemento = contenedoresSecundarios[id].querySelector('p');
            nuevoElemento.classList.add('visible');
            resolve(); // Resolver la promesa después de 200ms
      }, 200); 
    });
}

//conversion de los Id de los contenedores del juego para poder guardar en la matrizJuego la respectiva jugada
function convertirIdAUbicacionMatriz(posicion){
    columna = Math.floor(posicion / 3);
    fila = posicion % 3;
}

//función para verificar el ganador a través del arreglo combinacionesGanadoras 
function verificarGanador(){

    for(let prueba = 0 ; prueba <= 7 ; prueba++){

        armarArregloAVerificar(prueba);
        
        if(arregloAVerificar[0] == arregloAVerificar[1] && arregloAVerificar[1] == arregloAVerificar[2]){
           if(arregloAVerificar[0] == letraUsuario){
                asignarContenedoresGanadores(prueba);
                terminarJuego(1); //1 => Usuario gano
                actualizarPuntajeGanados(nivel);
                return;
           }
           if(arregloAVerificar[0] == letraPc){
                asignarContenedoresGanadores(prueba);
                terminarJuego(0); //0 => Usuario perdió
                actualizarPuntajePerdidos(nivel);
                return;
           }
        }

    }

    if(jugada == 9){
        terminarJuego(2); //2 => Empate
        actualizarPuntajeEmpatados(nivel);
    }

}

//Esta función realiza unas verificaciones en el siguiente orden:
//1. Verifica si el pc tiene opción de ganar y asigna la respectiva celda ganadora
//2. Verifica si el usuario esta a punto de ganar y asigna la celda para bloquearlo
//3. Si es la tercera jugada, se anticipa para que el usuario no pueda ganar con las siguientes dos jugadas de él.
//4. Si ninguna de las anteriores se cumple, la jugada del programa es al azar.
function opcionParaBloquear(){
        
    if(opcionParaGanar(letraPc) && nivel > 0 ){
        console.log("opcion para ganar el pc");
        return;
    }

    if(opcionParaGanar(letraUsuario) && nivel > 1){
        console.log("opcion para bloquiar al usuario");
        return;
    }

    if(jugada == 3 && nivel == 3){
        if(usuarioCentro){
            do{
                contenedorSeleccionado = Math.round(Math.random() * 8);
            // con la siguiente sentencia se confirma que el contenedorSeleccionado aleatoriamente cumpla con:
            // 1. Que sea un contenedor que ya esta dibujado con una jugada
            // 2. Que no sea un contenedor de las esquinas 
            // Se declara la condición como O, para que el bucle se mantenga hasta que ambas condiciones sean falsas
            // ya que, lo que se busca es obtener un contenedor que sea de las esquinas y que no este dibujado con una jugada.
            }while(casillasOcupadas.indexOf(contenedorSeleccionado) != (-1) || arregloParaNoDejarGanar.indexOf(contenedorSeleccionado) == (-1));
        }else{
            // opciones que hay que bloquiar cuando el PC tiene su jugada en el centro
            // en donde N es donde no deberia jugar el PC para que el usuario no gane
            // 1. usuario escoje dos centros laterales
            //     [-,1,-]     [-,1,-]     [N,N,-]     [-,N,N]     [-,1,-]     [-,-,-]   
            //     [N,X,5]     [3,X,N]     [N,X,5]     [3,X,N]     [-,X,-]     [3,X,5]    
            //     [N,N,-]     [-,N,N]     [-,7,-]     [-,7,-]     [-,7,-]     [-,-,-] 
            // 2. usuario escoje un centro lateral y una esquina opuesta
            //     [-,1,-]  [-,1,-]     [-,-,2]  [-,-,N]     [N,-,-]   [0,-,-]     [N,N,3]  [0,N,N]
            //     [-,X,-]  [-,X,-]     [3,X,N]  [3,X,N]     [N,X,5]   [N,X,5]     [-,X,-]  [-,X,-]
            //     [N,N,8]  [6,N,N]     [-,-,N]  [-,-,8]     [6,-,-]   [N,-,-]     [-,7,-]  [-,7,-]
            // 3. usuario escoje dos esquinas opuestas
            //     [0,-,N]  [N,-,2]   
            //     [-,X,-]  [-,X,-]   
            //     [N,-,8]  [6,-,N]  
            //En las opciones 2 y 3 por conveniencia se elejira que la jugada del PC no sea en las esquinas, y la
            //diferencia con la jugada 2 es que no debe ser opuesta a la jugada lateral del usuario.
            //Para la jugada uno la condicion cambia, ahora la jugada del PC deberia estar al lado de las jugadas del usuario

            let contenedoresSiEscoger = [];
            if( casillasOcupadas[0] % 2 == 1 && casillasOcupadas[2] % 2 == 1 ){ // Condicion para verificar si el usuario elijio dos centros laterales
                
                for(let i=0 ; i<=2 ; i=i+2 ){
                    if(casillasOcupadas[i] == 1 || casillasOcupadas[i] == 7){
                        contenedoresSiEscoger.push(casillasOcupadas[i]-1,casillasOcupadas[i]+1);
                    }else{
                        contenedoresSiEscoger.push(casillasOcupadas[i]-3,casillasOcupadas[i]+3);
                    }
                }

            }else if (casillasOcupadas[0] % 2 == 1 || casillasOcupadas[2] % 2 == 1 ){ // Condicion para verificar si el usuario elijio un centro lateral y una esquina

                for(let i=0 ; i<=2 ; i=i+2 ){
                    if(casillasOcupadas[i] == 1 || casillasOcupadas[i] == 7){
                        contenedoresSiEscoger.push(3,5);
                    }else if(casillasOcupadas[i] == 3 || casillasOcupadas[i] == 5){
                        contenedoresSiEscoger.push(1,7);
                    }
                }

            }else{ //si no, el usuario entonces elijio dos esquinas opuestas, ya que los if de opcionesparaGanar se verifica que sean esquinas paralelas
                contenedoresSiEscoger = [1,3,5,7];
            }
           
            console.log(contenedoresSiEscoger)
            do{
                contenedorSeleccionado = Math.round(Math.random() * 8);
            // con la siguiente sentencia se confirma que el contenedorSeleccionado aleatoriamente cumpla con:
            // 1. Que sea un contenedor que ya esta dibujado con una jugada
            // 2. Que sea un contenedor que no se deba escoger
            // Se declara la condición como O, para que el bucle se mantenga hasta que ambas condiciones sean falsas
            // ya que, lo que se busca es obtener un contenedor que:  no este dibujado con una jugada y
            // sea un contenedor que si se pueda escoger.
           console.log(contenedorSeleccionado);
            }while(casillasOcupadas.indexOf(contenedorSeleccionado) != (-1) || 
                    contenedoresSiEscoger.indexOf(contenedorSeleccionado) == (-1)
                );
        }
        return;
    }

    seleccionAlAzar();
}

function seleccionAlAzar(){
    do{
        contenedorSeleccionado = Math.round(Math.random() * 8);
    }while(casillasOcupadas.indexOf(contenedorSeleccionado)!=-1);
}

//Función para buscar cual letra tiene la posibilidad de ganar
function opcionParaGanar(letraAVerificar){


    for(let prueba = 0 ; prueba <= 7 ; prueba++){

        armarArregloAVerificar(prueba);
        
        if(arregloAVerificar[0] == letraAVerificar && arregloAVerificar[0] == arregloAVerificar[1] && 
            arregloAVerificar[2] == '0' ){
            contenedorSeleccionado = combinacionesGanadoras[prueba][2];
            return true;
        }
        if(arregloAVerificar[1] == letraAVerificar && arregloAVerificar[1] == arregloAVerificar[2] && arregloAVerificar[0] == '0'){
            contenedorSeleccionado = combinacionesGanadoras[prueba][0];
            return true;
        }
        if(arregloAVerificar[2] == letraAVerificar && arregloAVerificar[0] == arregloAVerificar[2] && arregloAVerificar[1] == '0'){
            contenedorSeleccionado = combinacionesGanadoras[prueba][1];
            return true;
        }
    }
    return false;
}

function armarArregloAVerificar(prueba){
    for(let i=0 ; i < 3 ; i++){
        convertirIdAUbicacionMatriz(combinacionesGanadoras[prueba][i]);
        arregloAVerificar[i] = matrizJuego[columna][fila]; 
    }
}

function asignarContenedoresGanadores (opcGanadora){
    
    contenedorInicial = combinacionesGanadoras[opcGanadora][0];
    contenedorFinal = combinacionesGanadoras[opcGanadora][2];   
    
}


async function terminarJuego(resultado){
    jugada == 9;
    jugando = false;
    console.log("juego terminado");
    if(resultado != 2){
        await calcularYDibujarLineaGanadora(contenedorInicial,contenedorFinal);
    }
    await mensajeResultado(resultado);
    
}

btnNuevoJuego.addEventListener('click',reiniciarJuego);

async function reiniciarJuego(){


    // si el jugador no ha terminado se usa esta variable para confirmar si desea reiniciar el juego
    // se considera que lo esta abandonando y por ende es como si perdiera el juego
    let confirmarNuevoJuego = true;

    if(jugada != 8 && jugando){
        confirmarNuevoJuego = await seguroDeseaNuevoJuego();
        if(confirmarNuevoJuego){
            await mensajeResultado(0);
            actualizarPuntajePerdidos(nivel);
        }
        
    }

    if(confirmarNuevoJuego){
                        
        jugada = 0;
        matrizJuego = [
            ["0","0","0"],
            ["0","0","0"],
            ["0","0","0"]
        ];
        usuarioCentro = false;
        casillasOcupadas = [];
        jugando = false;
        eleccionO.disabled = false;
        eleccionX.disabled = false;
        modoJuego.disabled = false;
        
        for(let i=0; i<contenedoresSecundarios.length;i++){
            contenedoresSecundarios[i].innerHTML = "";
        }

        ocultarLineaGanadora();
    }
    

}