// Funzione per mostrare l'alert
function showAlert(message) {
    // Seleziona l'area di gioco
    const gameArea = document.querySelector('.titleAndGrid');
  
    // Crea il markup per l'alert
    const alertMessage = `
      <div class="game-alert" title="RESTART">
        <div class="game-alert-message">${message}</div>
      </div>
    `;
  
    // Aggiunge l'alert all'area di gioco
    gameArea.innerHTML = gameArea.innerHTML + alertMessage;
  
    // Seleziona l'elemento appena creato
    const alertElement = document.querySelector('.game-alert');
  
    // Aggiunge un listener per l'evento di click all'alert
    alertElement.addEventListener('click', function () {
      console.log('premuto');
      // Ricarica la pagina quando l'alert viene cliccato
      window.location.reload();
    });
  }