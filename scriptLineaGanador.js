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
        let transicion = "horizontal";

        [horizontalCoordInicial, verticalCoordInicial] = obtenerCoordenadasCentrales(contenedorInicial);
        [horizontalCoordFinal, verticalCoordFinal] = obtenerCoordenadasCentrales(contenedorFinal);

        // si se cumple esta condicion significa que la linea a dibujar es de forma diagonal
        if( (contenedorInicial == 0 && contenedorFinal == 8) || (contenedorInicial == 2 &&  contenedorFinal == 6) ){

            // para esta diagonal el ancho seria la hipotenusa
            // hipotenusa = raiz(a^2 + b^2) 
            //donde a y b seria el alto y el largo que obtenemos al restar el valor final - valor inicial de coordenadas vertical y horizontal
            ancho = Math.sqrt( (horizontalCoordFinal - horizontalCoordInicial)**2 + (verticalCoordFinal-verticalCoordInicial)**2 );
            alto = grosorLinea;

            izquierda = horizontalCoordInicial + grosorLinea/4;            

            if(contenedorInicial == 0){
                giro = 45;
                arriba = verticalCoordInicial - grosorLinea/2;
                
            }else if( contenedorInicial == 2){
                arriba = verticalCoordInicial + grosorLinea/2;
                giro = 135;
            }

        }else{

            arriba = verticalCoordInicial - grosorLinea/2;
            izquierda = horizontalCoordInicial - grosorLinea/2;

            // si se cumple esta condicion significa que la linea ganadora se debe pintar de formal vertical
            if( (horizontalCoordFinal - horizontalCoordInicial) == 0 ){

                transicion = "vertical";
                ancho = grosorLinea;
                alto = (verticalCoordFinal - verticalCoordInicial) + grosorLinea;

            // si se cumple esta condicion significa que la linea ganadora se debe pintar de forma horizontal
            }else if( (verticalCoordFinal - verticalCoordInicial) == 0){

                
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
            resolve(); // Resolver la promesa después de 400ms
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

    if(giro == 45){
        lineaGanador.classList.add("diagonalIzquierda");
    }else if(giro == 135){
        lineaGanador.classList.add("diagonalDerecha");
    }

    lineaGanador.style.top = `${arriba}px`;
    lineaGanador.style.left = `${izquierda}px`;
    lineaGanador.style.transform = `rotate(${giro}deg)`;
    lineaGanador.style.height = `${alto}px`
    lineaGanador.style.width = `${ancho}px`
    
}

export function ocultarLineaGanadora(){
    lineaGanador.style.width = `0px`;
    lineaGanador.style.height = `0px`;
    lineaGanador.classList.remove("transitionVertical");
    lineaGanador.classList.remove("transitionHorizontal");
    lineaGanador.classList.remove("diagonalIzquierda");
    lineaGanador.classList.remove("diagonalDerecha");
} 

//calcularYDibujarLineaGanadora(2,6);