function closeMenu() {
  setActive(tab, false);
  setTab(welcome);
  tab = 'welcome';
  $.post('http://es_extended/close', JSON.stringify({}));
}

function postAction(obj) {
  $.post('http://es_extended/action', JSON.stringify(obj));
}

function formatPrice(price, kr) {
  return (!kr ? price.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' kr.' : price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
}

function formatItem(itemName) {
  let output;
  for (var i = 0; i < itemName.length; i++) {
    if (i === 0) {
      output = itemName.charAt(i).toUpperCase();
    } else {
      output += itemName.charAt(i);
    }
  }
  return output;
}

function setActive(e, on) {
  e = $('#' + e);
  if (on) {
    let cur = e.attr('class');
    e.attr('class', cur += ' clicked');
  } else if (!on) {
    let cur = e.attr('class');
    if (cur) {
      let newC = cur.replace('clicked', '');
      e.attr('class', newC);
    }
  }
}

function setTab(page) {
  $('#containerList')[0].innerHTML = page;
}

// Laver variabler
let tab = 'personal';
let welcome = $('#containerList')[0].innerHTML;
let items;

function updateItems(t) {
  for (var i = 0; i < Object.keys(items).length; i++) {
    let item = items[i];
    if (item.cat === t) {
      switch (item.cat) {
        case 'money':
          $('#containerList')[0].innerHTML += `
            <li id="${item.value}" name="${item.name}" category="${item.cat}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  ${item.label} <span class="${item.value === 'black_money' ? 'red-' : ''}price">${formatPrice(item.count)}</span>
                </p>
              </div>
            </li>`;
        break;
        case 'personal':
          $('#containerList')[0].innerHTML += `
            <li id="${item.value}" name="${item.name}" category="${item.cat}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  ${item.label}
                </p>
              </div>
            </li>`;
        break;
        case 'weapon':
          $('#containerList')[0].innerHTML += `
            <li id="${item.value}" name="${item.name}" category="${item.cat}" ammo="${item.ammo}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  <b>${formatItem(item.name) + item.label}
              </div>
            </li>`;
        break;
        default:
          $('#containerList')[0].innerHTML += `
            <li id="${item.value}" name="${item.name}" category="${item.cat}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  <b>${formatItem(item.name) + item.label}
              </div>
            </li>`;
        break;
      }
    }
  }
}

// Når serveren loader
$(document).ready(function() {
  window.addEventListener('message', function(event) {
    const data = event.data;
    if (data.type === 'inventory') {
      if (data.display === true) {
        tab = 'personal';
        items = data.items;

        setTab(welcome);
        setActive(tab, true);

        updateItems(tab);

        $('.inventory').show();
      } else if (data.display === false) {
        $('.inventory').hide();
      } else if (data.action === 'fetchGivePlayers') {

      }
    }
  });
});

$('#mainOptions').on('click', 'li.main-option', function() {
  setActive(tab, false);
  tab = $(this).attr('id');
  setActive(tab, true);

  setTab(`
    <li class="menu-header noselect">
      <div>
        <h1 id="catName">${$(this).attr('name')}</h1>
      </div>
    </li>
    <div class="shadow"></div>
  `);

  updateItems(tab);
});

let cardUp;
$('#containerList').on('click', 'li.inv-item', function() {
  setActive(tab, false);
  switch ($(this).attr('category')) {
    case 'personal':
      if ($(this).attr('id') === 'sygesikringskort') {
        setTab(`
          <li class="menu-header noselect">
            <div>
              <h1 id="catName">${$(this).attr('name')}</h1>
            </div>
          </li>
          <div class="shadow"></div>
          <li>
            ${!cardUp ? '<div id="seeCard" class="large-btn"><p><b>Se dit sygesikringskort</b></p></div>' : '<div id="seeCard" class="large-btn" style="background-color: red"><p><b>Pak dit sygesikringskort væk</b></p></div>'}
          </li>
          <li>
            <div id="showCard" class="large-btn">
              <p>
                <b>Vis dit sygesikringskort
              </p>
            </div>
          </li>
        `);
        $('#seeCard').bind('click', function() {
          if (!cardUp) {
            $('#seeCard').css('background-color', 'red');
            $('#seeCard p')[0].innerHTML = `<b>Pak dit sygesikringskort væk</b>`;
            postAction({type: 'seeCard', other: 'show'});
            cardUp = true;
          } else if (cardUp) {
            $('#seeCard').css('background-color', 'green');
            $('#seeCard p')[0].innerHTML = `<b>Se dit sygesikringskort</b>`;
            postAction({type: 'seeCard', other: 'hide'});
            cardUp = false;
          }
        });
        $('#showCard').bind('click', function() {
          postAction({type: 'showCard'});
        });
      }
    break;
    case 'weapon':
    let itemName = $(this).attr('id');
      setTab(`
        <li class="menu-header noselect">
          <div>
            <h1 id="catName">${$(this).attr('name')}</h1>
          </div>
        </li>
        <div class="shadow"></div>
        <li>
          <div id="giveAmmo" class="large-btn">
            <p>
              <b>Giv ammunition</b>
            </p>
          </div>
          <div style="text-align: center">
            <input id="ammoAmount" class="ammo-amount" type="number" value="0" min="${parseInt($(this).attr('ammo')) - (parseInt($(this).attr('ammo')) - 1)}" max="${$(this).attr('ammo')}">
          </div>
        </li>
        <li>
          <div id="giveWeapon" class="large-btn">
            <p>
              <b>Giv våben</b>
            </p>
          </div>
        </li>
        <li>
          <div id="removeWeapon" class="large-btn">
            <p>
              <b>Fjern våben</b>
            </p>
          </div>
        </li>
      `);
      $('#giveAmmo').bind('click', function() {
        postAction({
          type: 'giveammo',
          other: parseInt($('#ammoAmount').val()),
          item: itemName.toLowerCase()
        });
        $('#ammoAmount').val(0);
      });
      $('#giveWeapon').bind('click', function() {
        postAction({
          type: 'give',
          other: 'item_weapon',
          item: itemName
        });
      });
      $('#removeWeapon').bind('click', function() {

      });
    break;
    default:
      setTab(`
        <li class="menu-header noselect">
          <div>
            <h1 id="catName">${$(this).attr('name')}</h1>
          </div>
        </li>
        <div class="shadow"></div>
        <li>
          <div id="giveItem" class="large-btn">
            <p>
              <b>Giv genstand</b>
            </p>
          </div>
        </li>
        <li>
          <div id="removeItem" class="large-btn">
            <p>
              <b>Fjern genstand</b>
            </p>
          </div>
        </li>
      `);
      $('#giveItem').bind('click', function() {

      });
      $('#removeItem').bind('click', function() {

      });
    break;
  }
});

// Luk menuen med "ESC" knappen på tasteturet
$(document).keyup(function (data) {
  if (data.which == 27 || data.which == 113) {
    closeMenu();
  }
});

// Luk menuen med "x" oppe in højre hjørne
$('.x-container').bind('click', function() {
  closeMenu();
});
