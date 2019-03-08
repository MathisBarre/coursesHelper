/*var alertBox;

function showAlert(idAlert, func){
    if (document.querySelector(".alertBox") != null) {
        console.warn("Change alert box");
        document.querySelector(".alertBox").parentNode.removeChild(document.querySelector(".alertBox"));
       
    }
    alertBox = document.createElement("div");
    alertBox.id = idAlert;
    alertBox.classList.add("alertBox");

    var croceElt = document.createElement("a");
    croceElt.classList.add("croce");
    croceElt.textContent = "x";
    croceElt.addEventListener("click", function (e) {
        alertBox.parentNode.removeChild(alertBox);
    })
    alertBox.appendChild(croceElt);


    func()
    bodyElt.appendChild(alertBox);
}*/