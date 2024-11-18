

// checkboxs de la elección del usuario para jugar
const eleccionO = document.getElementById('eleccionO');
const eleccionX = document.getElementById('eleccionX');

// Contenedores secundarios los cuales representan cada una de las posiciones en el triqui
const contenedoresSecundarios = document.getElementsByClassName('secundario');


//evento de escucha en toda la pagina con el fin de:
// poder dibujar la selección del usuario segun el contenedor secundario
document.addEventListener('click',function(event){
    console.log(event);
    console.log(event.target.id);
    console.log(event.target.classList[1]);
    console.log(eleccionO.checked)
    console.log(eleccionX.checked)

    if(event.target.id == 'eleccionX'){
        eleccionO.checked = false;
    }else if(event.target.id == 'eleccionO'){
        eleccionX.checked = false;

    }


    if(event.target.classList[1] == 'secundario'){
        contenedoresSecundarios[event.target.id - 1].innerHTML = '<p> X </p>';
    }
    

});