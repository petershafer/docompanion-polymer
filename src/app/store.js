// A sample store file.
(function(){
    var myActionHandler = function(action, data, state){
        switch(action){
            case "loadDatabase":
                state.loadingDB = true;
                var p1 = fetch('/src/app/database.json');
                var p2 = fetch('/src/app/prettycontent.json');
                Promise.all([p1, p2]).then(function(values) {
                    var p1 = values[0].json();
                    var p2 = values[1].json();
                    Promise.all([p1, p2]).then(function(objs){
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        state.database = objs[0];
                        state.content = objs[1];
                        console.log(objs);
                        actions.loadComplete();
                    });
                });
                break;
            case "loadComplete":
                console.log("JUST FINISHED LOADING THE DB");
                state.loadingDB = false;
                state.databaseReady = true;
                break;
            // case "getSection":
            //     break;
            case "readItem":
                var code = data;
                for(var i = 0; i < state.database.content.sections.length; i++){
                    for(var j = 0; j < state.database.content.sections[i].items.length; j++){
                        if(state.database.content.sections[i].items[j].id == code){
                            if(!state.database.content.sections[i].items[j].read){
                                state.database.content.sections[i].unread--; 
                            }
                            state.database.content.sections[i].items[j].read = true;
                        }
                    }
                }
                break;
            // case "getItem":
            //     break;
            case "markSectionRead":
                var code = data;
                for(var i = 0; i < state.database.content.sections.length; i++){
                    if(state.database.content.sections[i].id == code){
                        for(var j = 0; j < state.database.content.sections[i].items.length; j++){
                            state.database.content.sections[i].items[j].read = true;
                            state.database.content.sections[i].unread--;
                        }
                    }
                }
                break;
            // case "openAddForm":
            //     break;
            // case "validateItems":
            //     break;
            case "addItem":
                var code = data;
                for(var i = 0; i < state.database.content.sections.length; i++){
                    for(var j = 0; j < state.database.content.sections[i].items.length; j++){
                        if(state.database.content.sections[i].items[j].id == code){
                            state.database.content.sections[i].items[j].available = true;
                            state.database.content.sections[i].unread++;
                        }
                    }
                }
                break;
            case "bookmark":
                var code = data.item;
                var value = data.value;
                for(var i = 0; i < state.database.content.sections.length; i++){
                    for(var j = 0; j < state.database.content.sections[i].items.length; j++){
                        if(state.database.content.sections[i].items[j].id == code){
                            state.database.content.sections[i].items[j].bookmark = value;
                        }
                    }
                }
                break;
            case "restoreDatabase":
                console.log("LET'S DO A RESTORE");
                state = data;
                state.loadingDB = false;
                state.databaseReady = true;
                actions.loadComplete();
                break;
            // case "nextItem":
            //     break;
            // case "nextUnread":
            //     break;
            case "debugReset":
                actions.loadDatabase();
                break;
            case "debugAddAll":
                for(var i = 0; i < state.database.content.sections.length; i++){
                    for(var j = 0; j < state.database.content.sections[i].items.length; j++){
                        state.database.content.sections[i].items[j].available = true;
                        state.database.content.sections[i].unread++;
                        console.log("Adding!");
                    }
                }
                break;
            case "debugAddSection":
                var code = data;
                for(var i = 0; i < state.database.content.sections.length; i++){
                    if(state.database.content.sections[i].id == code){
                        for(var j = 0; j < state.database.content.sections[i].items.length; j++){
                            state.database.content.sections[i].items[j].available = true;
                            state.database.content.sections[i].unread++;
                        }
                    }
                }
                break;
            case "updateFilter":
                var filter = data;
                state.database.settings.onlyUnread = filter;
                break;
            // case "debugAddRandom":
            //     break;
        }
    };
    plux.createStore("shared", myActionHandler, { "databaseReady": false });    
})();
