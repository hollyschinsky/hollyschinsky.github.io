// App logic.
window.myApp = {};

// Init Event Handler
document.addEventListener('init', function(event) {
    var page = event.target;    
   
    // Each page calls its own initialization controller.
    if (myApp.controllers.hasOwnProperty(page.id)) {
        myApp.controllers[page.id](page);        
    }      
});

// NOTE: Call to do pouchDB on device ready from a Cordova app
document.addEventListener("DOMContentLoaded", function(event) {    
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

// Page Show Event Handler
document.addEventListener('show', function(event) {
    var page = event.target;    
   
    // Hack for duplicate tab page issue in Onsen UI on Safari Mobile
    // https://github.com/OnsenUI/OnsenUI/issues/1584
    if (ons.platform.isIOS()) {
        var tabs = document.querySelector('#myTabbar').getElementsByTagName('ons-page');
        for (var i=0; i<tabs.length; i++) {
            var tabbar = document.querySelector('.tab-bar__content');
            if (tabs[i].id=="completedTasksPage") {
                if (i>0) 
                    tabbar.removeChild(tabs[i]);                
                else document.querySelector('#completedTasksPage').setAttribute('style',"display:block")
            }
        }
    }
});


