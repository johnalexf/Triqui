let nombreUsuario = localStorage.getItem('nombreUsuario');
const  nombreUsuarioDOM = document.getElementById('nombreUsuarioDOM')
console.log(nombreUsuario);

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
      nombreUsuario = nombre;
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

  let mensaje ;

  switch(resultado){
    case 0: 
      mensaje = `Lo siento ${nombreUsuario} has perdido, inténtalo de nuevo`;
      break;
    case 1: 
      mensaje = `Felicitaciones ${nombreUsuario} has ganado, ¿te atreves a subir de nivel?`;
      break;
    case 2: 
      mensaje = `${nombreUsuario} hemos quedado empatados, que reñido estuvo`;
      break;
    default :
      console.log("Error en el uso de la función mensajeResultado");
  }

  Swal.fire({
    title: mensaje,
    showConfirmButton: false,
    timer: 5000
  });
}