/*
DEVELOPPEMENT BRANCH
Last modif :
    - Add mustahce system of templating
To do :
    - Add event
*/


// Initialized JSON settings if the user don't have one
if (localStorage.getItem("appInfos") === null || localStorage.getItem("appInfos") === undefined || typeof(JSON.parse(localStorage.getItem("appInfos"))) != "object") {
    let obj = {
        "tasksList" : [
            {
                "title" : "Exemple : Terminer les deux derniers exercices du devoirs numéros 3 de physique chimie",
                "desc" : "CLIQUE DROIT POUR SUPPRIMER",
                "placeInArray" : "0",
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
var tasksTemplate = document.querySelector("#toDoContent").innerHTML;

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
            this.placeInArray = JSONappInfos.tasksList.length;
            this.counter = new counter(isActive,suffix,nbMax);
        }

        var taskObject = new taskObject(titleTaskInputElt.value,pTaskInputElt.value)
        JSONappInfos.tasksList.push(taskObject);
        localStorage.setItem("appInfos",JSON.stringify(JSONappInfos));

        titleTaskInputElt.value = "";
        titleTaskInputElt.focus();
        pTaskInputElt.value = "";

        TasksManager.showTasks();
    },

    updateTask() {
        var appInfos = localStorage.getItem("appInfos");
        var JSONappInfos = JSON.parse(appInfos);

        for (let i = 0; i < JSONappInfos.tasksList.length; i++) {
            JSONappInfos.tasksList[i].placeInArray = i;
            console.log(JSONappInfos.tasksList[i] + "place in array now = " + i);
        }

        localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
    },

    showTasks() {
        // Show tasks
        var appInfos = localStorage.getItem("appInfos");
        var JSONappInfos = JSON.parse(appInfos);
        console.log("appInfos = " + appInfos)
        console.log(JSONappInfos.tasksList);

        let temp = Mustache.render(tasksTemplate,JSONappInfos);
        taskBox.innerHTML = temp;

        // Add events

        // Event listener to show a personalized context menu
        divTasksElts = document.querySelectorAll(".task");
        divTasksElts.forEach(divTask => {
            divTask.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            
            var numOfTask = this.id[this.id.length-1]
            console.info(numOfTask);
            showAlert("removeTask", function() {

                let btn = document.createElement("button");
                btn.textContent = "Supprimer";
                btn.style.marginRight = "17px";

                // Event listener to remove a task
                btn.addEventListener("click", function() {
                    alertBox.parentNode.removeChild(alertBox);
                    JSONappInfos.tasksList.splice(numOfTask,1);
                    localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                    TasksManager.updateTask();
                    TasksManager.showTasks();
                });
                alertBox.appendChild(btn);
                alertBox.style.top = e.clientY + "px";
                alertBox.style.left = e.clientX + "px";
            });
        });
        });
        
        // Event listener to show a personalized context menu

        // Counter event
        /*
        imgMinusElt.addEventListener("click", function() {
            let nb = Number(spanCount.textContent);
            if (nb - 1 >= 0 ) {
                spanCount.textContent = nb-1;
                JSONappInfos.tasksList[i].counter.nb -= 1 ;
                localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
            }
        })
        
        imgPlusElt.addEventListener("click", function() {
            let nb = Number(spanCount.textContent);
            if (nb + 1 <= task.counter.nbMax ) {
                spanCount.textContent = nb+1;
                JSONappInfos.tasksList[i].counter.nb += 1 ;
                localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
            }
        });
        */
    }
}

addBtnElt.addEventListener("click", TasksManager.showPanel);
TasksManager.showTasks();

            

            