document.getElementById("submit-button").addEventListener('click',function (evt)
{
  evt.preventDefault();

  var formulario = document.getElementById("formulario");

  var local = document.getElementById("local").value;
  var horario = document.getElementById("horario").value;
  var data = document.getElementById("data").value;

  var localDiv = document.getElementById("local-div");
  var localError = document.getElementById("local-error");
  var horarioDiv = document.getElementById("horario-div");
  var horarioError = document.getElementById("horario-error");
  var dataDiv = document.getElementById("data-div");
  var dataError = document.getElementById("data-error");

  var send = true;

  if(local == "")
  {
    send = false;

    localDiv.className = "form-group row has-error has-feedback";
    localError.className = "glyphicon glyphicon-remove form-control-feedback";
  } else {
    localDiv.className = "form-group row has-success has-feedback";
    localError.className = "glyphicon glyphicon-ok form-control-feedback";
  }

  if(horario == "")
  {
    send = false;

    horarioDiv.className += " has-error has-feedback";
    horarioError.className = "glyphicon glyphicon-remove form-control-feedback";
  } else {
    horarioDiv.className = "form-group row has-success has-feedback";
    horarioError.className = "glyphicon glyphicon-ok form-control-feedback";
  }

  if(data == "")
  {
    send = false;

    dataDiv.className += " has-error has-feedback";
    dataError.className = "glyphicon glyphicon-remove form-control-feedback";
  } else {
    dataDiv.className = "form-group row has-success has-feedback";
    dataError.className = "glyphicon glyphicon-ok form-control-feedback";
  }

  if(send)
  {
    var dados = {};
    for (var i = 0, max = formulario.length; i < max; ++i) {
      var input = formulario[i];
      if (input.name) {
        console.log(input.type);
        if(((input.type != "radio" && input.type != "checkbox") || (input.type == "radio" && input.checked == true) || (input.type == "checkbox" && input.checked == true)))
          dados[input.name] = input.value;
      }
    }

    console.log(dados);

    // requisição HTTP
    var xhr = new XMLHttpRequest();
    xhr.open(formulario.method, formulario.action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // enviar os dados em JSON
    xhr.send(JSON.stringify(dados));

    xhr.onloadend = function () {
    };
  }
});
