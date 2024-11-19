// checkboxs de la elección del usuario para jugar
const eleccionO = document.getElementById('eleccionO');
const eleccionX = document.getElementById('eleccionX');

// Contenedores secundarios los cuales representan cada una de las posiciones en el triqui
const contenedoresSecundarios = document.getElementsByClassName('secundario');


//variable de inicio del juego
let jugando = false;

//variable de selección del usuario
let letraUsuario = "Ninguna";
let letraPc = "Ninguna";
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

//arreglo para la primera jugada si es usuario elije la posición 4 que es la central
let arregloPrimeraJugada = [0,2,6,8];

let casillasOcupadas = [];

let combinacionesGanadoras=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

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
document.addEventListener('click', async function(event){

    if(event.target.classList[1] == 'secundario' && letraUsuario != 'Ninguna'){
        if(jugando == false){
            jugando == true;
            eleccionO.disabled = true;
            eleccionX.disabled = true;
        }
        
        contenedorSeleccionado = parseInt(event.target.id);

        if(casillasOcupadas.indexOf(contenedorSeleccionado)==-1){
            //fue necesario convertir la función a await para que espere una promesa la cual indica que paso el tiempo
            //necesario para la actualización del DOM
            await pintarYGuardarJugada(contenedorSeleccionado,letraUsuario);
            
            verificarGanador();

            switch(jugada){
                case 1:
                    if(contenedorSeleccionado == 4){
                        contenedorSeleccionado = arregloPrimeraJugada[Math.round(Math.random() * 3)];
                    }else{
                        contenedorSeleccionado = 4;
                    }
                    pintarYGuardarJugada(contenedorSeleccionado,letraPc);
                    break;
                case 9:
                    jugando == false;
                    console.log("juego terminado")
                    break;
                default:
                    opcionParaGanar();
                    await pintarYGuardarJugada(contenedorSeleccionado,letraPc);
                    verificarGanador();
                    break;

            }
        
            
            
        }
    }

});

function pintarYGuardarJugada(id, letra){
    return new Promise( (resolve)=>{
        contenedoresSecundarios[id].innerHTML = `<p> ${letra} </p>`;

        convertirIdAUbicacionMatriz(id);
        matrizJuego[columna][fila] = letra;
        casillasOcupadas.push(id);
        jugada++;
        console.log(`La jugada es la # ${jugada}`);
        console.log(matrizJuego);
        //Simulamos una tarea asíncrona (opcional)
        setTimeout(() => {
            resolve(); // Resolvemos la promesa cuando la tarea termina
      }, 100); // Esperamos 1 segundo
    });
}


function convertirIdAUbicacionMatriz(posicion){
    columna = Math.floor(posicion / 3);
    fila = posicion % 3;
}

function verificarGanador(){

    for(let prueba = 0 ; prueba <= 7 ; prueba++){

        let arregloAVerificar = ["0","0","0"];
        for(let i=0 ; i < 3 ; i++){
            convertirIdAUbicacionMatriz(combinacionesGanadoras[prueba][i]);
            arregloAVerificar[i] = matrizJuego[columna][fila]; 
        }
        console.log(arregloAVerificar);
        if(arregloAVerificar[0] == arregloAVerificar[1] && arregloAVerificar[1] == arregloAVerificar[2]){
           if(arregloAVerificar[0] == letraUsuario){
                jugada = 9;
                letraUsuario = "Ninguna";
                alert("Felicidades has ganado");
                break;
           }
           if(arregloAVerificar[0] == letraPc){
                jugada = 9;
                letraUsuario = "Ninguna";
                alert("Lo siento te han ganado");
                break;
           }
        }

    }

}

function opcionParaGanar(){

    for(let prueba = 0 ; prueba <= 7 ; prueba++){

        let arregloAVerificar = ["0","0","0"];
        for(let i=0 ; i < 3 ; i++){
            convertirIdAUbicacionMatriz(combinacionesGanadoras[prueba][i]);
            arregloAVerificar[i] = matrizJuego[columna][fila]; 
        }
        console.log(arregloAVerificar);
        if(arregloAVerificar[0] != "0" && arregloAVerificar[0] == arregloAVerificar[1] && arregloAVerificar[2] == '0'){
           contenedorSeleccionado = combinacionesGanadoras[prueba][2];
           return;
        }
        if(arregloAVerificar[1] != "0" && arregloAVerificar[1] == arregloAVerificar[2] && arregloAVerificar[0] == '0'){
            contenedorSeleccionado = combinacionesGanadoras[prueba][0];
            return;
        }
        if(arregloAVerificar[2] != "0" && arregloAVerificar[0] == arregloAVerificar[2] && arregloAVerificar[1] == '0'){
            contenedorSeleccionado = combinacionesGanadoras[prueba][1];
            return;
        }
    
    }
    do{
        contenedorSeleccionado = Math.round(Math.random() * 8);
    }while(casillasOcupadas.indexOf(contenedorSeleccionado)!=-1);
}