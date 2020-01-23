var curCountry = {};
var countryId = 0;
var initData = {};
var curPageState = { page: 1, order: '', text: '', date: '' };

var validData = { name: false, area: false, population: false, code: false };
//----------------Mygtukai

document.getElementById(`btn_countries`).addEventListener(`click`, function() {
  location.href = './index.html';
});

function deleteOnClick(row) {
  let item = initData.filter(_item => {
    if (_item.name == row.children[1].innerHTML) {
      return _item;
    }
  });
  item = item[0];
  deleteCity(item.id);
}

function editOnClick(row) {
  let item = initData.filter(_item => {
    if (_item.name == row.children[1].innerHTML) {
      return _item.id;
    }
  });
  item = item[0];
  document.getElementById(`btn_updateConfirm`).style.display = `block`;
  formView();
  fillContent(item);
  curId = item.id;
}

document.getElementById(`btn_create`).addEventListener(`click`, function() {
  document.getElementById(`btn_createConfirm`).style.display = `block`;
  formView();
});

document.getElementById(`up`).addEventListener(`click`, function() {
  curPageState.order = `asc`;
  cityRefreshRequest(countryId);
});

document.getElementById(`down`).addEventListener(`click`, function() {
  curPageState.order = `desc`;
  cityRefreshRequest(countryId);
});

document.getElementById(`prev`).addEventListener(`click`, function() {
  if (curPageState.page > 1) {
    curPageState.page--;
    document.getElementById(`active`).innerHTML = curPageState.page;
    cityRefreshRequest(countryId);
  }
});

document.getElementById(`next`).addEventListener(`click`, function() {
  if (initData.length == 10) {
    curPageState.page++;
    document.getElementById(`active`).innerHTML = curPageState.page;
    cityRefreshRequest(countryId);
  }
});

document
  .getElementById(`btn_createConfirm`)
  .addEventListener(`click`, function() {
    document.getElementById('name').style.backgroundColor = `white`;
    document.getElementById('teritory').style.backgroundColor = `white`;
    document.getElementById('population').style.backgroundColor = `white`;
    document.getElementById('phone').style.backgroundColor = `white`;

    validData.name = allLetter(document.getElementById('name').value);
    validData.area = allNumbers(document.getElementById('teritory').value);
    validData.population = allNumbers(
      document.getElementById('population').value
    );
    validData.code = post(document.getElementById('phone').value);

    let check = true;
    let updated = {};
    updated.name = document.getElementById('name').value;
    updated.area = document.getElementById('teritory').value;
    updated.population = document.getElementById('population').value;
    updated.postcode = document.getElementById('phone').value;
    updated.country_id = countryId;
    for (var k in validData) {
      if (!validData.hasOwnProperty(k)) continue;
      if (validData[k] === false) {
        check = false;
      }
    }
    if (check) {
      setTimeout(function() {
        newCity(JSON.stringify(updated));
      }, 200);
      mainView();
      clearContent();
    } else {
      badInput();
    }
  });

document
  .getElementById(`btn_updateConfirm`)
  .addEventListener(`click`, function() {
    document.getElementById('name').style.backgroundColor = `white`;
    document.getElementById('teritory').style.backgroundColor = `white`;
    document.getElementById('population').style.backgroundColor = `white`;
    document.getElementById('phone').style.backgroundColor = `white`;

    validData.name = allLetter(document.getElementById('name').value);
    validData.area = allNumbers(document.getElementById('teritory').value);
    validData.population = allNumbers(
      document.getElementById('population').value
    );
    validData.code = post(document.getElementById('phone').value);

    let check = true;
    let updated = {};
    updated.name = document.getElementById('name').value;
    updated.area = document.getElementById('teritory').value;
    updated.population = document.getElementById('population').value;
    updated.postcode = document.getElementById('phone').value;
    updated.country_id = countryId;
    for (var k in validData) {
      if (!validData.hasOwnProperty(k)) continue;
      if (validData[k] === false) {
        console.log(k);
        check = false;
      }
    }
    if (check) {
      setTimeout(function() {
        updateCity(curId, JSON.stringify(updated));
      }, 200);
      mainView();
      clearContent();
    } else {
      badInput();
    }
  });

document.getElementById(`btn_back`).addEventListener(`click`, function() {
  document.getElementById('name').style.backgroundColor = `white`;
  document.getElementById('teritory').style.backgroundColor = `white`;
  document.getElementById('population').style.backgroundColor = `white`;
  document.getElementById('phone').style.backgroundColor = `white`;
  mainView();
  clearContent();
});

//----------------vaizdo formos

const formView = () => {
  document.getElementById(`create`).style.display = `block`;
  document.getElementById(`btn_back`).style.display = `block`;
  document.getElementById(`formContainer`).style.display = `block`;
  document.getElementById(`headerText`).style.display = `none`;
  document.getElementById(`cityBoxContainer`).style.display = `none`;
  document.getElementById(`tableContainter`).style.display = `none`;
  document.getElementById(`btn_create`).style.display = `none`;
};

const mainView = () => {
  document.getElementById(`create`).style.display = `none`;
  document.getElementById(`btn_back`).style.display = `none`;
  document.getElementById(`btn_createConfirm`).style.display = `none`;
  document.getElementById(`btn_updateConfirm`).style.display = `none`;
  document.getElementById(`formContainer`).style.display = `none`;
  document.getElementById(`headerText`).style.display = `block`;
  document.getElementById(`cityBoxContainer`).style.display = `block`;
  document.getElementById(`tableContainter`).style.display = `block`;
  document.getElementById(`btn_create`).style.display = `block`;
};

//----------------tekstine ivestis

const createInputElement = nr => {
  const el = document.createElement(`input`);
  if (nr == 1) {
    el.classList.add(`cityBox`);
    el.id = `cityBox`;
    el.placeholder = 'pvz.(Viln..)';
  } else {
    el.classList.add(`dateBox`);
    el.id = `dateBox`;
    el.placeholder = 'pvz.(2019-08-06)';
  }
  el.style.marginLeft = '5px';
  return el;
};

const search = (searchText, nr) => {
  if (!searchText) {
    if (nr == 2) curPageState.date = '';
    else curPageState.text = '';
    return null;
  }
  if (nr == 1) {
    if (allLetter(searchText)) {
      curPageState.text = searchText;
      curPageState.page = 1;
    } else document.getElementById(`cityBox`).value = ``;
  } else if (nr == 2) {
    if (date(searchText)) {
      curPageState.date = searchText;
      curPageState.page = 1;
    } else {
      document.getElementById(`dateBox`).value = ``;
    }
  }
};

const badInput = () => {
  if (validData.name == false) {
    document.getElementById('name').style.backgroundColor = `pink`;
    document.getElementById('name').value = `Tik lietuviškos raidės`;
  }
  if (validData.area == false) {
    document.getElementById('teritory').style.backgroundColor = `pink`;
    document.getElementById('teritory').value = `Tik skaitmenys`;
  }
  if (validData.population == false) {
    document.getElementById('population').style.backgroundColor = `pink`;
    document.getElementById('population').value = `Tik skaitmenys`;
  }
  if (validData.code == false) {
    document.getElementById('phone').style.backgroundColor = `pink`;
    document.getElementById('phone').value = `Netinkamas formatas`;
  }
};

function allLetter(inputtxt) {
  var letters = /^[A-Za-z]+$/;
  var litLetters = 'ąčęėįšųūĄČĘĖĮŠŲŪžŽ ';
  litLetters = litLetters.split('');
  litLetters.forEach(ch => {
    if (inputtxt.includes(ch)) {
      inputtxt = inputtxt.split(ch);
      inputtxt = inputtxt.join(``);
    }
  });
  if (inputtxt.match(letters)) {
    return true;
  } else {
    return false;
  }
}

function allNumbers(val) {
  return /^\d+$/.test(val);
}

function post(val) {
  let re = /^[A-Za-z0-9][A-Za-z0-9\- ]{0,10}[a-z0-9]$/;
  if (!val.match(re)) {
    return false;
  } else return true;
}

function date(val) {
  let re = /^\d{4}\-\d{2}\-\d{2}$/;
  if (!val.match(re)) {
    return false;
  } else return true;
}

//----------------Lenteles

const initTableRows = (city, nr) => {
  const el = document.createElement(`tr`);
  let cell = document.createElement(`td`);

  cell.innerHTML = nr;
  el.appendChild(cell);

  for (let [key, value] of Object.entries(city)) {
    if (key != `id` && key != `country_id`) {
      let cells = document.createElement(`td`);
      cells.innerHTML = value;
      el.appendChild(cells);
    }
  }
  let delButt = document.createElement(`button`);
  delButt.id = `btn_del`;
  delButt.classList.add(`btn_del`);
  delButt.innerHTML = `Ištrinti`;

  const createDeleteClickHandler = el => {
    return function() {
      deleteOnClick(el);
    };
  };
  delButt.onclick = createDeleteClickHandler(el);

  let editButton = document.createElement(`button`);
  editButton.id = `edit_del`;
  editButton.classList.add(`btn_del`);
  editButton.innerHTML = `Redaguoti`;

  const createEditClickHandler = el => {
    return function() {
      editOnClick(el);
    };
  };
  editButton.onclick = createEditClickHandler(el);
  el.appendChild(editButton);
  el.appendChild(delButt);
  return el;
};

//----------------API uzklausos

const countryRequest = id => {
  let request = new XMLHttpRequest();
  request.open(
    `GET`,
    `https://akademija.teltonika.lt/api1/countries/${id}`,
    true
  );
  request.onload = function() {
    let data = JSON.parse(this.response);
    if (request.status == 200) {
      curCountry = data;
      const head = document.getElementById(`headerText`).innerHTML;
      document.getElementById(`headerText`).innerHTML =
        'Šalies (' + data.name + ')' + head;
    } else {
      console.log(`country load error`);
    }
  };
  request.send();
};

const citiesRequest = id => {
  let request = new XMLHttpRequest();
  request.open(`GET`, `https://akademija.teltonika.lt/api1/cities/${id}`, true);
  request.onload = function() {
    let data = JSON.parse(this.response);
    var nr = 0;
    initData = data;
    if (data.length == 10) {
      document.getElementById(`paginationContainer`).style.display = `block`;
      document.getElementById(`prev`).style.display = `none`;
    }
    if (request.status == 200) {
      const table = document.getElementById(`items`);
      data.forEach(city => {
        nr++;
        table.appendChild(initTableRows(city, nr));
      });
    } else {
      console.log(`Cities load error`);
    }
  };
  request.send();
};

const cityRefreshRequest = id => {
  var request = new XMLHttpRequest();
  var requestString = `https://akademija.teltonika.lt/api1/cities/${id}?`;
  if (curPageState.page > 1) {
    requestString += `page=` + curPageState.page + `&`;
  }
  if (curPageState.order != '') {
    requestString += `order=` + curPageState.order + `&`;
  }
  if (curPageState.text != '') {
    requestString += `text=` + curPageState.text + `&`;
  }
  if (curPageState.date != '') {
    requestString += `date=` + curPageState.date + `&`;
  }
  request.open(`GET`, requestString, true);
  request.onload = function() {
    var data = JSON.parse(this.response);
    var nr = 0;
    if (request.status == 200) {
      const table = document.getElementById(`items`);
      table.innerHTML = ``;
      initData = data;
      if (data.length < 10 && curPageState.page > 1) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`next`).style.display = `none`;
        document.getElementById(`prev`).style.display = `block`;
      }
      if (data.length < 10 && curPageState.page == 1) {
        document.getElementById(`paginationContainer`).style.display = `none`;
      }
      if (data.length == 10 && curPageState.page == 1) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`next`).style.display = `block`;
        document.getElementById(`prev`).style.display = `none`;
      }
      if (data.length == 10 && curPageState.page == 1) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`next`).style.display = `block`;
        document.getElementById(`prev`).style.display = `none`;
      }

      initData = data;
      data.forEach(city => {
        nr++;
        table.appendChild(initTableRows(city, nr));
      });
    } else {
      console.log(`countries load error`);
    }
  };
  request.send();
};

const deleteCity = id => {
  let request = new XMLHttpRequest();
  request.open(
    `DELETE`,
    `https://akademija.teltonika.lt/api1/cities/` + id,
    true
  );
  request.onload = function() {
    if (request.status == 200) {
      cityRefreshRequest(countryId);
      alert('Miestas ištrintas sėkmingai');
    } else {
      console.log(`City delete error`);
    }
  };
  request.send();
};

const newCity = json => {
  let request = new XMLHttpRequest();
  request.open(`POST`, `https://akademija.teltonika.lt/api1/cities`, true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.onload = function() {
    if (request.status == 200) {
      cityRefreshRequest(countryId);
      alert('Miestas pridėtas sėkmingai');
    } else {
      console.log(`City add error`);
    }
  };
  request.send(json);
};

const updateCity = (id, json) => {
  let request = new XMLHttpRequest();
  request.open(`PUT`, `https://akademija.teltonika.lt/api1/cities/` + id, true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.onload = function() {
    if (request.status == 200) {
      cityRefreshRequest(countryId);

      alert('Miestas atnaujintas sėkmingai');
    } else {
      console.log(`city add error`);
    }
  };
  request.send(json);
};

//----------------Paleidimo funkcija

const fillContent = data => {
  document.getElementById('name').value = data.name;
  document.getElementById('teritory').value = data.area;
  document.getElementById('population').value = data.population;
  document.getElementById('phone').value = data.postcode;
};

const clearContent = () => {
  document.getElementById('name').value = '';
  document.getElementById('teritory').value = '';
  document.getElementById('population').value = '';
  document.getElementById('phone').value = '';
};

const init = () => {
  countryId = location.search.split('countryId=')[1];
  countryRequest(countryId);
  citiesRequest(countryId);
  document
    .getElementById(`cityBoxContainer`)
    .appendChild(createInputElement(1));
  const searchInput = document.getElementById(`cityBox`);
  searchInput.addEventListener(`change`, e => {
    cityRefreshRequest(countryId, search(e.target.value, 1));
  });
  document
    .getElementById(`cityBoxContainer`)
    .appendChild(createInputElement(2));
  const searchInput2 = document.getElementById(`dateBox`);
  searchInput2.addEventListener(`change`, e => {
    cityRefreshRequest(countryId, search(e.target.value, 2));
  });
};
init();
