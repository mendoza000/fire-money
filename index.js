const db = firebase.firestore()
let total = 0
restar = false

console.log("Iniciando...");

const moneyForm = document.getElementById('money-form');
const registroContainer = document.getElementById('registro-container');
const moneyCard = document.getElementById('money');
const statusCard = document.getElementById('status');

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

const deleteRegistro = id => db.collection("registro").doc(id).delete()

const getRegistro = () => db.collection("registro").get();
async function mostrarRegistro() {
	/*formatea el registro cada que se llama la funcion*/
	registroContainer.innerHTML = '';
	const getRegistroData = await getRegistro()

	getRegistroData.forEach((doc) =>{
		const registro = doc.data()
		const id = doc.id

		registroContainer.innerHTML += `
		<div class="card card-body text-center p-4 shadow-sm my-2">
			<h3 class="border-bottom border-primary">${registro.title}</h3>

			<p class="text-center" style="font-size: 1.5em">${registro.cantidad} $</p>

			<button class="btn btn-secondary btn-delete" data-id=${id} data-money=${registro.cantidad}>Eliminar</button>
		</div>`;

		const btnsDelete = document.querySelectorAll(`.btn-delete`)
		btnsDelete.forEach(btn => {
			btn.addEventListener('click',async (e) => {
				console.log(e.target.dataset.id)
				await deleteRegistro(e.target.dataset.id)
				await mostrarRegistro()
				total -= e.target.dataset.money
				moneyCard.innerHTML = `
		<p class="text-center m-0" style="font-size: 1.5em">${total} $</p>`;
				if (total >>> 10000) {
					statusCard.innerHTML = '<p class="text-center m-0" style="font-size: 1.5em">Ganando 📈</p>';
					}
				else if (total <= 0) {
					statusCard.innerHTML = '<p class="text-center m-0" style="font-size: 1.5em">Perdiendo 📉</p>';
					}
				else{
					statusCard.innerHTML = '<p class="text-center m-0" style="font-size: 1.5em">Neutro 🐤</p>';
				}
			})
		})
	});
}

const getMoney = () => db.collection("registro").get();
async function mostrarMoney() {
	/*formatea el registro cada que se llama la funcion*/
	moneyCard.innerHTML = '';
	const getMoneyData = await getMoney()

	getMoneyData.forEach((doc) =>{
		const money = doc.data()
		console.log(money.cantidad)
		
		total += parseInt(money.cantidad, 10)

	});

	if (total >>> 1000) {
		statusCard.innerHTML = '<p class="text-center m-0" style="font-size: 1.5em">Ganando 📈</p>';
		}
	else if (total << 0) {
		statusCard.innerHTML = '<p class="text-center m-0" style="font-size: 1.5em">Perdiendo 📉</p>';
		}
	else{
		statusCard.innerHTML = '<p class="text-center m-0" style="font-size: 1.5em">Neutro 🐤</p>';
		}

	moneyCard.innerHTML = `
		<p class="text-center m-0" style="font-size: 1.5em">${total} $</p>`;
}

window.addEventListener("DOMContentLoaded", async (e) => {
	await mostrarRegistro()
	await mostrarMoney()
})

moneyForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const title = moneyForm["money-title"].value
	const cantidad = moneyForm["money-cantidad"].value

	await save(title, cantidad)
	console.log(`Enviando => ${title}::${cantidad}`);
	await mostrarRegistro()
	await mostrarMoney()

});