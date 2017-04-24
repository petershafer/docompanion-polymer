// A sample actions file.
var router = (function(){
    var subscribers = [];
    var noop = function(){};
    var unsubscribe = function(id){
        subscribers[id] = noop;
    };
    page('*', function(ctx, next){
      for(var i = 0; i < subscribers.length; i++){
        subscriber[i](ctx);
      }
      next();
    });
    var API = {
        'subscribe': function(cb) {
            var id = subscribers.length;
            subscribers[id] = cb;
            return {
                'unsubscribe': (function(){
                    unsubscribe(id);
                }),
                "id": id
            }
        }
    };
    return API;
})();
