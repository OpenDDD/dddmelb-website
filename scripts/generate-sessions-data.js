var azure = require('azure-storage');
var tableSvc = azure.createTableService();
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var abbreviatePresenterName = function(name) {
  if(name == null || name === '') {
    return '';
  }

  var nameSplit = name.split(',');
  var names = [];
  for(var i = 0; i < nameSplit.length; i++) {
  	var name = nameSplit[i].trim().replace(/(\b[a-zA-Z])[a-zA-Z]* /, '$1. ');
    names.push(name);
  }

  return names.join(', ').trim();
};

var normaliseWebsite = function(url) {
  if(url == null || url === '') {
    return undefined;
  }

  if(!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://'+url;
  }

  return url;
};

var normaliseTwitterHandle = function(twitterHandle) {
  if(twitterHandle == null || twitterHandle === '') {
    return undefined;
  }

  return twitterHandle.replace('@', '');
};

var getApprovedSessions = function(callback) {
  var sessions = [];
  var query = new azure.TableQuery()
    .where('Status eq ?', 1);

  tableSvc.queryEntities('Sessions', query, null, function(err, result, response) {
    if(err != null) {
      console.error('Error finding sessions', err);
      callback(sessions);
      return;
    }

    if(!result.entries || result.entries.length == 0) {
      console.log('No sessions submitted yet');
      callback(sessions);
      return;
    }

    var entries = _.orderBy(result.entries, [function(entry) { return entry.Timestamp._.toISOString(); }], ['desc'])
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var session = {
        id: entry.RowKey._,
        title: entry.SessionTitle != null ? entry.SessionTitle._ : '',
        name: abbreviatePresenterName(entry.PresenterName != null ? entry.PresenterName._ : ''),
        twitter: normaliseTwitterHandle(entry.PresenterTwitterAlias != null ? entry.PresenterTwitterAlias._ : ''),
        website: normaliseWebsite(entry.PresenterWebsite != null ? entry.PresenterWebsite._ : ''),
        abstract: entry.SessionAbstract != null ? entry.SessionAbstract._ : ''
      };
      sessions.push(session);
    }

    callback(sessions);
  });
};

function writeSessionsAsData(sessions) {
  var filePath = path.join(__dirname, '..', 'data', 'sessions.json');
  fs.writeFile(filePath, JSON.stringify(sessions, null, 2), 'utf8', function(err) {
    if(err != null) {
        return console.error('Error writing sessions file', err);
    }
    console.log('Sessions written to ' + filePath);
});
}

getApprovedSessions(writeSessionsAsData);
