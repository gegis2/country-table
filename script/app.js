var state = [];
var curPageState = { page: 1, order: '', text: '', date: '' };
var initData = {};
var curId = 0;
//countries?page=1&order=asc&text=Lietuva&date=2019-07-02

var validData = { name: false, area: false, population: false, code: false };

//----------------Teksto Ivestys
const createInputElement = nr => {
  const el = document.createElement(`input`);
  if (nr == 1) {
    el.classList.add(`countryBox`);
    el.id = `countryBox`;
    el.placeholder = 'pvz.(liet....)';
  } else {
    el.classList.add(`dateBox`);
    el.id = `dateBox`;
    el.placeholder = 'pvz.(2019-08-06)';
  }
  el.style.marginLeft = '5px';
  return el;
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
    document.getElementById('phone').value = `Pliuso ženklas ir skaičiai`;
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

function phoneNum(val) {
  val = val.split('');
  if (val[0] == '+') {
    val[0] = '';
  } else {
    return false;
  }
  val = val.join('');
  return /^\d+$/.test(val);
}

function allNumbers(val) {
  return /^\d+$/.test(val);
}

function date(val) {
  let re = /^\d{4}\-\d{2}\-\d{2}$/;
  if (!val.match(re)) {
    return false;
  } else return true;
}
//----------------Lenteles
const initTableRows = (country, nr) => {
  const el = document.createElement(`tr`);
  let cell = document.createElement(`td`);

  cell.innerHTML = nr;
  el.appendChild(cell);

  for (let [key, value] of Object.entries(country)) {
    if (key != `id`) {
      let cells = document.createElement(`td`);
      cells.innerHTML = value;
      el.appendChild(cells);
      if (key == `name`) {
        var createClickHandler = function(el) {
          cells.classList.add(`nameCell`);
          return function() {
            tableOnClick(el);
          };
        };
        cells.onclick = createClickHandler(el);
      }
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

const tableData = () => {
  const SearchData = [];
  const table = document.getElementById(`items`);
  Array.from(table.children).forEach(_bodyRowEl => {
    SearchData.push(
      Array.from(_bodyRowEl.children).map(_cellEl => {
        return _cellEl.innerHTML;
      })
    );
  });
  return SearchData;
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
    } else document.getElementById(`countryBox`).value = ``;
  } else if (nr == 2) {
    if (date(searchText)) {
      curPageState.date = searchText;
      curPageState.page = 1;
    } else {
      document.getElementById(`dateBox`).value = ``;
    }
  }
};

//----------------Elementu vaizdavimas
const formView = () => {
  document.getElementById(`create`).style.display = `block`;
  document.getElementById(`btn_back`).style.display = `block`;
  document.getElementById(`formContainer`).style.display = `block`;
  document.getElementById(`main`).style.display = `none`;
  document.getElementById(`countryBoxContainer`).style.display = `none`;
  document.getElementById(`tableContainter`).style.display = `none`;
  document.getElementById(`btn_create`).style.display = `none`;
};

const mainView = () => {
  document.getElementById(`create`).style.display = `none`;
  document.getElementById(`btn_back`).style.display = `none`;
  document.getElementById(`btn_createConfirm`).style.display = `none`;
  document.getElementById(`btn_updateConfirm`).style.display = `none`;
  document.getElementById(`formContainer`).style.display = `none`;
  document.getElementById(`main`).style.display = `block`;
  document.getElementById(`countryBoxContainer`).style.display = `block`;
  document.getElementById(`tableContainter`).style.display = `block`;
  document.getElementById(`btn_create`).style.display = `block`;
};

//----------------Mygtukai
function deleteOnClick(row) {
  let item = initData.filter(_item => {
    if (_item.name == row.children[1].innerHTML) {
      return _item;
    }
  });
  item = item[0];
  deleteCountry(item.id);
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
  countryRefreshRequest();
});

document.getElementById(`down`).addEventListener(`click`, function() {
  curPageState.order = `desc`;
  countryRefreshRequest();
});

document.getElementById(`prev`).addEventListener(`click`, function() {
  if (curPageState.page > 1) {
    curPageState.page--;
    document.getElementById(`active`).innerHTML = curPageState.page;
    countryRefreshRequest();
  }
});

document.getElementById(`next`).addEventListener(`click`, function() {
  if (initData.length == 10) {
    curPageState.page++;
    document.getElementById(`active`).innerHTML = curPageState.page;
    countryRefreshRequest();
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
    validData.code = phoneNum(document.getElementById('phone').value);

    let check = true;
    let updated = {};
    updated.name = document.getElementById('name').value;
    updated.area = document.getElementById('teritory').value;
    updated.population = document.getElementById('population').value;
    updated.calling_code = document.getElementById('phone').value;
    for (var k in validData) {
      if (!validData.hasOwnProperty(k)) continue;
      if (validData[k] === false) {
        console.log(k);
        check = false;
      }
    }
    if (check) {
      setTimeout(function() {
        newCountry(JSON.stringify(updated));
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
    validData.code = phoneNum(document.getElementById('phone').value);

    let check = true;
    let updated = {};
    updated.name = document.getElementById('name').value;
    updated.area = document.getElementById('teritory').value;
    updated.population = document.getElementById('population').value;
    updated.calling_code = document.getElementById('phone').value;
    for (var k in validData) {
      if (!validData.hasOwnProperty(k)) continue;
      if (validData[k] === false) {
        console.log(k);
        check = false;
      }
    }
    if (check) {
      setTimeout(function() {
        updateCountry(curId, JSON.stringify(updated));
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

function tableOnClick(row) {
  let id = initData.filter(_item => {
    if (_item.name == row.children[1].innerHTML) {
      return _item.id;
    }
  });
  id = id[0].id;
  location.href = './cities.html?countryId=' + id;
}

//----------------API uzklausos

const countryRequest = () => {
  var request = new XMLHttpRequest();
  request.open(`GET`, `https://akademija.teltonika.lt/api1/countries`, true);
  request.onload = function() {
    var data = JSON.parse(this.response);
    var nr = 0;
    if (request.status == 200) {
      const table = document.getElementById(`items`);
      if (data.countires.length == 10) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`prev`).style.display = `none`;
      }
      initData = data.countires;
      data.countires.forEach(country => {
        nr++;
        table.appendChild(initTableRows(country, nr));
      });
    } else {
      console.log(`countries load error`);
    }
  };
  request.send();
};

const countryRefreshRequest = () => {
  var request = new XMLHttpRequest();
  var requestString = `https://akademija.teltonika.lt/api1/countries?`;
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
      initData = data.countires;
      if (data.countires.length < 10 && curPageState.page > 1) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`next`).style.display = `none`;
        document.getElementById(`prev`).style.display = `block`;
      }
      if (data.countires.length < 10 && curPageState.page == 1) {
        document.getElementById(`paginationContainer`).style.display = `none`;
      }
      if (data.countires.length == 10 && curPageState.page == 1) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`next`).style.display = `block`;
        document.getElementById(`prev`).style.display = `none`;
      }
      if (data.countires.length == 10 && curPageState.page == 1) {
        document.getElementById(`paginationContainer`).style.display = `block`;
        document.getElementById(`next`).style.display = `block`;
        document.getElementById(`prev`).style.display = `none`;
      }

      initData = data.countires;
      data.countires.forEach(country => {
        nr++;
        table.appendChild(initTableRows(country, nr));
      });
    } else {
      console.log(`countries load error`);
    }
  };
  request.send();
};

const newCountry = json => {
  let request = new XMLHttpRequest();
  request.open(`POST`, `https://akademija.teltonika.lt/api1/countries`, true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.onload = function() {
    if (request.status == 200) {
      countryRefreshRequest();
      alert('Šalis pridėta sėkmingai');
    } else {
      console.log(`country add error`);
    }
  };
  request.send(json);
};

const updateCountry = (id, json) => {
  let request = new XMLHttpRequest();
  request.open(
    `PUT`,
    `https://akademija.teltonika.lt/api1/countries/` + id,
    true
  );
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.onload = function() {
    if (request.status == 200) {
      countryRefreshRequest();

      alert('Šalis atnaujinta sėkmingai');
    } else {
      console.log(`country add error`);
    }
  };
  request.send(json);
};

const deleteCountry = id => {
  let request = new XMLHttpRequest();
  request.open(
    `DELETE`,
    `https://akademija.teltonika.lt/api1/countries/` + id,
    true
  );
  request.onload = function() {
    if (request.status == 200) {
      countryRefreshRequest();
      alert('Šalis ištrinta sėkmingai');
    } else {
      console.log(`country delete error`);
    }
  };
  request.send();
};

//----------------Paleidimo funkcija

const fillContent = data => {
  document.getElementById('name').value = data.name;
  document.getElementById('teritory').value = data.area;
  document.getElementById('population').value = data.population;
  document.getElementById('phone').value = data.calling_code;
};

const clearContent = () => {
  document.getElementById('name').value = '';
  document.getElementById('teritory').value = '';
  document.getElementById('population').value = '';
  document.getElementById('phone').value = '';
};

const init = () => {
  countryRequest();
  document
    .getElementById(`countryBoxContainer`)
    .appendChild(createInputElement(1));
  const searchInput = document.getElementById(`countryBox`);
  searchInput.addEventListener(`change`, e => {
    countryRefreshRequest(search(e.target.value, 1));
  });
  document
    .getElementById(`countryBoxContainer`)
    .appendChild(createInputElement(2));
  const searchInput2 = document.getElementById(`dateBox`);
  searchInput2.addEventListener(`change`, e => {
    countryRefreshRequest(search(e.target.value, 2));
  });
};

init();
