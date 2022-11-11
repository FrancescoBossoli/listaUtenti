var nome;
var cognome;
var radio;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var editing = "";
var dragged;
var deleting;

window.addEventListener('DOMContentLoaded', init);

function init() {
	nome = document.getElementById('nome');
	cognome = document.getElementById('cognome');
	addBtn = document.getElementById('scrivi');
	elencoHTML = document.getElementById('elenco');
	errore = document.getElementById('errore');
	erroreElenco = document.getElementById('erroreElenco');
	radio = document.querySelectorAll('input[name^="avatar"]');
	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener('click', (e) => {
		e.preventDefault();
		controlla();
	});
	nome.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addBtn.click();
		}
	});
	cognome.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addBtn.click();
		}
	});
}

function printData() {
	fetch('http://localhost:3000/elenco').then((response) => {
			return response.json();
		}).then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = '';
				let table = document.getElementById("table");
				let rows = Math.ceil(elenco.length/6);
				for (i=0; i < rows; i++) {
					let container = document.createElement('div');
					container.className = "container px-0";
					let row = document.createElement('div');
					row.className = "row";
					container.appendChild(row);
					let longcol = document.createElement('div');
					longcol.className = "col-12 d-flex justify-content-between";
					table.appendChild(container);
					container.appendChild(row);
					row.appendChild(longcol);
				}				
				elenco.map(function (element) {					
					let d = (Math.ceil(element.id/6))-1;
					let startColumn = document.querySelectorAll('div.col-12.d-flex.justify-content-between');
					let box = document.createElement('div');
					box.className = "text-center fw-bold col-4 col-md-2";
					let force = document.createElement('div');
					force.className = "w-100 d-none d-md-block";
					let userBox = document.createElement('div');
					userBox.className = "d-flex align-items-center justify-content-evenly";
					let buttonBox = document.createElement('div');
					buttonBox.className = "d-flex flex-column";
					let imgBox = document.createElement('div');
					imgBox.className = "text-center";
					nameBox = document.createElement('div');
					nameBox.className = "h";
					nameBox.innerHTML = `${element.nome} ${element.cognome}`;
					userBox.append(buttonBox, imgBox);
					box.append(nameBox,userBox);
					let img = document.createElement('img');
					img.setAttribute("src", element.avatar);
					imgBox.append(img);
					startColumn[d].append(box, force);
					let btnID = document.createElement('button');
					let btnDelete = document.createElement('button');
					let btnEdit = document.createElement('button');
					let btnSwap = document.createElement('button'); 
					btnID.className = "btn btn-success mb-1";
					btnDelete.className = "btn btn-danger mb-1";
					btnEdit.className = "btn btn-warning mb-1";
					btnSwap.className = "btn btn-primary";
					btnID.innerHTML = element.id;
					btnDelete.innerHTML = '<i class="bi bi-x-lg"></i>';
					btnDelete.setAttribute("data-bs-toggle", "modal");
					btnDelete.setAttribute("data-bs-target", "#popup");
					btnEdit.innerHTML = '<i class="bi bi-pencil"></i>';
					btnSwap.innerHTML = '<i class="bi bi-list"></i>';
					btnSwap.setAttribute("draggable", true);
					buttonBox.append(btnID, btnDelete, btnEdit, btnSwap);
					btnSwap.addEventListener("dragstart", () => {
						dragged = element.id;
					});					
					box.addEventListener("dragover", (e) => {
						e.preventDefault();
					});
					box.addEventListener("drop", () => {
						swapData(element.id, dragged);
					});
					btnDelete.addEventListener("click", (e) => {
						e.preventDefault();
						deleting = element.id;						
					});
					btnEdit.addEventListener("click", (e) => {
						e.preventDefault();
						nome.value = element.nome;
						cognome.value = element.cognome;
						editing = element.id;
					});					
				});
			} else {
				erroreElenco.innerHTML = 'Nessun elemento presente in elenco';
			}
		});
}

const popup = document.getElementById('popup')

popup.addEventListener('hidden.bs.modal', () => {
	console.log('prova');
});

function controlla() {	
	if (nome.value != '' && cognome.value != '') {
		let avatar;
		for (i=0; i < radio.length; i++) {
			if (radio[i].checked == true) {
				avatar = radio[i].previousElementSibling.firstChild.src.slice(22,39);
			}
		}
		let data = {
			nome: nome.value,
			cognome: cognome.value,
			avatar: avatar,
		};
		if (!(editing === "")) {
			editData(editing, data);
			editing = "";
		} else {
			addData(data);
		}
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}

async function addData(data) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

function clearForm() {
	nome.value = '';
	cognome.value = '';
}

async function deleteData(id) {
	let response = await fetch('http://localhost:3000/elenco/' + id, {
  		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(elenco),
	});	
}

async function editData(id, data) {	
	let response = await fetch('http://localhost:3000/elenco/' + id, {
  		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});		
}

function swapData(a, b) {
	if (a!=b) {
		let userA = [];
		let userB = [];	
		for (i=0; i<elenco.length; i++) {
			if (elenco[i].id == a) {
				userA = {
					nome: String(elenco[i].nome),
					cognome: String(elenco[i].cognome),
					avatar: String(elenco[i].avatar)
				};
			} else if (elenco[i].id == b) {
				userB = {
				nome: String(elenco[i].nome),
				cognome: String(elenco[i].cognome),
				avatar: String(elenco[i].avatar)
				};
			}
		}	
	setTimeout(editData(a, userB), 3000);
	setTimeout(editData(b, userA), 3000);
	}
}