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

            resetMarkers($rootScope);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}