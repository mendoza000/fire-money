const db = firebase.firestore()
let total = 0

console.log("Iniciando...");

/*accede a las partes especificas del hmtl con las id*/
const moneyForm = document.getElementById('money-form');
const egresoForm= document.getElementById('egreso-form');
const registroContainer = document.getElementById('registro-container');
const moneyCard = document.getElementById('money');
const statusCard = document.getElementById('status');

/*Funcion de guardar el ingreso*/
const save = (title, cantidad) => {
	if (title != "" || cantidad != "") {
		db.collection("registro").doc().set({
			title,
			cantidad
		})
	}else{
		alert("Rellene todos los campos.")
	}
}

/*Funcion de guardar el egreso*/
const saveEgreso = (title, cantidad) => {
	if (title != "" || cantidad != "") {
		db.collection("egreso").doc().set({
			title,
			cantidad
		})
	}else{
		alert("Rellene todos los campos.")
	}
}

/*Funciones para borrar los registros*/
const deleteRegistro = id => db.collection("registro").doc(id).delete()
const deleteEgreso = id => db.collection("egreso").doc(id).delete()

/*accede a los documentos de ingresos y egresos*/
const getRegistro = () => db.collection("registro").get();
const getEgreso = () => db.collection("egreso").get();
async function mostrarRegistro() {
	/*formatea el registro cada que se llama la funcion*/
	registroContainer.innerHTML = '';
	/*accede a los datos de los documentos*/
	const getRegistroData = await getRegistro()
	const getEgresoData = await getEgreso()

	/*por cada que lee un documento añade un elemento al container, por eso el forEach*/
	getRegistroData.forEach((doc) =>{
		const registro = doc.data()
		const id = doc.id

		/*suma un elemento, por eso el +=*/
		registroContainer.innerHTML += `
		<div class="card card-body text-center p-4 shadow-sm my-2">
			<h3 class="border-bottom border-primary">${registro.title}</h3>

			<p class="text-center" style="font-size: 1.5em">${registro.cantidad} $</p>

			<button class="btn btn-secondary btn-delete" data-id=${id} data-money=${registro.cantidad}>Eliminar</button>
		</div>`;
		/*lee la id de cada boton de cada elemento para pasarlo a la funcion delete...()*/
		const btnsDelete = document.querySelectorAll(`.btn-delete`)
		btnsDelete.forEach(btn => {
			btn.addEventListener('click',async (e) => {
				console.log(e.target.dataset.id)
				await deleteRegistro(e.target.dataset.id)
				await mostrarRegistro()
				await mostrarMoney()
			})
		})
	});

	getEgresoData.forEach((doc) =>{
		const registro = doc.data()
		const id = doc.id

		registroContainer.innerHTML += `
		<div class="card card-body text-center p-4 shadow-sm my-2">
			<h3 class="border-bottom border-primary">${registro.title}</h3>

			<p class="text-center" style="font-size: 1.5em">-${registro.cantidad} $</p>

			<button class="btn btn-secondary btn-delete" data-id=${id} data-money=${registro.cantidad}>Eliminar</button>
		</div>`;

		const btnsDelete = document.querySelectorAll(`.btn-delete`)
		btnsDelete.forEach(btn => {
			btn.addEventListener('click',async (e) => {
				console.log(e.target.dataset.id)
				await deleteEgreso(e.target.dataset.id)
				await mostrarRegistro()
				await mostrarMoney()
			})
		})
	});
}

/*accede a los docuemtnos*/
const getMoney = () => db.collection("registro").get();
const getMenos = () => db.collection("egreso").get();
async function mostrarMoney() {
	total = 0
	/*formatea el registro cada que se llama la funcion*/
	moneyCard.innerHTML = '';
	/*accede a los datos*/
	const getMoneyData = await getMoney()
	const getMenosData = await getMenos()
	/*cada que pasa por un documento suma su cantidad*/
	getMoneyData.forEach((doc) =>{
		const money = doc.data()
		console.log(money.cantidad)
		
		total += parseInt(money.cantidad)

	});
	/*cada que pasa por un documento resta su cantidad*/
	getMenosData.forEach((doc) =>{
		const money = doc.data()
		console.log(money.cantidad)
		
		total -= parseInt(money.cantidad)

	});
	/*status*/
	if (total > 10000) {
		statusCard.innerHTML = `
		<div class="bg-primary col py-2" style="margin-left: 15px">
			<p class="text-center m-0 text-light" style="font-size: 1.5em; margin-top: 5px">Estado</p>
		</div>
		<div class="col m-0 py-2">
			<p class="text-center m-0" style="font-size: 1.5em; margin-top: 5px">Ganando 📈</p>
		</div>`;
		}
	else if (total < 0) {
		statusCard.innerHTML = `
		<div class="bg-danger col py-2" style="margin-left: 15px">
			<p class="text-center m-0 text-light" style="font-size: 1.5em; margin-top: 5px">Estado</p>
		</div>
		<div class="col m-0 py-2">
			<p class="text-center m-0" style="font-size: 1.5em; margin-top: 5px">Perdiendo 📉</p>
		</div>`;
		}
	else{
		statusCard.innerHTML = `
		<div class="bg-primary col py-2" style="margin-left: 15px">
			<p class="text-center m-0 text-light" style="font-size: 1.5em; margin-top: 5px">Estado</p>
		</div>
		<div class="col m-0 py-2">
			<p class="text-center m-0" style="font-size: 1.5em; margin-top: 5px">Neutro 🐤</p>
		</div>`;
		}

	moneyCard.innerHTML = `
		<div class="bg-primary col py-2" style="margin-left: 15px">
			<p class="text-center m-0 text-light" style="font-size: 1.5em; margin-top: 5px">Total</p>
		</div>
		<div class="col m-0 py-2">
			<p class="text-center m-0" style="font-size: 1.5em; margin-top: 5px">${total}$</p>
		</div>`;
}

/*cuando se carga el crud se ejecuta...*/
window.addEventListener("DOMContentLoaded", async (e) => {
	await mostrarRegistro()
	await mostrarMoney()
})

/*formulario de ingreso*/
moneyForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const title = moneyForm["money-title"].value
	const cantidad = parseInt(moneyForm["money-cantidad"].value)

	await save(title, cantidad)
	console.log(`Enviando => ${title}::${cantidad}`);

	await mostrarRegistro()
	await mostrarMoney()
});

/*formulario del egreso*/
egresoForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const title = egresoForm["egreso-title"].value
	const cantidad = parseInt(egresoForm["egreso-cantidad"].value)

	await saveEgreso(title, cantidad)
	console.log(`Enviando => ${title}::${cantidad}`);

	await mostrarRegistro()
	await mostrarMoney()
});