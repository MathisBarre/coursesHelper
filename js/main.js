/*
DEVELOPPEMENT BRANCH
*/


// Initialized JSON settings if the user don't have one
if (localStorage.getItem("appInfos") === null || 
    localStorage.getItem("appInfos") === undefined || 
    typeof(JSON.parse(localStorage.getItem("appInfos"))) != "object") {
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
        "subjectsList" : [
            "français",
            "espagnol",
            "anglais",
            "histoire-géographie",
            "science de la vie et de la terre",
            "physique-chimie",
            "mathématiques",
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
var addTaskAlertElt = document.querySelector("#addTaskAlert");
var removeTaskAlertElt = document.querySelector("#removeTaskAlert");

var TasksManager = {
    showPanel() {
        addTaskAlertElt.style.display = "block";

        addTaskAlertElt.querySelector(".croce").addEventListener("click", function (e) {
            addTaskAlertElt.style.display = "none";
        })
        var counterCheckboxElt = document.querySelector("#isCounterActive");
        counterCheckboxElt.checked = false;
        counterCheckboxElt.onchange = function () {
            var counterOptionsElt = document.querySelector(".counterOptions");
            if (counterCheckboxElt.checked) {
                counterOptionsElt.style.display = "block";
            } else {
                counterOptionsElt.style.display = "none";
            }
        }
        
        addTaskAlertElt.querySelector("input[type=submit]").addEventListener("click", TasksManager.addTask);

        document.querySelector("#titleTaskInput").focus();
    },

    addTask(e) {
        e.preventDefault();

        let titleTaskInputElt = addTaskAlertElt.querySelector("#titleTaskInput");
        let pTaskInputElt = addTaskAlertElt.querySelector("#pTaskInput");
        let counterNbMaxTaskInputElt = addTaskAlertElt.querySelector("#counterNbMax");
        let counterSuffixTaskInputElt = addTaskAlertElt.querySelector("#counterSuffix");
        let counterActiveTaskInputElt = addTaskAlertElt.querySelector("#isCounterActive");

        var appInfos = localStorage.getItem("appInfos");
        var JSONappInfos = JSON.parse(appInfos);

        function counter(isActive,suffix,nbMax) {
            if (isActive != null && nbMax > 0) {
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

        if (titleTaskInputElt.value != "" || pTaskInputElt.value != "") {
            var taskObject = new taskObject(
                titleTaskInputElt.value,
                pTaskInputElt.value,
                counterActiveTaskInputElt.value,
                counterSuffixTaskInputElt.value,
                counterNbMaxTaskInputElt.value
                );
            JSONappInfos.tasksList.push(taskObject);
            localStorage.setItem("appInfos",JSON.stringify(JSONappInfos));
    
            titleTaskInputElt.value = "";
            pTaskInputElt.value = "";
            counterSuffixTaskInputElt.value = "";
            counterNbMaxTaskInputElt.value = "";
        } else {
            alert("La tâche est vide");
        }

        TasksManager.showTasks();
    },

    updateTask() {
        var appInfos = localStorage.getItem("appInfos");
        var JSONappInfos = JSON.parse(appInfos);

        for (let i = 0; i < JSONappInfos.tasksList.length; i++) {
            JSONappInfos.tasksList[i].placeInArray = i;

        }

        localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
    },

    showTasks() {
        // Show tasks
        var appInfos = localStorage.getItem("appInfos");
        var JSONappInfos = JSON.parse(appInfos);

        

        let temp = Mustache.render(tasksTemplate,JSONappInfos);
        taskBox.innerHTML = temp;

        /* Add events */

        // Event listener to show a personalized context menu
        divTasksElts = document.querySelectorAll(".task");
        divTasksElts.forEach(divTask => {
            divTask.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            
            var numOfTask = this.id[this.id.length-1]

            removeTaskAlertElt.style.display = "block";
            removeTaskAlertElt.style.top = e.clientY + "px";
            removeTaskAlertElt.style.left = e.clientX + "px";

            // Event listener to remove a task
            removeTaskAlertElt.querySelector(".btnRemoveTask").addEventListener("click", function() {
                removeTaskAlertElt.style.display = "none";
                JSONappInfos.tasksList.splice(numOfTask,1);
                localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                TasksManager.updateTask();
                TasksManager.showTasks();
            });
            removeTaskAlertElt.querySelector(".croce").addEventListener("click", function () {
                removeTaskAlertElt.style.display = "none";
            });

            });
        });
        
        

        // Counter event
        imgMinusElts = document.querySelectorAll(".counterMinus");
        imgMinusElts.forEach(imgMinusElt => {

            imgMinusElt.addEventListener("click", function() {
                let taskEltId = this.parentNode.parentNode.parentNode.id;
                let i = taskEltId[taskEltId.length-1]
                let spanCountElt = this.parentNode.querySelector(".spanCount");
                let nb = Number(spanCountElt.textContent);

                if (nb - 1 >= 0 ) {
                    spanCountElt.textContent = nb-1;
                    JSONappInfos.tasksList[i].counter.nb -= 1 ;
                    localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                }

            })
        });
        
        imgPlusElts = document.querySelectorAll(".counterPlus")
        imgPlusElts.forEach(imgPlusElt => {

            imgPlusElt.addEventListener("click", function() {

                let taskEltId = this.parentNode.parentNode.parentNode.id;
                let i = taskEltId[taskEltId.length-1]
                let spanCountElt = this.parentNode.querySelector(".spanCount");
                let nb = Number(spanCountElt.textContent);

                if (nb + 1 <= JSONappInfos.tasksList[i].counter.nbMax ) {
                    spanCountElt.textContent = nb+1;
                    JSONappInfos.tasksList[i].counter.nb += 1 ;
                    localStorage.setItem("appInfos", JSON.stringify(JSONappInfos));
                }

            });
        });
        
    }
}

addBtnElt.addEventListener("click", TasksManager.showPanel);
TasksManager.showTasks();
/* END TO DO JS */
            
/* Randomizator */

document.querySelector("#randomize").addEventListener("click",function (e) {

    JSONappInfos = localStorage.getItem("appInfos");
    var subjectsList = JSON.parse(JSONappInfos).subjectsList;

    randomNumber = Math.floor(Math.random() * Math.floor(subjectsList.length-1));
    alert("Go faire : " + subjectsList[randomNumber]);
})

var randomSettingsElt = document.querySelector("#randomizerSettings");
randomSettingsElt.addEventListener("click", function (e) {

    JSONappInfos = localStorage.getItem("appInfos");
    var subjectsList = JSON.parse(JSONappInfos).subjectsList;

    let textarea = document.querySelector("#randomizeurSettingsTextarea");
    textarea.value = subjectsList;

    var settingsBoxElt = document.querySelector("#randomizerSettingsBox");
    settingsBoxElt.style.display = "block";

    
})
document.querySelector("#sendRandomizerInfos").onclick = function (e) {
        e.preventDefault();

    }
            