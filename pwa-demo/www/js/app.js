// App logic.
window.myApp = {};

// Init Event Handler
document.addEventListener('init', function(event) {
    var page = event.target;    
    console.log("Init " + page);
    // Each page calls its own initialization controller.
    if (myApp.controllers!=null && myApp.controllers!=undefined) {
        if (myApp.controllers.hasOwnProperty(page.id)) {
            console.log("and... " + page.id);
            myApp.controllers[page.id](page);        
        }
    }      
});

// NOTE: Call to do pouchDB on device ready from a Cordova app or browser platform. When running
// as a PWA from a remote server though, we won't get that deviceready so need to use the load event.
window.addEventListener("load", function(event) {
    console.log("All resources finished loading!");
      
    myApp.isOnline = navigator.onLine; // browser flag for checking connection (may not always work)
    var dbName = 'my_todos.db';        // use a different local name for each to test multiple concurrent browsers

    window.addEventListener('online', function() {
        console.log("Online detected")
        myApp.isOnline = true;
    })
    window.addEventListener('offline', function() {
        console.log("Offline detected")
        myApp.isOnline = false;
    })
    myApp.db = new PouchDB(dbName);  
    
    // Create or open the remote database to sync to - requires you to start up the PouchDB server 1st (see readme) 
    //myApp.remoteDB = new PouchDB("http://localhost:5984/myTodoList");
    myApp.remoteDB = new PouchDB('https://hollyschinsky:PhoneGapRox@hollyschinsky.cloudant.com/todos1');
    
    // Make a call to get the info on each db 
    myApp.db.info().then(function (info) {
        console.log("Local DB info " + JSON.stringify(info));          
    })
    
    myApp.remoteDB.info().then(function (info) {
        console.log("Remote DB info " + JSON.stringify(info));          
    })
    
    // Load existing data (if any)
    myApp.services.pouch.loadData();

    // Turn on live 2-way syncing
    myApp.services.pouch.sync();
    
    // Start processing db changes
    myApp.services.pouch.handleChanges();
    
});



