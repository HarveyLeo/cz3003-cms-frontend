/**
 * Created by sunzhihao on 19/3/16.
 */

function getCrisis($rootScope){
    $.ajax({
        type: 'GET',
        dataType: "json",
        processData: false,
        crossDomain: true,
        jsonp: false,
        url: "http://cms-torophp.rhcloud.com/incident/",
        success: function (responseData, textStatus, jqXHR) {

            $rootScope.incidents = responseData;

            resetMarkers($rootScope, responseData);

            $(".crisis").text(responseData.length);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getSyslog(){
    $.ajax({
        type: 'GET',
        dataType: "json",
        processData: false,
        crossDomain: true,
        jsonp: false,
        url: "http://cms-torophp.rhcloud.com/log/",
        success: function (responseData) {

            for(var i=0;i<responseData.length;i++){
                $("#syslog-body").append("<tr><td>"+ responseData[i].message +"</td><td>"+ responseData[i].timestamp +"</td></tr>")
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}