const setVh = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};
setVh();
window.addEventListener('resize', setVh);

// Fetching IDs/ DOM Manipulation
let currentDay = document.getElementById("day");
let currentDate = document.getElementById("date");
let currenthour = document.getElementById("time-hour");
let currentMinute = document.getElementById("time-minute");
let currentSecond = document.getElementById("time-second");
let currentAmPm = document.getElementById("time-amPm");

let alarmRinging = false;

let showHour = document.getElementById("show-hour");
let showMinute = document.getElementById("show-minute");
let showAmPm = document.getElementById("show-amPm");
let showDate = document.getElementById("show-today-date");
let showMonth = document.getElementById("show-month");
let showDay = document.getElementById("show-day");
let isTwelveHrs = true;
let alarmPage = document.getElementById("alarmRings-container");
let lists = document.getElementById("list");
let flipContainer = document.getElementById("flip-container");
let isDark = false;

// To store the Alarm Inputs
let alarmList = [];

// alarmobject
let alarm;

// Retrieving Alarm List from Local Storage if Exists
let retrieveAlarms = JSON.parse(localStorage.getItem('alarmListLocal'));

// Checking if alarm exists in local storage then copy the whole arry to alarmList
if (localStorage.getItem('alarmListLocal') !== null) {
    alarmList = [...retrieveAlarms];
    // Render the Lists
    renderList();
}

// Array of Days and Months to Update Clock
const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// To Play as Alarm
const audio = new Audio('alarm_sound.mp3');

let alarmTimeOut;

function stopAlarm() {
    audio.pause();
    showNotification("Alarm Stopped!!")
    clearTimeout(alarmTimeOut);
    alarmRinging = false;
    alarmPage.style.display = "none";
    container.style.display = "flex";
    // return;
}


// Updating Clock Every Second
function updateTime() {
    let today = new Date();

    let thisyear = today.getFullYear();
    let thismonth = monthsName[today.getMonth()];
    let thisdate = today.getDate();
    let thisday = daysName[today.getDay()];
    let thishour = today.getHours();

    let realHour = today.getHours();

    let thisminute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    let thissecond = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

    // Changin Hours to 12hrs and Updating to Clock
    if (isTwelveHrs) {
        if (thishour == 0) {
            thishour = 12;
        } else if (thishour > 12) {
            thishour = thishour - 12;
        }
        if (realHour > 11) {
            currentAmPm.innerText = "PM"
        } else {
            currentAmPm.innerText = "AM";
        }
    } else {
        thishour = realHour;
    }

    // Appending 0 before one digits
    if (thishour < 10) {
        thishour = "0" + thishour;
    }

    currentDate.innerText = thismonth + " " + thisdate + "," + " " + thisyear;
    currentDay.innerText = thisday;
    currenthour.innerText = thishour;
    currentMinute.innerText = thisminute;
    currentSecond.innerText = thissecond;

    // Checks The Conditions to Play Alarm,
    function playAlarm() {
        for (let element of alarmList) {
            if (!alarmRinging && Number(element.hour) == Number(realHour) && Number(element.minute) == Number(thisminute) && Number(element.second) == Number(thissecond)) {
                alarmRinging = true;
                startAlarm();
                showNotification("Alarm Ringing!")
            }
        }
    };

    // Starts and Stops the alarm after 59 Seconds,
    function startAlarm() {
        audio.currentTime = "20";
        audio.play()
            .catch((err) => {
                showNotification('Audio Muted. Please interact with the site to enable audio.');
                console.log(`Due to a recent update in the Chrome browser, autoplay of media on web pages is now restricted by default. This means that media will not play automatically on page load unless the user has previously interacted with the site, such as by clicking on it. If you are experiencing issues with audio not playing after refreshing the page, it may be because the browser is not recognizing your previous interaction.

                To enable autoplay, you will need to interact with the site again, such as by clicking on a button or link after page refreshes. Alternatively, you can adjust your browser's settings to allow autoplay for this site. Please note that allowing autoplay can impact your browsing experience, so it's recommended to only do so for trusted sites.
                
                This feature was launched on Chrome in April 2018 with the release of version 66. The autoplay policy is designed to give users more control over their browsing experience and reduce unwanted interruptions from autoplaying media. We apologize for any inconvenience this may cause and thank you for your understanding.
                
                `);
            })
        container.style.display = "none";
        alarmPage.style.display = "block";
        alarmTimeOut = setTimeout(function () {
            audio.pause();
            showNotification("Alarm Stopped!!")
            alarmPage.style.display = "none";
            container.style.display = "flex";
            alarmRinging = false;
        }, 59000);
    }
    // Checks if Alarm Exists or Not! and Sets the Color of alarm Clock if exists
    if (alarmList.length > 0) {
        alarmClock.style.color = "rgb(252, 76, 152, 0.6)";
        playAlarm();
    }
    if (alarmList.length == 0) {
        alarmClock.style.color = "transparent";
    }

    // For Alarm Page time---------------------------------------------
    showMonth.innerText = thismonth;
    showDate.innerText = thisdate;
    showDay.innerText = thisday
    showHour.innerText = thishour;
    showMinute.innerText = thisminute;

    // Changing Alarm page background Images according to time
    if (realHour > 5 && realHour < 11) {
        alarmPage.style.backgroundImage = "url(./morning2.jpg)"
    }
    else if (realHour > 10 && realHour < 16) {
        alarmPage.style.backgroundImage = "url(./afternoon.jpg)"
    } else if (realHour > 15 && realHour < 21) {
        alarmPage.style.backgroundImage = "url(./evening.jpg)"
    } else {
        alarmPage.style.backgroundImage = "url(./Alarm Page.jpg)";
    }
    // ----------------------------------------------------------------
}
setInterval(updateTime, 1000);

// Showing Notifications
let notification = document.getElementById("msg");
let notificationBox = document.getElementById("notifications");
function showNotification(msg) {
    notification.innerText = msg;
    notification.style.display = "flex";
    notificationBox.style.width = "350px";
    notificationBox.style.height = "90px";
    notificationBox.style.maxWidth = "600px";

    setTimeout(() => {
        notificationBox.style.width = "0";
        notificationBox.style.height = "0";
        notification.style.display = "none";
    }, 3000);
}

function closeNotificaton() {
    notification.style.display = "none";
    notificationBox.style.width = "0";
}

// Handling 12hrs Format
let twelveIcon = document.getElementById("twelvehrs");
let twentyfourIcon = document.getElementById("twentyfourhrs");
function twelveHrsFormat() {
    isTwelveHrs = true;
    twelveIcon.style.backgroundColor = "#f76885";
    twentyfourIcon.style.backgroundColor = "transparent";
    if (!isDark) {
        twelveIcon.style.backgroundColor = "#78c7ff";
    } else {
        twelveIcon.style.backgroundColor = "#f76885";
    }
    currentAmPm.style.display = "block";
    document.getElementById("takeAmPm").style.display = "block";
}
// Handling 24 hrs Format
function twentyFourHrsFormat() {
    isTwelveHrs = false;
    twelveIcon.style.backgroundColor = "transparent";
    if (!isDark) {
        twentyfourIcon.style.backgroundColor = "#78c7ff";
    } else {
        twentyfourIcon.style.backgroundColor = "#f76885";
    }
    currentAmPm.style.display = "none";
    document.getElementById("takeAmPm").style.display = "none";

}

// For Dark and Light Mode!
const container = document.getElementById("container")
const darkMode = document.getElementById("darkMode");
const setAlarmButton = document.getElementById("set-alarm-button");
const alarmClock = document.getElementById("alarm-clock");
const lightMode = document.getElementById("lightMode");
const clock = document.getElementById("clock");
const flippedContainer = document.getElementById("flipped-container");


function handleDarkMode() {
    isDark = true;
    darkMode.style.backgroundColor = "#f76885";
    document.body.style.backgroundColor = "rgb(1,1,1)";
    container.style.backgroundColor = "#0f0f0f";
    container.style.outline = "3px solid #f76885";
    lightMode.style.backgroundColor = "transparent";
    document.getElementById("theme").style.backgroundColor = "transparent";
    document.getElementById("theme").style.outline = "2px solid #f76885";
    container.style.color = "#f76885";
    flippedContainer.style.color = "#f76885";
    setAlarmButton.style.backgroundColor = "#78c7ff";
    clock.style.color = "pink";
    lists.style.color = "pink";
    flippedContainer.style.backgroundColor = "#1D1D1E";
    document.getElementById('format-change').style.outline = "2px solid #f76885";
    if (isTwelveHrs) {
        twelveIcon.style.backgroundColor = "#f76885";
    } else {
        twentyfourIcon.style.backgroundColor = "#f76885";
    }
}
function handleLightMode() {
    isDark = false;
    document.body.style.backgroundColor = "#d3e2f8";
    container.style.backgroundColor = "#eff7ff";
    container.style.outline = "5px solid #78c7ff";
    lightMode.style.backgroundColor = "#78c7ff";
    darkMode.style.backgroundColor = "transparent";
    document.getElementById("theme").style.backgroundColor = "transparent";
    document.getElementById("theme").style.outline = "2px solid #78c7ff";
    container.style.color = "#78c7ff";
    flippedContainer.style.color = "#78c7ff";
    setAlarmButton.style.backgroundColor = "#f76885";
    flippedContainer.style.backgroundColor = "#cfe7ff";
    clock.style.color = " #3795f2";
    lists.style.color = "#1487f9";
    document.getElementById('format-change').style.outline = "2px solid #78c7ff";
    if (isTwelveHrs) {
        twelveIcon.style.backgroundColor = "#78c7ff";
    } else {
        twentyfourIcon.style.backgroundColor = "#78c7ff";
    }
}


// -------------------------------------------------------------------------

// Opening ALarm Box// Closing Lists
function openAlarmBox() {
    activateDonebtn();
    flipContainer.style.width = "0%";
    flipContainer.style.height = "0%";

    setTimeout(() => {
        flipContainer.style.width = "100%";
        flipContainer.style.height = "50%";

        flippedContainer.style.display = "block";
        lists.style.display = "none";
    }, 300);

    document.getElementById("set-alarm-button").style.display = "none";

}

// Closing Alarm Box// Opening Lists
function closeAlarmBox() {
    clearInterval(miniInterval);
    flipContainer.style.width = "0%";
    flipContainer.style.height = "0%";

    setTimeout(() => {
        flipContainer.style.width = "100%";
        flipContainer.style.height = "50%";

        flippedContainer.style.display = "none";
        lists.style.display = "block";
    }, 300);

    document.getElementById("set-alarm-button").style.display = "block";

}

// Setting Alarm Time
let setHour = document.getElementById("set-alarm-hour");
let setMinute = document.getElementById("set-alarm-minute");
let setSecond = document.getElementById("set-alarm-second");

let hourSetSuccess = false;
let minuteSetSuccess = false;
let secondSetSuccess = false;
let amPmSetSuccess = false;
let amPmValue = "";


// listening inputs of Hour Field
setHour.addEventListener("input", function () {
    if (isTwelveHrs) {
        if (setHour.value < 1 || setHour.value > 12 || setHour.value == ".") {
            // alert("Set Hour Correctly in 12hr Format!");

            showNotification("Set Hour Correctly in 12hr Format!");
            setHour.style.outline = "3px solid red";
            document.getElementById('done-button').style.backgroundColor = 'red';
            hourSetSuccess = false;
        } else {
            setHour.style.outline = "3px solid lightgreen";
            document.getElementById('done-button').style.backgroundColor = '#218efa';
            hourSetSuccess = true;
        }
    } else {
        if (setHour.value < 0 || setHour.value > 23 || setHour.value == ".") {
            // alert("Set Hour Correctly in 24hr Format!");

            showNotification("Set Hour Correctly in 24hr Format!");
            setHour.style.outline = "3px solid red";
            document.getElementById('done-button').style.backgroundColor = 'red';
            hourSetSuccess = false;
        } else {
            setHour.style.outline = "3px solid lightgreen";
            document.getElementById('done-button').style.backgroundColor = '#218efa';
            hourSetSuccess = true;
        }
    }
});

// listening inputs of Minute field
setMinute.addEventListener("input", function () {
    if (setMinute.value < 0 || setMinute.value > 59) {
        // alert("Set Minute Correctly!");

        showNotification("Set Minute Correctly!")
        setMinute.style.outline = "3px solid red";
        document.getElementById('done-button').style.backgroundColor = 'red';
        minuteSetSuccess = false;
    } else {
        setMinute.style.outline = "3px solid lightgreen";
        document.getElementById('done-button').style.backgroundColor = '#218efa';
        minuteSetSuccess = true;
    }
});

// Listening inputs of Second field
setSecond.addEventListener("input", function () {
    if (setSecond.value < 0 || setSecond.value > 59) {
        // alert("Set Seconds Correctly!");

        showNotification("Set Seconds Correctly!");
        setSecond.style.outline = "3px solid red";
        document.getElementById('done-button').style.backgroundColor = 'red';
        secondSetSuccess = false;
    } else {
        setSecond.style.outline = "3px solid lightgreen";
        document.getElementById('done-button').style.backgroundColor = '#218efa';
        secondSetSuccess = true;
    }
});

// Setting AM/PM as per user Inputs
let amValue = document.getElementById("am");
let pmValue = document.getElementById("pm");
if (isTwelveHrs) {
    function setAm() {
        amValue.style.color = "lightgreen";
        pmValue.style.color = "white";
        amPmValue = "AM";
        amPmSetSuccess = true;
    }

    function setPm() {
        pmValue.style.color = "lightgreen";
        amValue.style.color = "white";
        amPmValue = "PM";
        amPmSetSuccess = true;
    }
}
// more interesting done button\
let miniInterval;
function activateDonebtn() {
    miniInterval = setInterval(() => {
        if (hourSetSuccess && minuteSetSuccess && secondSetSuccess && amPmSetSuccess) {
            document.getElementById('done-button').style.backgroundColor = 'rgb(47, 156, 47)';
        }

        if (setHour.value == "") {
            hourSetSuccess = false;
            setHour.style.outline = "3px solid #78c7ff";
        }
        if (setMinute.value == "") {
            minuteSetSuccess = false;
            setMinute.style.outline = "3px solid #78c7ff";
        }
        if (setSecond.value == "") {
            secondSetSuccess = false
            setSecond.style.outline = "3px solid #78c7ff";
        }

        if (setHour.value == "" || setMinute.value == "" || setSecond.value == "") {
            document.getElementById('done-button').style.backgroundColor = '#218efa';
        }

        if ((!hourSetSuccess && setHour.value != "") || (!minuteSetSuccess && setMinute.value != "") || (!secondSetSuccess && setSecond.value != "")) {
            document.getElementById('done-button').style.backgroundColor = 'red';
        }
    }, 10);
}

// Creating Alarm Object when all the reqired fields are filled Correctly //For Twelve hrs
function alarmset() {
    if (isTwelveHrs) {
        if (hourSetSuccess && minuteSetSuccess && secondSetSuccess && amPmSetSuccess ) {
            let alarmText = document.getElementById("alarm-text");
            let hourKey;
            if (amPmValue == "PM" && setHour.value < 12) {
                hourKey = Number(setHour.value) + 12;
            } else if (amPmValue == "AM" && setHour.value == 12) {
                hourKey = 0;
            }
            else {
                hourKey = setHour.value;
            }

            alarm = {
                hour: hourKey,
                minute: setMinute.value,
                second: setSecond.value,
                meridiem: amPmValue,
                alarmText: alarmText.value,
                id: Date.now(),
            }
            alarmList.push(alarm);

            showAmPm.innerText = amPmValue; //Setting Up the AMPm
            renderList();
            // Refreshing the list after pushing the Alarm Object in AlarmList Array
            setHour.value = "";
            setMinute.value = "";
            setSecond.value = "";
            amPmValue = "";
            alarmText.value = "";
            amPmSetSuccess = false;
            amValue.style.color = "white";
            pmValue.style.color = "white";
            // alert("Alarm Set Successfull!!");
            closeAlarmBox();
            showNotification("Alarm Set Successfull!")

            return;
        }
    } else if (!isTwelveHrs) {
        if (hourSetSuccess  && minuteSetSuccess  && secondSetSuccess ) {
            amPmValue = "";
            let alarmText = document.getElementById("alarm-text");
            alarm = {
                hour: setHour.value,
                minute: setMinute.value,
                second: setSecond.value,
                meridiem: amPmValue,
                alarmText: alarmText.value,
                id: Date.now(),
            }
            alarmList.push(alarm);

            showAmPm.innerText = amPmValue; //Setting Up the AMPm
            renderList();
            // Refreshing the list after pushing the Alarm Object in AlarmList Array
            setHour.value = "";
            setMinute.value = "";
            setSecond.value = "";
            alarmText.value = "";
            // alert("Alarm Set Successfull!!");
            showNotification("Alarm Set Successfull!");
            closeAlarmBox();
            return;
        }
    }
    // alert("Fill Values Carefullly!! Failed to set Alarm!!");
    showNotification("Fill Values Carefullly!! Failed to set Alarm!!");
}

// Rendering List after Manipulation or Object Creation/Deletion
function renderList() {
    // Copying all the elements of alarmList to local Storage
    localStorage.setItem('alarmListLocal', JSON.stringify(alarmList));
    lists.innerHTML = '';
    for (let element of alarmList) {
        addAlarmList(element);
    }
}


// Appending Lists to HTML
function addAlarmList(timeObj) {
    const li = document.createElement("li");
    const id = timeObj.id;
    let displayHour = timeObj.hour;
    if (timeObj.meridiem == "PM" && timeObj.hour > 12) {
        displayHour = timeObj.hour - 12;
    }
    if (timeObj.meridiem == "AM" && timeObj.hour == 0) {
        displayHour = 12;
    }
    li.setAttribute("id", id);
    li.setAttribute("class", "alarm-list-li");
    li.innerHTML =
        `<div id="alarm-time-set">
            <div id="alarm-name">
                ${timeObj.alarmText}
            </div>
            <div>
                <span id="alarm-hour">${displayHour}</span>
                <span>:</span>
                <span id="alarm-minute">${timeObj.minute}</span>
                <span>:</span>
                <span id="alarm-minute">${timeObj.second}</span>
                <span id="alarm-amPm">${timeObj.meridiem}</span>
            </div>
        </div>
            <span>
                <i class="bi bi-trash-fill" id="destroy" data-id= "${id}"></i>
            </span>`;
    lists.append(li);
}

// Deleting Alarm
function deleteAlarm(dataId) {
    let newAlarmList = alarmList.filter(function (alarm) {
        return alarm.id !== Number(dataId);
    });
    alarmList = newAlarmList;
    renderList();
}

// Handling All Clicks
function handleClicks(event) {
    let target = event.target;
    let fetchId = target.id;
    
    if (fetchId == "darkMode" || fetchId == "darkModeflipped") {
        handleDarkMode();
    }

    if (fetchId == "twelvehrs") {
        twelveHrsFormat();
    }
    if (fetchId == "twentyfourhrs") {
        twentyFourHrsFormat();
    }

    if (fetchId == "lightMode" || fetchId == "lightModeflipped") {
        handleLightMode();
    }

    if (fetchId == "close-container") {
        closeAlarmBox();
    }

    if (fetchId == "set-alarm-button" || fetchId == "add-alarm") {
        openAlarmBox();
    }

    if (fetchId == "done-button") {
        alarmset();
    }

    if (fetchId == "destroy") {
        let dataId = target.dataset.id;
        deleteAlarm(dataId);
    }

    if (fetchId == "am") {
        setAm();
    }
    if (fetchId == "pm") {
        setPm();
    }
    if (fetchId == "tap-btn") {
        stopAlarm();
    }

    if (fetchId == "msg" || fetchId == "notifications") {
        closeNotificaton();
    }
}

document.addEventListener("click", handleClicks);

