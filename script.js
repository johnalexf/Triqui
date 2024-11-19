// checkboxs de la elección del usuario para jugar
const eleccionO = document.getElementById('eleccionO');
const eleccionX = document.getElementById('eleccionX');

// Contenedores secundarios los cuales representan cada una de las posiciones en el triqui
const contenedoresSecundarios = document.getElementsByClassName('secundario');

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
    [6,4,2]
];

//arreglo que se va armando según cada una de las combinacionesGanadoras
let arregloAVerificar = ["0","0","0"];

//Eventos de escucha para que al seleccionar un checkbox el otro se deseleccione
// y asignación de la elección en la variable letraSeleccion
eleccionO.addEventListener('change',()=>{
    eleccionX.checked = false;
    letraUsuario = "O";
    letraPc = "X";
});

eleccionX.addEventListener('change',()=>{
    eleccionO.checked = false;
    letraUsuario = "X";
    letraPc = "O";
});


//evento de escucha en toda la pagina con el fin de:
// poder dibujar la selección del usuario según el contenedor secundario donde se haga click.
// y posteriormente a ello que el programa dibuje su elección
// la función es asíncrona ya que al modificar el DOM es necesario darle un tiempo para que 
// termine su ejecución y las variables se asignen correctamente
document.addEventListener('click', async function(event){

    if(event.target.classList[1] == 'secundario' && letraUsuario != 'Ninguna'){

        if(jugando == false){
            jugando == true;
            eleccionO.disabled = true;
            eleccionX.disabled = true;
        }
        
        contenedorSeleccionado = parseInt(event.target.id);

        // confirmación para evitar que se repita un cuadro ya dibujado
        if(casillasOcupadas.indexOf(contenedorSeleccionado) == -1){
            //fue necesario convertir la función a await para que espere una promesa la cual indica 
            // que paso el tiempo necesario para la actualización del DOM
            await pintarYGuardarJugada(contenedorSeleccionado,letraUsuario);
            
            verificarGanador();

            // jugada del programa
            switch(jugada){
                case 1:
                    if(contenedorSeleccionado == 4){
                        usuarioCentro = true;
                        // se realiza la selección de cualquiera de las esquinas
                        contenedorSeleccionado = arregloParaNoDejarGanar[Math.round(Math.random() * 3)];
                    }else{
                        // se selecciona el cuadro del centro
                        contenedorSeleccionado = 4;
                    }
                    pintarYGuardarJugada(contenedorSeleccionado,letraPc);
                    break;
                case 9:
                    //la jugada nueve es del usuario por tanto el programa no debería ejecutar mas jugadas
                    jugando == false;
                    console.log("juego terminado")
                    break;
                default:
                    opcionParaBloquear();
                    await pintarYGuardarJugada(contenedorSeleccionado,letraPc);
                    verificarGanador();
                    break;

            }
        
        }
    }

});

// función con una promesa para dar un tiempo necesario para la actualización del DOM y permitir que las variables
// siguientes se asignen correctamente.
function pintarYGuardarJugada(id, letra){
    return new Promise( (resolve)=>{
        contenedoresSecundarios[id].innerHTML = `<p> ${letra} </p>`;

        convertirIdAUbicacionMatriz(id);
        matrizJuego[columna][fila] = letra;
        casillasOcupadas.push(id);
        jugada++;

        //Simulación de una tarea asíncrona
        setTimeout(() => {
            resolve(); // Resolver la promesa después de 100ms
      }, 100); 
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
                jugada = 9;
                letraUsuario = "Ninguna";
                alert("Felicidades has ganado");
                return;
           }
           if(arregloAVerificar[0] == letraPc){
                jugada = 9;
                letraUsuario = "Ninguna";
                alert("Lo siento te han ganado");
                return;
           }
        }

    }
}

//Esta función realiza unas verificaciones en el siguiente orden:
//1. Verifica si el pc tiene opción de ganar y asigna la respectiva celda ganadora
//2. Verifica si el usuario esta a punto de ganar y asigna la celda para bloquearlo
//3. Si es la tercera jugada, se anticipa para que el usuario no pueda ganar con las siguientes dos jugadas de él.
//4. Si ninguna de las anteriores se cumple, la jugada del programa es al azar.
function opcionParaBloquear(){
        
    if(opcionParaGanar(letraPc)){
        console.log("opcion para ganar el pc");
        return;
    }

    if(opcionParaGanar(letraUsuario)){
        console.log("opcion para bloquiar al usuario");
        return;
    }

    if(jugada == 3){
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
            do{
                contenedorSeleccionado = Math.round(Math.random() * 8);
            // con la siguiente sentencia se confirma que el contenedorSeleccionado aleatoriamente cumpla con:
            // 1. Que sea un contenedor que ya esta dibujado con una jugada
            // 2. Que sea un contenedor de las esquinas 
            // Se declara la condición como O, para que el bucle se mantenga hasta que ambas condiciones sean falsas
            // ya que, lo que se busca es obtener un contenedor que sea de las esquinas y que no este dibujado con una jugada.
            }while(casillasOcupadas.indexOf(contenedorSeleccionado) != (-1) || arregloParaNoDejarGanar.indexOf(contenedorSeleccionado) != (-1));
        }
        return;
    }

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
    console.log(arregloAVerificar);
}