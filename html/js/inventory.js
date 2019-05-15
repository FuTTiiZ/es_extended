function closeMenu() {
  setActive(tab, false);
  setTab(welcome);
  tab = 'welcome';
  $.post('http://es_extended/close', JSON.stringify({}));
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
            <li id="${item.value}" name="${item.name}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  ${item.label} <span class="${item.value === 'black_money' ? 'red-' : ''}price">${formatPrice(item.count)}</span>
                </p>
              </div>
            </li>`;
        break;
        case 'personal':
          $('#containerList')[0].innerHTML += `
            <li id="${item.value}" name="${item.name}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  ${item.label}
                </p>
              </div>
            </li>`;
        break;
        default:
          $('#containerList')[0].innerHTML += `
            <li id="${item.value}" name="${item.name}" amount="${item.count}" type="${item.type}" class="inv-item">
              <div>
                <p>
                  <b>${formatItem(item.name) + item.label}
              </div>
            </li>`;
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

// Luk menuen med "ESC" knappen på tasteturet
$(document).keyup(function (data) {
  if (data.which == 27 || data.which == 8 || data.which == 113) {
    closeMenu();
  }
});

// Luk menuen med "x" oppe in højre hjørne
$('.x-container').bind('click', function() {
  closeMenu();
});