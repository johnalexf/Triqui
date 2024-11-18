

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
document.addEventListener('click',function(event){

    if(event.target.classList[1] == 'secundario' && letraUsuario != 'Ninguna'){
        if(jugando == false){
            jugando == true;
            eleccionO.disabled = true;
            eleccionX.disabled = true;
        }
        
        contenedorSeleccionado = parseInt(event.target.id);
        pintarYGuardarJugada(contenedorSeleccionado,letraUsuario);
        
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
                do{
                    contenedorSeleccionado = Math.round(Math.random() * 8);
                    console.log(casillasOcupadas.indexOf(contenedorSeleccionado));
                }while(casillasOcupadas.indexOf(contenedorSeleccionado)!=-1);
                pintarYGuardarJugada(contenedorSeleccionado,letraPc);
                break;

        }
        
        
    }
    

});

function pintarYGuardarJugada(posicion, letra){
    contenedoresSecundarios[posicion].innerHTML = `<p> ${letra} </p>`;

    columna = Math.floor(posicion / 3);
    fila = posicion % 3;
    matrizJuego[columna][fila] = letra;
    casillasOcupadas.push(posicion);
    jugada++;
    console.log(`La jugada es la # ${jugada}`);
    console.log(matrizJuego);
}