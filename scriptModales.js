let nombreUsuario = localStorage.getItem('nombreUsuario');

const  nombreUsuarioDOM = document.getElementById('nombreUsuarioDOM');
console.log(nombreUsuario);

const fondoAnimado = document.getElementById("fondoAnimado");

if(nombreUsuario !=null){
  bienvenido();
}else{
  modalCapturarNombre();
}

async function modalCapturarNombre(){
  let mostrarModal = true;
  while(mostrarModal){

    const { value: nombre } = await Swal.fire({
      title: 'Hola! este es un juego de Triqui, para empezar por favor escribe tu nombre',
      input: 'text',
      inputPlaceholder: 'Escribe tu nombre aquí',
      confirmButtonText: 'Aceptar'
    });
    console.log(nombre);
    
    if (nombre) {
      nombreUsuario = nombre.toUpperCase();
      mostrarModal = false;
      localStorage.setItem('nombreUsuario',nombreUsuario);
      bienvenido();
    }else{
      console.log("nombre vacio");
      await Swal.fire({
        title: "El nombre no puede estar vació",
        timer: 3000,
        timerProgressBar: true,
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("La alerta se ha cerrado por que se ha cumplido el tiempo");
        }
      });
    }

  }
      
}

function bienvenido(){
  Swal.fire({
    title:`Bienvenido ${nombreUsuario} al juego de Triqui`,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: ()=>{ Swal.showLoading()}
  });
  nombreUsuarioDOM.textContent = nombreUsuario;
}

//función para mostrar el modal con un mensaje según el resultado de la partida
//en donde resultado puede ser:
//0 => el usuario perdió.
//1 => el usuario gano.
//2 => la partida quedo en empate.
export function mensajeResultado(resultado){

  return new Promise( (resolve)=>{
    let mensaje ;

    switch(resultado){
      case 0: 
        fondoAnimado.classList.add("perdiste");
        mensaje = `Lo siento ${nombreUsuario} has perdido, inténtalo de nuevo`;
        break;
      case 1: 
        fondoAnimado.classList.add("ganaste");
        mensaje = `Felicitaciones ${nombreUsuario} has ganado, ¿te atreves a subir de nivel?`;
        break;
      case 2: 
      fondoAnimado.classList.add("empate");
        mensaje = `${nombreUsuario} hemos quedado empatados, que reñido estuvo`;
        break;
      default :
        console.log("Error en el uso de la función mensajeResultado");
    }

    //Simulación de una tarea asíncrona
    setTimeout(() => {
      Swal.fire({
        title: mensaje,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      }); 
        fondoAnimado.style.display = "block";
        resolve(); // Resolver la promesa después de 400ms
    }, 1200); 
  });
}

export function detenerAnimacion(){
    setTimeout(() => {
        detenerAnimacionSinEspera(); 
  },5000);

  return true;
}

export function detenerAnimacionSinEspera(){
  console.log("dtener animacion sin espera")
  fondoAnimado.style.display = "none";
  fondoAnimado.classList.remove("ganaste");
  fondoAnimado.classList.remove("perdiste");
  fondoAnimado.classList.remove("empate");
}

export function escojaUnaOpcion(){
  Swal.fire({
    title:`${nombreUsuario} por favor elije una opción ya sea (O) o (X) con la que deseas jugar`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true
  });
}

export async function seguroDeseaNuevoJuego(){
  let respuesta = false;
  
  console.log("funcion seguro desea nuevo juego?")
  await Swal.fire({
    title: `${nombreUsuario} no has terminado el juego, si empiezas uno nuevo se considera como abandono del actual y por consiguiente 
    lo perderas, aun así, ¿Estas seguro de empezar un nuevo juego?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed){
      respuesta = true;
      cargando();
    } 
  });

  
  return respuesta;
}

function cargando(){
  Swal.fire({
    showConfirmButton: false,
    timer: 2000,
    didOpen: ()=>{ Swal.showLoading()}
  });
}