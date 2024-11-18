

// checkboxs de la elección del usuario para jugar
const eleccionO = document.getElementById('eleccionO');
const eleccionX = document.getElementById('eleccionX');

// Contenedores secundarios los cuales representan cada una de las posiciones en el triqui
const contenedoresSecundarios = document.getElementsByClassName('secundario');


//variable de inicio del juego
let jugando = false;

//variable de selección del usuario
let letraSeleccionada = "Ninguna";


eleccionO.addEventListener('change',()=>{
    eleccionX.checked = false;
    letraSeleccionada = "O";
});


eleccionX.addEventListener('change',()=>{
    eleccionO.checked = false;
    letraSeleccionada = "X";
});




//evento de escucha en toda la pagina con el fin de:
// poder dibujar la selección del usuario segun el contenedor secundario
document.addEventListener('click',function(event){
    console.log(event);
    console.log(event.target.id);
    console.log(event.target.classList[1]);
    console.log(eleccionO.checked)
    console.log(eleccionX.checked)

    if(event.target.classList[1] == 'secundario' && letraSeleccionada != 'Ninguna'){
        if(jugando == false){
            jugando == true;
            eleccionO.disabled = true;
            eleccionX.disabled = true;
        }
        contenedoresSecundarios[event.target.id - 1].innerHTML = `<p> ${letraSeleccionada} </p>`;
    }
    

});