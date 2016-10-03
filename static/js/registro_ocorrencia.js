document.getElementById("submit-button").addEventListener('click',function (evt)
{
  evt.preventDefault();

  var local = document.getElementById("local").value;

  if(local == "")
  {
    var localDiv = document.getElementById("local-div");
    var localError = document.getElementById("local-error");

    localDiv.className += " has-error has-feedback";
    localError.style.visibility = "visible";
  }
});
