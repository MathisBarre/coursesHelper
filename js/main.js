// Initialized JSON settings if the user don't have one
if (localStorage.getItem("appInfos") === null || localStorage.getItem("appInfos") === undefined || typeof(JSON.parse(localStorage.getItem("appInfos"))) != "object") {
    let obj = {
        "tasksList" : [
            {
                "title" : "Exemple : Terminer les deux derniers exercices du devoirs numéros 3 de physique chimie",
                "desc" : "CLIQUE DROIT POUR SUPPRIMER",
                "counter" : {
                    "isActive" : true,
                    "suffix" : "devoirs",
                    "nbMax" : 2,
                    "nb" : 0,
                },
            },
        ],
    };
    localStorage.setItem("appInfos" ,JSON.stringify(obj));
    console.log("local storage appInfos initialized")
}

/* TO DO JS */
var addBtnElt = document.querySelector("#addATaskBtn");
var bodyElt = document.querySelector("body");
var taskBox = document.querySelector("#toDoContent");

var TasksManager = {
    titleTaskInputElt : "",
    pTaskInputElt : "",
    showPanel() {
        showAlert("addTaskAlert", function(){
            let h1Elt = document.createElement("h1");
            h1Elt.textContent = "Ajouter une tâche";
            h1Elt.style.fontWeight = "bold";
            h1Elt.style.textAlign = "center";
            h1Elt.style.marginBottom = "5px"
            alertBox.appendChild(h1Elt)

            let formElt = document.createElement("form");

            let titleTaskLabelElt = document.createElement("label");
            titleTaskLabelElt.setAttribute("for","titleTaskInput");
            titleTaskLabelElt.textContent = "Titre de la tâche : ";
            formElt.appendChild(titleTaskLabelElt);

            titleTaskInputElt = document.createElement("input");
            titleTaskInputElt.type = "text";
            titleTaskInputElt.id = "titleTaskInput";
            formElt.appendChild(titleTaskInputElt);
           

            let brElt = document.createElement("br");
            formElt.appendChild(brElt);

            let pTaskLabelElt = document.createElement("label");
            pTaskLabelElt.textContent = "Description de la tâche : ";
            pTaskLabelElt.setAttribute("for","pTaskInput");
            formElt.appendChild(pTaskLabelElt)

            pTaskInputElt = document.createElement("input");
            pTaskInputElt.type = "text";
            formElt.appendChild(pTaskInputElt);

            let br1Elt = document.createElement("br");
            formElt.appendChild(br1Elt);

            let submitInputElt = document.createElement("input");
            submitInputElt.type = "submit";
            submitInputElt.addEventListener("click",TasksManager.addTask);
            formElt.appendChild(submitInputElt);
            
            alertBox.appendChild(formElt);

            
        });
        titleTaskInputElt.focus();
    },

    addTask(e) {
        e.preventDefault();

        var appInfos = localStorage.getItem("appInfos");
        var JSONappInfos = JSON.parse(appInfos);

        function counter(isActive,suffix,nbMax) {
            if (isActive != null) {
                this.isActive = isActive;
                this.suffix = suffix;
                this.nbMax = nbMax;
                this.nb = 0;
            } else {
                this.isActive = false;
            }
            
        }

        function taskObject(title,desc,isActive,suffix,nbMax) {
            this.title = title;
            this.desc = desc;
            this.counter = new counter(isActive,suffix,nbMax)
        }

        var taskObject = new taskObject(titleTaskInputElt.value,pTaskInputElt.value)
        JSONappInfos.tasksList.push(taskObject);
        localStorage.setItem("appInfos",JSON.stringify(JSONappInfos));

        titleTaskInputElt.value = "";
        titleTaskInputElt.focus();
        pTaskInputElt.value = "";

        TasksManager.showTasks();
    },

    showTasks() {
        var appInfos = localStorage.getItem("appInfos");
        console.log("appInfos = " + appInfos)
        var JSONappInfos = JSON.parse(appInfos);
        console.log(JSONappInfos.tasksList);

        taskBox.innerHTML = "";

        for (let i = 0; i < JSONappInfos.tasksList.length; i++) {
            const task = JSONappInfos.tasksList[i];

            divTaskElt = document.createElement("div");
            divTaskElt.classList.add("task");
            // Event listener to show a personalized context menu
            divTaskElt.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                showAlert("removeTask", function() {
                    let btn = document.createElement("button");
                    btn.textContent = "Supprimer";
                    // Event listener to remove a task
                    btn.addEventListener("click", function() {
                        alertBox.parentNode.removeChild(alertBox);
                        JSONappInfos.tasksList.splice(i,1);
                        localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                        TasksManager.showTasks();
                    });
                    alertBox.appendChild(btn);
                });
                alertBox.style.top = e.clientY + "px";
                alertBox.style.left = e.clientX + "px";
            });

            let titleTaskElt = document.createElement("h3");
            titleTaskElt.classList.add("titleTask");
            titleTaskElt.textContent = task.title;

            divTaskElt.appendChild(titleTaskElt);

            let descTaskElt = document.createElement("p");
            descTaskElt.classList.add("pTask");
            descTaskElt.textContent = task.desc;
            divTaskElt.appendChild(descTaskElt);

            // Counter init
            if (task.counter.isActive != false) {
                let counterElt = document.createElement("span");
                counterElt.classList.add("counterTask");

                let spanCount = document.createElement("span");
                spanCount.textContent = task.counter.nb;
                
                let spanCounterSuffix = document.createElement("span");
                spanCounterSuffix.textContent = task.counter.suffix + " / " + task.counter.nbMax;

                let imgMinusElt = document.createElement("img");
                imgMinusElt.classList.add("counterMinus","counterAction");
                imgMinusElt.src = "img/minus.svg";
                imgMinusElt.alt = "Action enlever une itération";
                imgMinusElt.addEventListener("click", function() {
                    let nb = Number(spanCount.textContent);
                    if (nb - 1 >= 0 ) {
                        spanCount.textContent = nb-1;
                        JSONappInfos.tasksList[i].counter.nb -= 1 ;
                        localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                    }
                })
                
                let imgPlusElt = document.createElement("img");
                imgPlusElt.classList.add("counterPlus","counterAction");
                imgPlusElt.src = "img/plus.svg";
                imgPlusElt.alt = "Action ajouter une itération";
                imgPlusElt.addEventListener("click", function() {
                    let nb = Number(spanCount.textContent);
                    if (nb + 1 <= task.counter.nbMax ) {
                        spanCount.textContent = nb+1;
                        JSONappInfos.tasksList[i].counter.nb += 1 ;
                        localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                    }
                })

                counterElt.appendChild(imgMinusElt);
                counterElt.appendChild(spanCount);
                counterElt.appendChild(spanCounterSuffix);
                counterElt.appendChild(imgPlusElt);
                descTaskElt.appendChild(counterElt);
            }

            taskBox.appendChild(divTaskElt);
        }

    }
}

addBtnElt.addEventListener("click", TasksManager.showPanel);

TasksManager.showTasks();