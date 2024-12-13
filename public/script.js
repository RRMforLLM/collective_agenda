document.addEventListener('DOMContentLoaded', loadAgenda);

const audioPlayer = document.getElementById('audio-player');
const visualizer = document.getElementById('visualizer');

function startAudio() {
    audioPlayer.play().then(() => {
        console.log("Audio playback started.");
    }).catch(error => {
        console.error("Audio playback failed:", error);
    });

    document.removeEventListener('click', startAudio);
}

document.addEventListener('click', startAudio);

visualizer.addEventListener('click', () => {
    audioPlayer.muted = !audioPlayer.muted;
    visualizer.style.opacity = audioPlayer.muted ? '0.5' : '1';
});

function openAddModal() {
    document.getElementById('addModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

function loadAgenda() {
    fetch('/api/agenda')
        .then(response => response.json())
        .then(data => {
            const agendaContainer = document.getElementById('agenda-list');
            agendaContainer.innerHTML = '';

            data.forEach((item, index) => {
                const agendaItem = document.createElement('div');
                agendaItem.classList.add('agenda-item');
                agendaItem.innerHTML = `
                    <div>
                        <strong>${item.subject}</strong><br>
                        <em>${item.details}</em><br>
                        <div class="date-block">
                            <span>Emitida: ${item.emissionDate}</span><br>
                            <span>Límite: ${item.deadlineDate}</span>
                        </div>
                    </div>
                    <button onclick="removeElement(${index})">Eliminar</button>
                `;
                agendaContainer.appendChild(agendaItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar la agenda:', error);
        });
}

function addElement() {
    const subject = document.getElementById('subject').value;
    const details = document.getElementById('details').value;
    const emissionDate = document.getElementById('emissionDate').value;
    const deadlineDate = document.getElementById('deadlineDate').value;
    const ckey = prompt("Ingresa la clave para el elemento.");

    if (!subject || !details || !emissionDate || !deadlineDate || !ckey) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const newElement = { subject, details, emissionDate, deadlineDate, ckey };

    fetch('/api/agenda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newElement)
    })
        .then(() => {
            closeAddModal();
            loadAgenda();
        })
        .catch(error => {
            console.error('Error al agregar el elemento:', error);
        });
}

function removeElement(index) {
    fetch('/api/agenda')
        .then(response => response.json())
        .then(data => {
            const ckey = data[index].ckey;
            const password = prompt("Ingresa la clave del propietario.");

            if (password === ckey) {
                fetch(`/api/agenda/${index}`, {
                    method: 'DELETE'
                })
                    .then(() => loadAgenda())
                    .catch(error => {
                        console.error('Error al eliminar el elemento:', error);
                    });
            } else {
                alert("La clave ingresada es incorrecta.");
            }
        })
        .catch(error => {
            console.error('Error al cargar la agenda:', error);
        });
}

function clearAll() {
    if (confirm("¿Seguro que deseas eliminar todos los elementos?")) {
        hotcheeto = prompt("Ingresa la clave del administrador.")
        if (hotcheeto == "mostt"){
            fetch('/api/agenda', {
                method: 'DELETE'
            })
                .then(() => loadAgenda())
                .catch(error => {
                    console.error('Error al eliminar todos los elementos:', error);
                });
        } else {
            alert("La clave ingresada es incorrecta.")
        }
    }
}