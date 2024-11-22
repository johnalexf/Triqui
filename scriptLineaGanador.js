import {contenedoresSecundarios} from './script.js';

let lineaGanador = document.getElementById('lineaGanador');
let grosorLinea = 15;


export function calcularYDibujarLineaGanadora (contenedorInicial, contenedorFinal){
    return new Promise( (resolve)=>{
        let horizontalCoordInicial
        let verticalCoordInicial

        let horizontalCoordFinal
        let verticalCoordFinal 

        let arriba;
        let izquierda;
        let ancho;
        let alto;
        let giro = 0;
        let transicion = "vertical";

        // si se cumple esta condicion significa que la linea a dibujar es de forma diagonal
        if( (contenedorInicial == 0 && contenedorFinal == 8) || (contenedorInicial == 2 &&  contenedorFinal == 6) ){

            // Para este caso, es necesario dibujar una linea de forma horizontal en todo el centro del tablero y girarla 45 o 135 grados
            // Obtenemos las coordenadas del contenedor del la segunda columna primera fila
            [horizontalCoordInicial, verticalCoordInicial] = obtenerCoordenadasCentrales(3);
            [horizontalCoordFinal, verticalCoordFinal] = obtenerCoordenadasCentrales(5);

            let tamanoContenedor = (horizontalCoordFinal - horizontalCoordInicial)/2;
            let aumetarAncho = 0.4;

            //se le resta la mitad del grosor para que la linea se pinte en el centro de las coordenadas
            arriba = verticalCoordInicial - grosorLinea/2;
            izquierda = horizontalCoordInicial - grosorLinea/2 - tamanoContenedor*(aumetarAncho) ;

            ancho = (horizontalCoordFinal - horizontalCoordInicial) + grosorLinea + tamanoContenedor*(2*aumetarAncho) ;
            alto = grosorLinea;

            if(contenedorInicial == 0){
                giro = 45;
            }else if( contenedorInicial == 2){
                giro = 135;
            }

        }else{

            [horizontalCoordInicial, verticalCoordInicial] = obtenerCoordenadasCentrales(contenedorInicial);
            [horizontalCoordFinal, verticalCoordFinal] = obtenerCoordenadasCentrales(contenedorFinal);

            arriba = verticalCoordInicial - grosorLinea/2;
            izquierda = horizontalCoordInicial - grosorLinea/2;

            // si se cumple esta condicion significa que la linea ganadora se debe pintar de formal vertical
            if( (horizontalCoordFinal - horizontalCoordInicial) == 0 ){
                
                ancho = grosorLinea;
                alto = (verticalCoordFinal - verticalCoordInicial) + grosorLinea;

            // si se cumple esta condicion significa que la linea ganadora se debe pintar de forma horizontal
            }else if( (verticalCoordFinal - verticalCoordInicial) == 0){

                transicion = "horizontal";
                ancho = (horizontalCoordFinal - horizontalCoordInicial) + grosorLinea;
                alto = grosorLinea;
            
            // si no cumple ninguna de las condiciones anteriores la linea ganadora es de forma diagonal
            }else{
                console.log("Error en la validacion inicial de si es una linea en diagonal");
            }


        }

        //dependiendo de la pantalla y si el usuario a realizado scroll, hay que tener
        //en cuenta la cantidad de pixeles que se ha desplazado para asi poder dibujar la linea correctamente.
        const scrollTop = document.documentElement.scrollTop;
        
        arriba = arriba + scrollTop;

       
        
        //Simulación de una tarea asíncrona
        setTimeout(() => {
            dibujarLineaGanadora(arriba,izquierda,ancho,alto,giro,transicion);
            resolve(); // Resolver la promesa después de 200ms
      }, 400); 
    });

}


function obtenerCoordenadasCentrales(contenedor){

    //este instruccion nos permite obtener las coordenadas de la posicion top y left del contenedor
    let coordenadas = contenedoresSecundarios[contenedor].getBoundingClientRect();
    
    //calculamos la ubicacion del centro del contenedor
    let coordenadaHorizontal = (coordenadas.right-coordenadas.left)/2 + coordenadas.left;
    let coordenadaVertical = (coordenadas.bottom-coordenadas.top)/2 + coordenadas.top;

    return [coordenadaHorizontal, coordenadaVertical]
}

function dibujarLineaGanadora(arriba, izquierda, ancho, alto, giro,transicion){
    
    if(transicion == "horizontal"){
        lineaGanador.classList.add("transitionHorizontal");
    }else{
        lineaGanador.classList.add("transitionVertical");
    }

    lineaGanador.style.top = `${arriba}px`;
    lineaGanador.style.left = `${izquierda}px`;
    lineaGanador.style.transform = `rotate(${giro}deg)`;
    // lineaGanador.style.display = "block";
    setTimeout(lineaGanador.style.height = `${alto}px`, 100);
    setTimeout(lineaGanador.style.width = `${ancho}px`, 100);
    // lineaGanador.style.height = `${alto}px`;
    // lineaGanador.style.width = `${ancho}px`;
    
}

export function ocultarLineaGanadora(){
    // lineaGanador.style.display = "none";
    lineaGanador.style.width = `0px`;
    lineaGanador.style.height = `0px`;
    lineaGanador.classList.remove("transitionVertical");
    lineaGanador.classList.remove("transitionHorizontal");
} 

//calcularYDibujarLineaGanadora(2,6);