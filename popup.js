window.onload = function() {

    // check if extension is enabled
    var isExtentionDisabled = localStorage.getItem('musicCatcherEnabled') || -1;
    if (isExtentionDisabled <= 0)
        document.getElementById("enabledCheckBox").checked = true;
    else
        document.getElementById("enabledCheckBox").checked = false;

    document.getElementById("enabledCheckBox").addEventListener('change', (event) => {
        if (event.target.checked) {
            // checked
            localStorage.setItem('musicCatcherEnabled', 0);
        } else {
            localStorage.setItem('musicCatcherEnabled', 1);
        }
    });
    // get data from bg script
    chrome.runtime.sendMessage({ type: "getStoredVideos" }, function (response) {
        if (response.msg == "OK")
        {
            var vids = response.vids;
            var tableRef = document.getElementById('videosTable').getElementsByTagName('tbody')[0];
            for (i=0;i<vids.length;i++) {
                // create row
                var newRow = tableRef.insertRow(tableRef.rows.length);
                newRow.setAttribute('id','row#'+i);

                // create img cell
                var imgCell = newRow.insertCell(0);
                // create img from the thumbnail
                var imgSrc = vids[i].thumbnail;
                img = document.createElement('img');
                img.src = imgSrc;
                var img_class = img.setAttribute('class', 'imgStyle');
                imgCell.appendChild(img);

                // second cell is a vertical 1 col table with 3 raws
                var tbl = document.createElement('table');
                tbl.setAttribute('class', 'verTable');
                var tbdy = document.createElement('tbody');

                // first row is name
                var tr = document.createElement('tr');
                //tr.style.border = '1px solid black';
                var td = document.createElement('td');
                // create name cell
                //var nameCell = newRow.insertCell(1);
                // create css span and add class to it
                var el_span = document.createElement('span');
                el_span.setAttribute('class', 'nameStyle');
                var nameText  = document.createTextNode(vids[i].name);
                //nameCell.appendChild(el_span);
                el_span.appendChild(nameText);
                td.appendChild(el_span);
                tr.appendChild(td);
                tbdy.appendChild(tr);

                // second row is the rating
                var tr1 = document.createElement('tr');
                //tr1.style.border = '1px solid black';
                var td1 = document.createElement('td');
                // create container div
                var ratingDiv = document.createElement('div');
                // div class
                var ratingDivClass = ratingDiv.setAttribute('class', 'rating');
                // create radio buttons
                var radioInput1 = document.createElement('input');
                radioInput1.setAttribute('type', 'radio');
                radioInput1.setAttribute('name', 'star'+i);
                radioInput1.setAttribute('id', 'r1'+i);
                var radioLabel1 = document.createElement('label');
                radioLabel1.setAttribute('for','r1'+i);

                var radioInput2 = document.createElement('input');
                radioInput2.setAttribute('type', 'radio');
                radioInput2.setAttribute('name', 'star'+i);
                radioInput2.setAttribute('id', 'r2'+i);
                var radioLabel2 = document.createElement('label');
                radioLabel2.setAttribute('for','r2'+i);

                var radioInput3 = document.createElement('input');
                radioInput3.setAttribute('type', 'radio');
                radioInput3.setAttribute('name', 'star'+i);
                radioInput3.setAttribute('id', 'r3'+i);
                var radioLabel3 = document.createElement('label');
                radioLabel3.setAttribute('for','r3'+i);

                var radioInput4 = document.createElement('input');
                radioInput4.setAttribute('type', 'radio');
                radioInput4.setAttribute('name', 'star'+i);
                radioInput4.setAttribute('id', 'r4'+i);
                var radioLabel4 = document.createElement('label');
                radioLabel4.setAttribute('for','r4'+i);

                var radioInput5 = document.createElement('input');
                radioInput5.setAttribute('type', 'radio');
                radioInput5.setAttribute('name', 'star'+i);
                radioInput5.setAttribute('id', 'r5'+i);
                var radioLabel5 = document.createElement('label');
                radioLabel5.setAttribute('for','r5'+i);

                // display rating
                var rating = vids[i].rating;
                switch (rating) {
                    case 1 :
                        radioInput5.checked = true;
                        break;
                    case 2 :
                        radioInput4.checked = true;
                        break;
                    case 3 :
                        radioInput3.checked = true;
                        break;
                    case 4 :
                        radioInput2.checked = true;
                        break;
                    case 5 :
                        radioInput1.checked = true;
                        break;
                    default :
                        radioInput5.checked = false;
                        radioInput4.checked = false;
                        radioInput3.checked = false;
                        radioInput2.checked = false;
                        radioInput1.checked = false;

                }

                // rating change handlers
                radioInput5.addEventListener('change',function () {
                    if (this.checked)
                    {
                        // get index from id
                        var curID = this.id.toString();
                        var index = curID.substr(2);
                        // 1 star send to bg
                        chrome.runtime.sendMessage({ type: 'setRating', rating:1, index: parseInt(index) }, function (response) {
                            if (response.msg === "OK")
                            {
                                // update UI IDs first get new index after rating change
                                /*var newIndex = response.newIndex;
                                if (newIndex != index) {
                                    // update the ids
                                    var opnBtn = document.getElementById("openBtn#" + index);
                                    var cpBtn = document.getElementById("copyBtn#" + index);
                                    var dlBtn = document.getElementById("delBtn#" + index);
                                    opnBtn.setAttribute('id',"openBtn#" + newIndex);
                                    cpBtn.setAttribute('id',"copyBtn#" + newIndex);
                                    dlBtn.setAttribute('id',"delBtn#" + newIndex);

                                }*/

                            }
                        });

                    }
                });

                radioInput4.addEventListener('change',function () {
                    if (this.checked)
                    {
                        // get index from id
                        var curID = this.id.toString();
                        var index = curID.substr(2);
                        // 2 star send to bg
                        chrome.runtime.sendMessage({ type: 'setRating', rating:2, index: parseInt(index) }, function (response) {
                            if (response.msg === "OK")
                            {
                                // do nothing
                            }
                        });

                    }
                });

                radioInput3.addEventListener('change',function () {
                    if (this.checked)
                    {
                        // get index from id
                        var curID = this.id.toString();
                        var index = curID.substr(2);
                        // 3 star send to bg
                        chrome.runtime.sendMessage({ type: 'setRating', rating:3, index: parseInt(index)}, function (response) {
                            if (response.msg === "OK")
                            {
                                // do nothing
                            }
                        });

                    }
                });

                radioInput2.addEventListener('change',function () {
                    if (this.checked)
                    {
                        // get index from id
                        var curID = this.id.toString();
                        var index = curID.substr(2);
                        // 4 star send to bg
                        chrome.runtime.sendMessage({ type: 'setRating', rating:4, index: parseInt(index) }, function (response) {
                            if (response.msg === "OK")
                            {
                                // do nothing
                            }
                        });

                    }
                });

                radioInput1.addEventListener('change',function () {
                    if (this.checked)
                    {
                        // get index from id
                        var curID = this.id.toString();
                        var index = curID.substr(2);
                        // 5 star send to bg
                        chrome.runtime.sendMessage({ type: 'setRating', rating:5, index: parseInt(index) }, function (response) {
                            if (response.msg === "OK")
                            {
                                // do nothing
                            }
                        });

                    }
                });

                // add to div
                ratingDiv.appendChild(radioInput1);
                ratingDiv.appendChild(radioLabel1);
                ratingDiv.appendChild(radioInput2);
                ratingDiv.appendChild(radioLabel2);
                ratingDiv.appendChild(radioInput3);
                ratingDiv.appendChild(radioLabel3);
                ratingDiv.appendChild(radioInput4);
                ratingDiv.appendChild(radioLabel4);
                ratingDiv.appendChild(radioInput5);
                ratingDiv.appendChild(radioLabel5);

                td1.appendChild(ratingDiv);
                tr1.appendChild(td1);
                tbdy.appendChild(tr1);

                // third row for buttons
                var tr2 = document.createElement('tr');
                //tr2.style.border = '1px solid black';
                var td2 = document.createElement('td');

                // create horizontal table for buttons
                var hTbl = document.createElement('table');
                hTbl.setAttribute('class', 'horTable');
                var hTbdy = document.createElement('tbody');
                var onlyRow = document.createElement('tr');

                // 3 buttons = 3 tds
                var playTd = document.createElement('td');
                var playBtn = document.createElement('a');
                playBtn.setAttribute('href','#');
                playBtn.setAttribute('class','btn');
                playBtn.setAttribute('id','openBtn#'+i);
                var playTxt = document.createTextNode('OPEN');
                // onclick
                playBtn.addEventListener('click', function() {
                    // get index from id
                    var curID = this.id.toString();
                    var index = curID.substr(curID.indexOf("#")+1);
                    // send message to bg
                    chrome.runtime.sendMessage({ type: 'getUrl', index: parseInt(index) }, function (response1) {
                        if (response1.msg === "OK")
                        {
                            var win = window.open(response1.url,'_blank');
                            win.focus();
                        }
                    });
                }, false);

                playBtn.appendChild(playTxt);
                playTd.appendChild(playBtn);

                // copy btn
                var copyTd = document.createElement('td');
                var copyBtn = document.createElement('a');
                copyBtn.setAttribute('href','#');
                copyBtn.setAttribute('class','btn1');
                copyBtn.setAttribute('id','copyBtn#'+i);
                var copyTxt = document.createTextNode('COPY');

                copyBtn.addEventListener('click', function() {
                    // get index from id
                    var curID = this.id.toString();
                    var index = curID.substr(curID.indexOf("#")+1);
                    // send message to bg
                    chrome.runtime.sendMessage({ type: 'getUrl', index: parseInt(index) }, function (response1) {
                        if (response1.msg === "OK")
                        {
                            // copy to clipboard
                            copyToClipboard(response1.url);
                            // show notification
                            var x = document.getElementById("snackbar");

                            // Add the "show" class to DIV
                            x.className = "show";

                            // After 3 seconds, remove the show class from DIV
                            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
                        }
                    });
                }, false);

                copyBtn.appendChild(copyTxt);
                copyTd.appendChild(copyBtn);

                var delTd = document.createElement('td');
                var delBtn = document.createElement('a');
                delBtn.setAttribute('href','#');
                delBtn.setAttribute('class','btn2');
                delBtn.setAttribute('id','delBtn#'+i);
                var delText = document.createTextNode('DELETE');

                delBtn.addEventListener('click', function() {
                    // get index from id
                    var curID = this.id.toString();
                    var index = curID.substr(curID.indexOf("#")+1);
                    // send message to bg
                    chrome.runtime.sendMessage({ type: 'delVid', index: parseInt(index) }, function (response2) {
                        if (response2.msg === "OK")
                        {
                            // refresh to update UI
                            location.reload();

                        }
                    });
                }, false);


                delBtn.appendChild(delText);
                delTd.appendChild(delBtn);

                // date
                var dateTd = document.createElement('td');
                var dateSpan = document.createElement('span');
                dateSpan.setAttribute('class','dateClass');
                var date = new Date(vids[i].date);
                var dateTxt = document.createTextNode(date.toLocaleString());
                dateSpan.appendChild(dateTxt);
                dateTd.appendChild(dateSpan);


                onlyRow.appendChild(playTd);
                onlyRow.appendChild(copyTd);
                onlyRow.appendChild(delTd);
                onlyRow.appendChild(dateTd);


                hTbdy.appendChild(onlyRow);
                hTbl.appendChild(hTbdy);

                td2.appendChild(hTbl);
                tr2.appendChild(td2);
                tbdy.appendChild(tr2);

                // add to intial row
                tbl.appendChild(tbdy);
                newRow.appendChild(tbl);


            }
        }
        else {
            var tableRef = document.getElementById('videosTable').getElementsByTagName('tbody')[0];
            var newRow = tableRef.insertRow(tableRef.rows.length);
            var cell = newRow.insertCell(0);
            cell.appendChild(document.createTextNode(response.msg))
        }
    });

};

function copyToClipboard(text){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}