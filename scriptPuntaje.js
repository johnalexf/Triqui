import {modoJuego} from './script.js';


let ganados = document.getElementById('ganados');
let empatados = document.getElementById('empatados');
let perdidos = document.getElementById('perdidos');

let puntajes = JSON.parse(localStorage.getItem('puntajes'));

if(puntajes == null){
    puntajes = [
        { ganados:0, empatados: 0, perdidos: 0}, //nivel fácil
        { ganados:0, empatados: 0, perdidos: 0}, //nivel medio
        { ganados:0, empatados: 0, perdidos: 0}, //nivel difícil 
        { ganados:0, empatados: 0, perdidos: 0} //nivel imposible
    ];
    localStorage.setItem('puntajes',JSON.stringify(puntajes));
}else{
    dibujarPuntajes(0);
}


export function dibujarPuntajes(nivel){
    
    ganados.value = puntajes[nivel].ganados;
    empatados.value = puntajes[nivel].empatados;
    perdidos.value = puntajes[nivel].perdidos;
    
}

export function actualizarPuntajeGanados(nivel, nuevoGanados){
    puntajes[nivel].ganados = nuevoGanados;
    dibujarPuntajes(nivel);
}

export function actualizarPuntajeEmpatados(nivel, nuevoEmpatados){
    puntajes[nivel].empatados = nuevoEmpatados;
    dibujarPuntajes(nivel);
}

export function actualizarPuntajePerdidos(nivel,  nuevoPerdidos){
    puntajes[nivel].perdidos = nuevoPerdidos;
    dibujarPuntajes(nivel);
}

//Cuando dentro de un evento de escucha llama la función con (), esta se ejecuta
//al iniciar el programa y no se ejecuta al momento de que ocurra el evento,
//por tanto es necesario usar ()=>{} o declarar una función antes para que permita
//enviar el parámetro necesario a la función que se invoca.
modoJuego.addEventListener('change', ()=>{
    console.log(modoJuego.value);
    dibujarPuntajes(modoJuego.value);
});