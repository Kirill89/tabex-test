var _ = require('lodash');
var express = require('express');
var useragent = require('express-useragent');
var app = express();

var users = {};

app.use(useragent.express());

app.get('/ping', function (req, res) {
  if (!users[req.query.token]) {
    users[req.query.token] = { t: +Date.now(), ua: req.useragent.source };
  }

  users[req.query.token].t = +Date.now();

  res.send('pong');
});

app.get('/stat', function (req, res) {
  var html = '<script>setTimeout(function() { window.location.reload() }, 2000)</script><table>';

  html+='<tr>';

  html+='<td>tab id</td>';
  html+='<td>last update</td>';
  html+='<td>status</td>';
  html+='<td>ua</td>';

  html+='</tr>';

  _.forEach(users, function (v, k) {
    html+='<tr>';

    html+='<td>' + k;
    html+='</td>';

    html+='<td>' + v.t;
    html+='</td>';

    if (v.t + 3000 > Date.now()) {
      html+='<td bgcolor="green">online';
      html+='</td>';
    } else {
      html+='<td bgcolor="red">offline';
      html+='</td>';
    }

    html+='<td>' + v.ua;
    html+='</td>';

    html+='</tr>';
  });

  html += '</table>';

  res.send(html);
});


app.use(express.static('set_interval'));

var server = app.listen(8181, function () {
  console.log('statistic: http://localhost:8181/stat');
  console.log('Worker: http://localhost:8181/ww.html');
  console.log('setInterval: http://localhost:8181/si.html');
});
