document.getElementById("submit-button").addEventListener('click',function (evt)
{
  evt.preventDefault();

  var local = document.getElementById("local").value;
  var horario = document.getElementById("horario").value;
  var data = document.getElementById("data").value;

  var localDiv = document.getElementById("local-div");
  var localError = document.getElementById("local-error");
  var horarioDiv = document.getElementById("horario-div");
  var horarioError = document.getElementById("horario-error");
  var dataDiv = document.getElementById("data-div");
  var dataError = document.getElementById("data-error");

  if(local == "")
  {
    localDiv.className = "form-group row has-error has-feedback";
    localError.className = "glyphicon glyphicon-remove form-control-feedback";
  } else {
    localDiv.className = "form-group row has-success has-feedback";
    localError.className = "glyphicon glyphicon-ok form-control-feedback";
  }

  if(horario == "")
  {
    horarioDiv.className += " has-error has-feedback";
    horarioError.className = "glyphicon glyphicon-remove form-control-feedback";
  } else {
    horarioDiv.className = "form-group row has-success has-feedback";
    horarioError.className = "glyphicon glyphicon-ok form-control-feedback";
  }

  if(data == "")
  {
    dataDiv.className += " has-error has-feedback";
    dataError.className = "glyphicon glyphicon-remove form-control-feedback";
  } else {
    dataDiv.className = "form-group row has-success has-feedback";
    dataError.className = "glyphicon glyphicon-ok form-control-feedback";
  }
});
