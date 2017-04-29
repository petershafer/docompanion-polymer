// A sample actions file.
var actions = (function(){
    var API = {
        'loadDatabase': plux.createAction("loadDatabase"),
        'loadComplete': plux.createAction("loadComplete"),
        'getUnreadCount': plux.createAction("getUnreadCount"),
        'getSection': plux.createAction("getSection"),
        'readItem': plux.createAction("readItem"),
        'getItem': plux.createAction("getItem"),
        'markSectionRead': plux.createAction("markSectionRead"),
        'openAddForm': plux.createAction("openAddForm"),
        'addItem': plux.createAction("addItem"),
        'nextItem': plux.createAction("nextItem"),
        'nextUnread': plux.createAction("nextUnread"),
        'updateFilter': plux.createAction("updateFilter"),
        'bookmark': plux.createAction("bookmark"),
        'debugReset': plux.createAction("debugReset"),
        'debugAddAll': plux.createAction("debugAddAll"),
        'debugAddSection': plux.createAction("debugAddSection"),
        'debugAddRandom': plux.createAction("debugAddRandom")
    };
    return API;
})();
