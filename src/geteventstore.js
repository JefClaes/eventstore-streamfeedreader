var $ = require('jquery'); 

module.exports = { 

    StreamFeedReader : function(feedUri) {   

        if (!feedUri) {
            throw new Error('feedUri missing.');
        }        
        
        var readLastFromHead = function (streamName) {                                        
            var dfd = $.Deferred();

            $.ajax({
                url : feedUri + streamName + '?embed=body'
            }).done(function (data) {                
                var lastLinks = data.links.filter(function(link) { 
                    return link.relation === "last"; 
                });                       

                if (lastLinks.length > 0) {               
                    dfd.resolve(lastLinks[0].uri);           
                } else {
                    dfd.resolve(feedUri + streamName);
                }
            }).fail(function() {                           
                dfd.reject();
            });

            return dfd.promise();
        };              

        var traverseToFirst = function (uri, entries, dfd) {                                                       
            $.ajax({
                url: uri + '?embed=body'
            }).done( function (data) {       
                var reversedEntries = data.entries.reverse();

                for (var i = 0; i < reversedEntries.length; i++) {
                    entries.push(reversedEntries[i]);
                }            

                var previousLinks = data.links.filter(function(link) { 
                    return link.relation === "previous"; 
                });            

                if (previousLinks.length === 1) {
                    traverseToFirst(previousLinks[0].uri, entries, dfd);
                } else {                
                    dfd.resolve(entries);
                }           
            }).fail(function() {
                dfd.reject();
            });                    
        };  

        this.read = function (streamName) {                   
            if (!streamName) {
                throw new Error('streamName missing.');
            }  

            var dfd = $.Deferred();                           
            
            readLastFromHead(streamName).done(function(lastUri) {
                var entries = [];                        
                traverseToFirst(lastUri, entries, dfd);                        
            }).fail(function() { 
                dfd.reject(); 
            });    

            return dfd.promise();              
        };

    }
             
}  