
//variables
let theCount = 1;
let uName = "";
let uEmail = "";
let workoutArray;
let theIndex;

//buttons
let prevWorkout = document.getElementById("previous");
let compWorkout = document.getElementById("completed");
let nxtWorkout = document.getElementById("next");
let lgIn = document.getElementById("logIn");
let lgOut = document.getElementById("logOut");
//event listeners
prevWorkout.addEventListener("click", previousWorkout);
compWorkout.addEventListener("click", completedWorkout);
nxtWorkout.addEventListener("click", nextWorkout);
lgIn.addEventListener("click", logUserIn);
lgOut.addEventListener("click", logUserOut);

function loadWorkout(workoutNumber){
    let countMatchObject = workoutArray.findIndex( object  => {
        return object.order === (workoutNumber);
    });
    theIndex = countMatchObject;
    console.log('indexMatch', countMatchObject, 'passedNumber', (workoutNumber + 1));
    let workoutString = workoutArray[countMatchObject].workoutDescription ;
    let workoutSplit = workoutString.split(/\s(?=A:|B:|C:|D:)/);

    document.getElementById("current").innerHTML = " ";

    if (workoutSplit.length > 0){
        document.getElementById("current").innerHTML += `Workout:  ${workoutNumber} <br>`;
        workoutSplit.forEach(letteredActivty => {
            document.getElementById("current").innerHTML += `${letteredActivty} <br><br>`;
        })
    } else {
        document.getElementById("current").innerHTML = `Workout number:  ${workoutNumber} <br> ${workoutArray[workoutNumber].workout}`;
    }

    theCount = workoutNumber;
    showHideButtons();
}

function checkWorkoutNumber(workoutNumber){
    if (workoutNumber >= 0 && workoutNumber <= workoutArray.length){
        loadWorkout(workoutNumber);
        theCount = workoutNumber;
    }
}

function requestWorkout(value){
    if (value >= 0){
        checkWorkoutNumber(value);
    } else {
        document.getElementById("current").innerText = "Requested Workout is Out of Range" ;
    }
}

function previousWorkout(){
    let workoutVal = theCount -1;
    requestWorkout(workoutVal);
    document.getElementById("updateMessage").innerText = "" ;
}

function nextWorkout(){
    let workoutVal = theCount +1;
    requestWorkout(workoutVal);
    document.getElementById("updateMessage").innerText = "" ;
}

function completedWorkout(){
    if (uName.length > 0 && uEmail.length > 5){
        document.getElementById("updateMessage").innerText = `Good job completing workout #${theCount}, come back tomorrow ${uName} for workout #${theCount +1}` ;
        addWorkoutInfoToDatabase(uName, uEmail);
    } else {
        document.getElementById("updateMessage").innerText = "You'll need to enter your name and email to log your workout." ;
    }

}

function showHideButtons(){
    if (theCount === 0){
        prevWorkout.style.display = "none";
    } else {
        prevWorkout.style.display = "block";
    }
    if (theCount === (workoutArray.length -1)){
        nxtWorkout.style.display = "none";
    } else {
        nxtWorkout.style.display = "block";
    }
}

function lookForLatestMatchInArray(){
    let completedWorkoutsArray = workoutArray.filter(e => e.dateLastCompleted.length > 0);  //filter out any workouts that have not been completed
    console.log('total workouts completed', completedWorkoutsArray.length);
    let currentUserCompletedWorkoutsArray = completedWorkoutsArray.filter(g => g.dateLastCompleted[0].email === uEmail); //filter for current user
    console.log('total workouts completed for this user', currentUserCompletedWorkoutsArray.length);
    let latestWorkout = currentUserCompletedWorkoutsArray.reduce((a, b) => new Date(a.dateLastCompleted[0].date) > new Date(b.dateLastCompleted[0].date) ? a : b);
    console.log('latest workout by this user is:', latestWorkout, latestWorkout.order, latestWorkout.length);
    if (latestWorkout != null) {
        theCount = latestWorkout.order;
        console.log('length is 1', theCount, latestWorkout.order);
        loadWorkout(theCount);
        document.getElementById("updateMessage").innerText = `This is the last workout you completed (on ${new Date(latestWorkout.dateLastCompleted[0].date).toDateString()}) press the next button for the next workout in the series` ;
    }
}

function addLogInInfoToLocalStorage(userName, userEmail){
    let workoutObject = { "name": userName, "email": userEmail};
    let workoutObjectStringified = JSON.stringify(workoutObject);
    localStorage.setItem("xFitUserInfo", workoutObjectStringified);
    checkLocalStorage(workoutArray);
}

//button click calls
function logUserIn(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    if (name.length > 0 && email.length > 5){
        uName = name;
        uEmail = email;
        addLogInInfoToLocalStorage(name, email);
    }
}

function logUserOut(){
    localStorage.clear();
    loggedOutFormat();
    uName = "";
    uEmail = "";
    theCount = 1;
    loadWorkout(theCount);
}

function addWorkoutInfoToDatabase(){
    let today = new Date();
    let data = { 'name': uName, 'email': uEmail, 'theCount': (theCount + 1), 'date': today };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/xfit', options).then(response => response.json()).then(returnedJSON => {
        console.log(returnedJSON);
    });
}

function loggedInFormat(){
    document.getElementById("logStatus").innerText = `Welcome back ${uName}!`;
    let logoutButton = document.querySelector("#logOut");
    let nameField = document.querySelector("#name");
    let emailField = document.querySelector("#email");
    let logInButton = document.querySelector("#logIn");
    logoutButton.style.display = 'block';
    nameField.style.display = 'none';
    emailField.style.display = 'none';
    logInButton.style.display = 'none';
}

function loggedOutFormat(){
    document.getElementById("logStatus").innerText = ``;
    let logoutButton = document.querySelector("#logOut");
    let nameField = document.querySelector("#name");
    let emailField = document.querySelector("#email");
    let logInButton = document.querySelector("#logIn");
    logoutButton.style.display = 'none';
    nameField.style.display = 'block';
    nameField.style.alignItems = 'initial';
    emailField.style.display = 'block';
    emailField.style.alignItems = 'initial';
    logInButton.style.display = 'block';
    logInButton.style.alignItems = 'initial';
}

function initialLoggedOutFormat(){
    document.getElementById("logStatus").innerText = ``;
    let logoutButton = document.querySelector("#logOut");
    logoutButton.style.display = 'none';
}

function checkLocalStorage(returnedWorkoutArray){
    workoutArray = returnedWorkoutArray;
    console.log('workoutArray value', workoutArray);
    let xFitUser = localStorage.getItem("xFitUserInfo");
    console.log(xFitUser);
    if (xFitUser != null) {
        let xFitUserObject = JSON.parse(xFitUser);
        uName = xFitUserObject.name;
        uEmail = xFitUserObject.email;
        lookForLatestMatchInArray();
        loggedInFormat();
    } else {
        loadWorkout(theCount);
        initialLoggedOutFormat();
    }

}

async function getWorkoutsFromNEdb(){
    const sentResponse = await fetch('/xfit');
    const returnedData = await sentResponse.json();
    checkLocalStorage(returnedData);
}

getWorkoutsFromNEdb();
