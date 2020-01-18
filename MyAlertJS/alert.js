class Etoast {
  constructor(msg, alertType = 'normal') {
    this.injectHTML(msg, alertType)
    this.alertContainer = document.getElementById('eAlert-container');
    this.alertText = document.getElementById('eAlert__item');
    this.alertBtn = document.getElementById('eAlert__btn');
    this.showAlert();
    this.events();
  }

  injectHTML(msg, alertType) {
    try {
      if(msg) {
        document.body.insertAdjacentHTML('afterbegin', `
          <div id="eAlert-container" class="eAlert-container show ${alertType === 'danger' ? 'danger' : 'normal'}">
            <p id="eAlert__item">${msg}</p>
            <button id="eAlert__btn">OK</button>
          </div>
        `)
      } else {
        throw 'Specify alert message'
      }

    } catch (err) {
      console.error('Alert message missing:', err)
    }
  }
  
  showAlert() {
    this.alertContainer.classList.add('show')
  }

  events() {
    this.alertBtn.addEventListener('click', () => {
      this.alertContainer.classList.remove('show')
    })

    // remove the alert after 5s
    setTimeout(() => {
      if(this.alertContainer.classList.contains('show')){
        this.alertContainer.classList.remove('show')
      }
    }, 1500)
  }
}
new Etoast('Your email has been sent successfully.', 'danger')