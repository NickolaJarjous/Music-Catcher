//Listen for when a Tab changes state
// TODO: ADD YOUR YOUTUBE API KEY HERE
const APIKEY = "";
const MAX_SIZE =40;
const songKeywords = ['ost', 'soundtrack', 'song', 'music', 'lyrics', 'audio'];
var lib;
requirejs(["localstoragedb/localstoragedb"], function(localStorageDB) {
    lib = new localStorageDB("my_caught_music", localStorage);
});


chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {
                console.log("onHistoryStateUpdated");
                // check enabled variable
                var isExtentionEnabled = localStorage.getItem('musicCatcherEnabled') || -1;
                if (isExtentionEnabled <= 0) {
                    // go through all tabs and get urls
                    chrome.windows.getAll({populate: true}, function (windows) {
                        windows.forEach(function (window) {
                            window.tabs.forEach(function (tab) {
                                //collect all of the urls here, I will just log them instead
                                var newUrl = tab.url;
                                if (newUrl != undefined || newUrl != '') {
                                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                                    var match = newUrl.match(regExp);
                                    if (match && match[2].length == 11) {
                                        // Do anything for being valid

                                        // check if that url already in db
                                        var found = false;

                                        if (lib != null)
                                            if (lib.tableExists("music")) {
                                                var scannedVids = lib.queryAll("music");
                                                for (i = 0; i < scannedVids.length; i++)
                                                    if (scannedVids[i].url === newUrl) {
                                                        found = true;
                                                        break;
                                                    }
                                            }


                                        if (!found) {
                                            var currentUrl = newUrl;
                                            // get video information
                                            var video_id = currentUrl.split('v=')[1];
                                            // get id
                                            var ampersandPosition = video_id.indexOf('&');
                                            if (ampersandPosition != -1) {
                                                // get video category
                                                video_id = video_id.substring(0, ampersandPosition);
                                            }
                                            video_id += ",";
                                            var req = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + video_id + "&key=" + APIKEY;
                                            var xhr = new XMLHttpRequest();

                                            xhr.open("GET", req, false);
                                            xhr.send();

                                            var result = xhr.responseText;
                                            // parse json
                                            obj = JSON.parse(result);
                                            // get catID
                                            var catID = obj.items[0].snippet.categoryId;
                                            if (catID == 10) {
                                                // its a music video store in db
                                                //var lib = new localStorageDB("my_caught_music", localStorage);
                                                // Check if the database was just created. Useful for initial database setup
                                                if (lib.isNew()) {

                                                    // create the "music" table if it doesnt exist
                                                    if (!lib.tableExists("music"))
                                                        lib.createTable("music", ["name", "url", "thumbnail", "rating", "date"]);

                                                    // insert the video
                                                    lib.insert("music", {
                                                        name: obj.items[0].snippet.title,
                                                        url: currentUrl,
                                                        thumbnail: obj.items[0].snippet.thumbnails.default.url,
                                                        rating: 0,
                                                        date: Date.now()
                                                    });

                                                    // commit the database to localStorage
                                                    // all create/drop/insert/update/delete operations should be committed
                                                    lib.commit();
                                                } else {
                                                    // if db exists check size
                                                    if (lib.rowCount("music") < MAX_SIZE) {
                                                        // add to db
                                                        lib.insert("music", {
                                                            name: obj.items[0].snippet.title,
                                                            url: currentUrl,
                                                            thumbnail: obj.items[0].snippet.thumbnails.default.url,
                                                            rating: 0,
                                                            date: Date.now()
                                                        });
                                                        lib.commit();
                                                    } else {
                                                        // remove the element that is the oldest and has the least rating
                                                        // find the id of the element that we want to delete
                                                        var delId = lib.queryAll("music", {
                                                            limit: 1,
                                                            sort: [["rating", "ASC"], ["date", "ASC"]]
                                                        })[0].ID;
                                                        // delete
                                                        lib.deleteRows("music", function (row) {
                                                            if (row.ID == delId) {
                                                                return true;
                                                            } else {
                                                                return false;
                                                            }
                                                        });
                                                        // add the item
                                                        lib.insert("music", {
                                                            name: obj.items[0].snippet.title,
                                                            url: currentUrl,
                                                            thumbnail: obj.items[0].snippet.thumbnails.default.url,
                                                            rating: 0,
                                                            date: Date.now()
                                                        });

                                                    }
                                                }
                                            }
                                            else if (catID == 1 || catID == 18 || catID == 20 || catID == 24 || catID == 30 || catID == 31 || catID == 43 || catID == 44)
                                            {
                                                // other cats check video title
                                                var title = obj.items[0].snippet.title.toLowerCase();
                                                var keywordFound = false;
                                                // match title to keywords
                                                for (j=0;j<songKeywords.length;j++)
                                                {
                                                    if (title.indexOf(songKeywords[j]) !== -1) {
                                                        keywordFound = true;
                                                        break;
                                                    }

                                                }

                                                if (keywordFound) {
                                                    // add to db
                                                    if (lib.isNew()) {

                                                        // create the "music" table if it doesnt exist
                                                        if (!lib.tableExists("music"))
                                                            lib.createTable("music", ["name", "url", "thumbnail", "rating", "date"]);

                                                        // insert the video
                                                        lib.insert("music", {
                                                            name: obj.items[0].snippet.title,
                                                            url: currentUrl,
                                                            thumbnail: obj.items[0].snippet.thumbnails.default.url,
                                                            rating: 0,
                                                            date: Date.now()
                                                        });

                                                        // commit the database to localStorage
                                                        // all create/drop/insert/update/delete operations should be committed
                                                        lib.commit();
                                                    } else {
                                                        // if db exists check size
                                                        if (lib.rowCount("music") < MAX_SIZE) {
                                                            // add to db
                                                            lib.insert("music", {
                                                                name: obj.items[0].snippet.title,
                                                                url: currentUrl,
                                                                thumbnail: obj.items[0].snippet.thumbnails.default.url,
                                                                rating: 0,
                                                                date: Date.now()
                                                            });
                                                            lib.commit();
                                                        } else {
                                                            // remove the element that is the oldest and has the least rating
                                                            // find the id of the element that we want to delete
                                                            var delId = lib.queryAll("music", {
                                                                limit: 1,
                                                                sort: [["rating", "ASC"], ["date", "ASC"]]
                                                            })[0].ID;
                                                            // delete
                                                            lib.deleteRows("music", function (row) {
                                                                if (row.ID == delId) {
                                                                    return true;
                                                                } else {
                                                                    return false;
                                                                }
                                                            });
                                                            // add the item
                                                            lib.insert("music", {
                                                                name: obj.items[0].snippet.title,
                                                                url: currentUrl,
                                                                thumbnail: obj.items[0].snippet.thumbnails.default.url,
                                                                rating: 0,
                                                                date: Date.now()
                                                            });

                                                        }
                                                    }
                                                }


                                            }
                                        }
                                    } else {
                                        // Do anything for not being valid
                                    }
                                }
                                console.log(tab.url);
                            });
                        });
                    });
                }

                // end of
            }
        });
    }


});

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.type) {
            case 'getStoredVideos':
                var response = {msg:"Error", vids:null};
                if(!(lib == null))
                {
                        if (lib.tableExists("music")) {
                            if (lib.rowCount("music") > 0)
                                response = {msg: "OK", vids: lib.queryAll("music", {sort: [["date", "DESC"]]})};
                            else
                                response = {msg: "Empty", vids: null};
                        }
                        else
                            response = {msg: "No table", vids: null};


                }
                sendResponse(response);
                break;
            case 'getUrl':
                var response1 = {msg:"Error", url:null};
                if(!(lib == null))
                {
                    if (lib.tableExists("music")) {
                        if (lib.rowCount("music") > 0) {
                            // get the ID from the index
                            var v = lib.queryAll("music", {sort: [["date", "DESC"]]});
                            var reqId = v[message.index].ID;

                            var q = lib.queryAll("music", {
                                query: {ID: reqId}
                            });
                            response1 = {msg: "OK", url: q[0].url};
                        }
                        else
                            response1 = {msg: "Empty", url: null};
                    }
                    else
                        response1 = {msg: "No table", url: null};


                }
                sendResponse(response1);
                break;
            case 'delVid':
                var response2 = {msg:"Error"};
                if(!(lib == null))
                {
                    if (lib.tableExists("music")) {
                        if (lib.rowCount("music") > 0) {
                            // get the ID from the index
                            var v = lib.queryAll("music", {sort: [["date", "DESC"]]});
                            var reqId = v[message.index].ID;

                            lib.deleteRows("music", {ID: reqId});
                            lib.commit();
                            response2 = {msg: "OK"};
                        }
                        else
                            response2 = {msg: "Empty"};
                    }
                    else
                        response2 = {msg: "No table"};


                }
                sendResponse(response2);
                break;
            case 'setRating':
                var response3 = {msg:"Error", newIndex:-1};
                if(!(lib == null))
                {
                    if (lib.tableExists("music")) {
                        if (lib.rowCount("music") > 0) {
                            // get the ID from the index
                            var v = lib.queryAll("music", {sort: [["date", "DESC"]]});
                            var reqId = v[message.index].ID;

                            // set rating in db
                            lib.update("music", {ID: reqId}, function(row) {
                                row.rating = message.rating;

                                // the update callback function returns to the modified record
                                return row;
                            });
                            lib.commit();
                            // get the new index
                            var v1 = lib.queryAll("music", {sort: [["date", "DESC"]]});
                            var retInedex = -1;
                            for (k=0;k<v1.length;k++)
                            {
                                if (v1[k].ID == reqId)
                                {
                                    retInedex = k;
                                    break;
                                }
                            }
                            response3 = {msg: "OK", newIndex: retInedex};
                        }
                        else
                            response3 = {msg: "Empty",newIndex: -1};
                    }
                    else
                        response3 = {msg: "No table", newIndex: -1};


                }
                sendResponse(response3);
                break;
            default:
                console.error('Unrecognised message: ', message);
        }
    }
);


