google.charts.load('current', {
  'packages': ['table']
});
var database = firebase.database();
var numbers;
var data, table;

google.charts.setOnLoadCallback(function () {

  firebase.database().ref('/numbers').once('value').then(function (snapshot) {
    numbers = snapshot.val();
    drawTable();
  });
});


function drawTable() {
  data = new google.visualization.DataTable();
  data.addColumn('string', 'First Name');
  data.addColumn('string', 'Last Name');
  data.addColumn('string', 'Phone Number');
  data.addColumn('string', 'Reason for Visit');
  data.addColumn('string', 'Time In');
  data.addColumn('string', 'Time Out');
  data.addColumn('boolean', 'Still in Building');


  table = new google.visualization.Table(document.getElementById('table_div'));

  var phoneNumber, inBuilding, timeOut;
  for (var number in numbers) {
    phoneNumber = number;
    if (phoneNumber.charAt(0) == '+') {
      phoneNumber = '(' + number.substr(2, 3) + ')-' + number.substr(5, 3) + '-' + number.substr(8, 3);
    }
    if (numbers[number].timeout == '') {
      inBuilding = true;
      timeOut = '';
    } else {
      inBuilding = false;
      timeOut = new Date(numbers[number].timeout).toLocaleString().toString();
    }
    data.addRow([numbers[number].first, numbers[number].last, phoneNumber, numbers[number].reason, new Date(numbers[number].timein).toLocaleString().toString(), timeOut, inBuilding]);
  }

  console.log("done");
  table.draw(data, {
    showRowNumber: true,
    width: '100%',
    height: '100%'
  })
}

//data.addRow(['Ayush', 'Goyal', 'Visit', 23423, 24334, true])