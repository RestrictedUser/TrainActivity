// Delete button needs to be fixed. Have to find out how to remove the child_added to delete because you cant delete the datebase data

var config = {
apiKey: "AIzaSyDGPV_2V0cMf8EQbXr2-cw2-SLbT4djRaY",
authDomain: "recent-user-with-all-use-e8e76.firebaseapp.com",
databaseURL: "https://restricteduser-project.firebaseio.com",
projectId: "recent-user-with-all-use-e8e76",
storageBucket: ""
};


firebase.initializeApp(config);

var database = firebase.database();

// starting values

// Train name and destination
var trainName= "";
var trainDest = "";


// time related var
var trainFreq = ""
var currentTime = "";
var trainTime = "";
var timeDiff = "";
var timeRemainder = 0;
var nextArrival = 0;
var minAway = 0;
var newTrain = {
    name: trainName,
    dest: trainDest,
    freq: trainFreq,
    firstTrain: trainTime,
};

var firstTrainInput = "";

// on click take value of firsttraininput and convert the timestamp in HH:mm
$("#add-train-data").on('click', function(event){

    event.preventDefault();

    firstTrainInput = moment($('#train-time').val().trim(), "HH:mm").format("HH:mm");

    // display error if time is invalid

    if(firstTrainInput !== 'Invalid date') {
        
        newTrain.firstTrain = firstTrainInput;
        
        newTrain.name = $("#train-name").val().trim();
        
        newTrain.dest= $("#train-destination").val().trim();
        
        newTrain.freq = $("#train-freq").val().trim();

    } else {
        alert("Please enter a valid First Train Time");
        clearInput();
    
    } 

    //push to database push newTrain object data to firebase
    database.ref().push(newTrain);

    clearInput();

});



// create table
database.ref().on("child_added", function (snapshot){
    if (firstTrainInput !== 'Invalid date') {
        trainName = snapshot.val().name;
        trainDest = snapshot.val().dest;
        trainTime = moment(snapshot.val().firstTrain, "HH:mm");
        trainFreq = snapshot.val().freq;

        // trainTime (pushed back 1 year to make sure it comes before current time)
        var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

        currentTime = moment().format("HH:mm");
        console.log("Current Time: " + currentTime);

        timeDiff = moment().diff(moment(trainTimeConverted), "minutes");
        console.log("Time remaining: " + timeDiff);

        timeRemainder = timeDiff % trainFreq;
        console.log("Remaining Time: " + timeRemainder);

        minAway = trainFreq - timeRemainder;
        console.log(minAway);

        nextArrival = moment().add(minAway, "minutes").format("HH:mm");

        $("#trainData").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
    }
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// Not currently working. Value can be set to "" but as long as database has the data it sends the data back on pageload.


$("#delete").on('click', function(event) {
    $("#trainData").val("");
    console.log("test");
   
});

        //clock
        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            document.getElementById('txt').innerHTML = "Current Time: " +
            h + ":" + m + ":" + s;
            var t = setTimeout(startTime, 500);
        }

        function checkTime(i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
            return i;
        }
            // clear input values of input elements
            function clearInput(){
                $("#train-name").val("");

                $("#train-destination").val("");

                $("#train-time").val("");

                $("#train-freq").val("");
            }



