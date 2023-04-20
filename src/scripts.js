// ADMINISTRAR INVENTARIO DE PRODUCTOS

//  agregarProductoArray(); 
// 	mostrarProductosDom() 
		// productosSinStock();
		// productosDisponibles();
// 	crearProducto()
		//validarFormulario();
		//agregarNuevoProducto();
//  modificarProducto();
// 	eliminarProducto();

//PROGRAMA
const productos = [];

class Producto {

	constructor(id, nombre, costo = null, precio = null, stock = null) {
		this.id = id;
		this.nombre = nombre;
		this.costo = costo ? costo : this.calcularCosto();
		this.stock = stock ? stock : this.calcularStock();
		this.precio = precio ? precio : this.calcularPrecio(this.costo);
		this.ganancia = precio && costo ? precio - costo : this.calcularGanancia(this.costo, this.precio);
	  }
	calcularCosto() {
		return Math.floor(Math.random() * 201) + 100;
	}
	calcularStock() {
		return Math.floor(Math.random() * 4) + 0;
	}
	calcularPrecio(costo) {
		return parseInt(costo / (1- 0.30))
	}
	calcularGanancia(costo,precio) {
		return precio - costo;
	}
}

async function agregarProductoArray() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b57992c61cmshdb42314749a4514p1fd9b3jsn5a17919519ba',
            'X-RapidAPI-Host': 'my-store2.p.rapidapi.com'
        }
    };

    const response = await fetch('https://my-store2.p.rapidapi.com/catalog/products?limit=20', options);
    const data = await response.json();
    
    data.products.forEach(producto => {
        const nuevoProducto = new Producto(`${producto.id}`,`${producto.name}`)
        productos.push(nuevoProducto);
    });
    
    mostrarProductoDom();
}

async function mostrarProductoDom() {
	const contProductoSinStock = document.getElementById("cont-productosSinStock");
    const contProducto = document.getElementById("cont-productos");

	contProducto.innerHTML = ""
	contProductoSinStock.innerHTML = ""

	const tituloSinStock = document.createElement("h2");
    tituloSinStock.textContent = "Sin Stock - Reposición";
    contProductoSinStock.appendChild(tituloSinStock);

	const tituloProductos = document.createElement("h2");
	tituloProductos.textContent = "Productos Disponibles";
	contProducto.appendChild(tituloProductos);


    productos.forEach(prod => {

		if(prod.stock >= 1) {
			const infoProductos = document.createElement("div");
			infoProductos.classList.add("producto");
	
			infoProductos.innerHTML = `
			<div class="card-producto"> 
					
				Identificador: 
				${prod.id}<br>
			
				Nombre: 
				${prod.nombre}<br>
			
				Costo: 
				$${prod.costo}<br>

				Precio: 
				$${prod.precio}<br>

				Ganancia: 
				$${prod.ganancia}<br>
			
				Stock: 
				${prod.stock}<br>
			</div>

			<div> 
				<input id="editar-${prod.id}" type="submit" value="Editar"> 

				<input id="prod-${prod.id}" type="submit" value="X"> 
			</div>
			`

			const botonEliminar = infoProductos.querySelector(`#prod-${prod.id}`);
			botonEliminar.addEventListener('click', function() {
				Swal.fire({
					title: `Producto: ${prod.nombre}<br> Id: ${prod.id}<br>Seguro que desea eliminarlo?`,
					text: `No podra recuperarlo!`,
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Eliminar'
				  }).then((result) => {
					if (result.isConfirmed) {
					  Swal.fire(
						'Eliminado!',
						'El producto fue eliminado.',
						'success'
					  )
					  	eliminarProducto(prod.id);
						infoProductos.remove();
					}
				  })
			});
	
			contProducto.appendChild(infoProductos);	

			// Editar Productos
			const main = document.querySelector("#main");

			const botonEditar = document.querySelector(`#editar-${prod.id}`);
			botonEditar.addEventListener('click', function() {
				console.log("hola?")
			const contEditar = document.createElement("div");
			contEditar.classList.add("cont-editar");
			
			// Agrega los inputs con los valores actuales del producto
			const labelNombre = document.createElement("label");
			labelNombre.textContent = "Nombre"
			const inputNombre = document.createElement("input");
			inputNombre.value = prod.nombre;
			contEditar.appendChild(labelNombre);
			contEditar.appendChild(inputNombre);

			const labelCosto = document.createElement("label");
			labelCosto.textContent = "Costo"
			const inputCosto = document.createElement("input");
			inputCosto.value = prod.costo;
			contEditar.appendChild(labelCosto);
			contEditar.appendChild(inputCosto);

			const labelPrecio = document.createElement("label");
			labelPrecio.textContent = "Precio"
			const inputPrecio = document.createElement("input");
			inputPrecio.value = prod.precio;
			contEditar.appendChild(labelPrecio);
			contEditar.appendChild(inputPrecio);

			const labelStock = document.createElement("label");
			labelStock.textContent = "Stock"
			const inputStock = document.createElement("input");
			inputStock.value = prod.stock;
			contEditar.appendChild(labelStock);
			contEditar.appendChild(inputStock);
			
			const botonGuardar = document.createElement("button");
			botonGuardar.textContent = "Guardar";
			contEditar.appendChild(botonGuardar);

			const botonCerrar = document.createElement("button");
			botonCerrar.textContent = "Cerrar";
			contEditar.appendChild(botonCerrar);

			botonGuardar.addEventListener('click', () => {

				prod.nombre = inputNombre.value;
				prod.costo = inputCosto.value;
				prod.precio = inputPrecio.value;
				prod.stock = inputStock.value;

				const productoModificado = productos.find(producto => producto.id === prod.id);

				productoModificado.nombre = inputNombre.value;
				productoModificado.costo = inputCosto.value;
				productoModificado.precio = inputPrecio.value;
				productoModificado.stock = inputStock.value;
				productoModificado.ganancia = inputPrecio.value - inputCosto.value;
				
				mostrarProductoDom();
				
				contEditar.remove();
			});

			botonCerrar.addEventListener('click', () => {
				contEditar.remove();
			})

			main.appendChild(contEditar);
			});
		}

		if(prod.stock == 0) {
			const infoProductos = document.createElement("div");

			infoProductos.classList.add("producto");

			infoProductos.innerHTML = `
				<div class="card-producto"> 
				Identificador: 
				${prod.id}<br>
			
				Nombre: 
				${prod.nombre}<br>
			
				Costo: 
				$${prod.costo}<br>

				Precio: 
				$${prod.precio}<br>

				Ganancia: 
				$${prod.ganancia}<br>
			
				Stock: 
				${prod.stock}<br>
				</div>

				<div> 
					<input id="editar-${prod.id}" type="submit" value="Editar"> 

					<input id="prod-${prod.id}" type="submit" value="X"> 
				</div>
			`
			
			// eliminar producto
			const botonEliminar = infoProductos.querySelector(`#prod-${prod.id}`);
			botonEliminar.addEventListener('click', function() {
				Swal.fire({
					title: `Producto: ${prod.nombre}<br> Id: ${prod.id}<br>Seguro que desea eliminarlo?`,
					text: `No podra recuperarlo!`,
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Eliminar'
				  }).then((result) => {
					if (result.isConfirmed) {
					  Swal.fire(
						'Eliminado!',
						'El producto fue eliminado.',
						'success'
					  )
					  	eliminarProducto(prod.id);
						infoProductos.remove();
					}
				  })
			});
	
			contProductoSinStock.appendChild(infoProductos);

			// Editar Productos
			const main = document.querySelector("#main");

			const botonEditar = document.querySelector(`#editar-${prod.id}`);
			botonEditar.addEventListener('click', function() {
				console.log("hola?")
			const contEditar = document.createElement("div");
			contEditar.classList.add("cont-editar");
			
			// Agrega los inputs con los valores actuales del producto
			const labelNombre = document.createElement("label");
			labelNombre.textContent = "Nombre"
			const inputNombre = document.createElement("input");
			inputNombre.value = prod.nombre;
			contEditar.appendChild(labelNombre);
			contEditar.appendChild(inputNombre);

			const labelCosto = document.createElement("label");
			labelCosto.textContent = "Costo"
			const inputCosto = document.createElement("input");
			inputCosto.value = prod.costo;
			contEditar.appendChild(labelCosto);
			contEditar.appendChild(inputCosto);

			const labelPrecio = document.createElement("label");
			labelPrecio.textContent = "Precio"
			const inputPrecio = document.createElement("input");
			inputPrecio.value = prod.precio;
			contEditar.appendChild(labelPrecio);
			contEditar.appendChild(inputPrecio);

			const labelStock = document.createElement("label");
			labelStock.textContent = "Stock"
			const inputStock = document.createElement("input");
			inputStock.value = prod.stock;
			contEditar.appendChild(labelStock);
			contEditar.appendChild(inputStock);
			
			const botonGuardar = document.createElement("button");
			botonGuardar.textContent = "Guardar";
			contEditar.appendChild(botonGuardar);

			const botonCerrar = document.createElement("button");
			botonCerrar.textContent = "Cerrar";
			contEditar.appendChild(botonCerrar);

			botonGuardar.addEventListener('click', () => {
				
				prod.nombre = inputNombre.value;
				prod.costo = inputCosto.value;
				prod.precio = inputPrecio.value;
				prod.stock = inputStock.value;

				const productoModificado = productos.find(producto => producto.id === prod.id);

				productoModificado.nombre = inputNombre.value;
				productoModificado.costo = inputCosto.value;
				productoModificado.precio = inputPrecio.value;
				productoModificado.stock = inputStock.value;
				productoModificado.ganancia = inputPrecio.value - inputCosto.value;


				mostrarProductoDom();

				contEditar.remove();
			});

			botonCerrar.addEventListener('click', () => {
				contEditar.remove();
			})

			main.appendChild(contEditar);
			});
		}
        
    });
}


function eliminarProducto(idProducto) {
	const indexToDelete = productos.findIndex(producto => producto.id === idProducto);
	if (indexToDelete !== -1) {
		productos.splice(indexToDelete, 1);
	}
}

function nuevoProducto() {
	const contAgregarProducto = document.getElementById("contAgregarProducto");
	const btnAgregarProducto = document.getElementById("btnAgregarProducto");

	btnAgregarProducto.addEventListener("click", () => {
		if(contAgregarProducto.dataset.creado !== "true") {
			const nuevoProducto = document.createElement("div");
			nuevoProducto.classList.add("nuevoProducto");
	
			nuevoProducto.innerHTML = `
			<div class="label-producto"> 
				<label for="id">Identificador</label> 
				<input id="identificador" placeholder="Identificador">
			</div>
	
			<div class="label-producto"> 
				<label for="nombre">Nombre</label> 
				<input id="nombre" placeholder="Nombre">
			</div>
	
			<div class="label-producto"> 
				<label for="costo">Costo</label> 
				<input id="costo" type="number" placeholder="Costo">
			</div>
	
			<div class="label-producto"> 
				<label for="precio">Precio</label> 
				<input id="precio" type="number" placeholder="Precio">
			</div>
			
			<div class="label-producto"> 
				<label for="stock">Stock</label> 
				<input id="stock" placeholder="Stock">
			</div>
	
			<div class="label-producto"> 
				<input id="agregarProducto" type="submit" value="Agregar"> 
			</div>
			`
			contAgregarProducto.appendChild(nuevoProducto);
	
			const agregar = document.getElementById("agregarProducto"); 
			agregar.addEventListener("click", () => {
			const nuevoId = document.getElementById("identificador").value;
			const nuevoNombre = document.getElementById("nombre").value;
			const nuevoCosto = document.getElementById("costo").value;
			const nuevoPrecio = document.getElementById("precio").value;
			const nuevoStock = document.getElementById("stock").value;

				// validar formulario
				if(nuevoId == "" || nuevoNombre == "" || nuevoStock == "" || nuevoCosto == "" || nuevoPrecio == "" ) {
					Swal.fire({
						position: 'center',
						icon: 'warning',
						title: 'Complete todos los campos',
						showConfirmButton: false,
						timer: 1500
					  })
				} else {
					// agrega el nuevo producto
					const nuevoObjeto = new Producto (nuevoId, nuevoNombre, nuevoCosto, nuevoPrecio, nuevoStock);
			
					productos.push(nuevoObjeto);
		
					//limpia los valores de los imputs
					document.getElementById("identificador").value = "";
					document.getElementById("nombre").value = "";
					document.getElementById("costo").value = "";
					document.getElementById("precio").value = "";
					document.getElementById("stock").value = "";
		
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: `Se agrego el prodcuto: ${nuevoNombre}`,
						showConfirmButton: false,
						timer: 1500
					})
					
					mostrarProductoDom();
					
				}
			})

			contAgregarProducto.dataset.creado = "true";

			const btnCerrar = document.getElementById("btnCerrar");
			btnCerrar.style.display = "flex";

			btnCerrar.addEventListener("click",() => {
				nuevoProducto.style.display = "none";
				contAgregarProducto.dataset.creado = "false";
				btnCerrar.style.display = "none";
			})
		}	
	})
	
}

agregarProductoArray();
nuevoProducto();


