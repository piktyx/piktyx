const remote = require('electron').remote;

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const service_url = window.location.href;

const menu = new Menu();
menu.append(new MenuItem({ label: 'Reload Page',
  click() {
    window.location.reload();
  },
},
));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: 'Back',
  click() {
    window.history.back();
  },
},
));
menu.append(new MenuItem({ label: 'Forward',
  click() {
    window.history.forward();
  },
},
));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: 'Copy Current URL',
  click() {
    let dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  },
},
));
menu.append(new MenuItem({ label: 'Open in a new Window',
  click() {
    window.open(window.location.href);
  },
},
));


window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);