//Place all your database queries here
var QueryMap = {
'getUserPreference' : " call csi.getUserPreference(?, ?)",
'setUserPreference': "call csi.setUserPreference(?, ?, ?)"
};

MySqlQueryFactory = function(){
}

MySqlQueryFactory.prototype.getQuery = function(queryId){
    return QueryMap[queryId];
}

module.exports = new MySqlQueryFactory();
