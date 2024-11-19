(async () => {
    const { value: nombre } = await Swal.fire({
      title: 'Introduce tu nombre',
      input: 'text',
      inputLabel: 'Tu nombre',
      inputPlaceholder: 'Escribe tu nombre aquí'
    });
    if (nombre) {
      Swal.fire(`Bienvenido ${nombre} al juego de Triqui`);
    }
  })();