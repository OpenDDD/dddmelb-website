var azure = require('azure-storage');
var tableSvc = azure.createTableService();
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var abbreviatePresenterNames = function(name) {
  if(name == null || name === '') {
    return undefined;
  }

  var nameSplit = name.split(',');
  var names = [];
  for(var i = 0; i < nameSplit.length; i++) {
    var name = nameSplit[i].trim().replace(/(\b[a-zA-Z])[a-zA-Z]* /, '$1. ');
    names.push(name);
  }

  return names;
};

var normaliseWebsites = function(url) {
  if(url == null || url === '') {
    return undefined;
  }

  var websiteSplit = url.split(',');
  var websites = [];
  for(var i = 0; i < websiteSplit.length; i++) {
    var website = websiteSplit[i];
    if(!website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'http://'+website.trim();
    }
    websites.push(website);
  }

  return websites;
};

var normaliseTwitterHandles = function(twitterHandle) {
  if(twitterHandle == null || twitterHandle === '') {
    return undefined;
  }

  var twitterHandleSplit = twitterHandle.split(',');
  var twitterHandles = [];
  for(var i = 0; i < twitterHandleSplit.length; i++) {
    twitterHandles.push(twitterHandleSplit[i].replace('@', '').trim());
  }

  return twitterHandles;
};

var getApprovedSessions = function(callback) {
  var sessions = [];
  var query = new azure.TableQuery()
    .where('Status eq ?', 1);

  tableSvc.queryEntities('Sessions', query, null, function(err, result, response) {
    if(err != null) {
      throw new Error('Error finding sessions: ' + err.message);
    }

    if(!result.entries || result.entries.length == 0) {
      console.log('No sessions submitted yet');
      callback(sessions);
      return;
    }

    var entries = _.orderBy(result.entries, [function(entry) { return entry.SessionTitle._ }], ['asc'])
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var session = {
        id: entry.RowKey._,
        title: entry.SessionTitle != null ? entry.SessionTitle._ : '',
        names: '', //abbreviatePresenterNames(entry.PresenterName != null ? entry.PresenterName._ : ''),
        twitters: '', // normaliseTwitterHandles(entry.PresenterTwitterAlias != null ? entry.PresenterTwitterAlias._ : ''),
        websites: '', // normaliseWebsites(entry.PresenterWebsite != null ? entry.PresenterWebsite._ : ''),
        abstract: entry.SessionAbstract != null ? entry.SessionAbstract._ : ''
      };
      sessions.push(session);
    }

    callback(sessions);
  });
};

function writeSessionsAsData(sessions) {
  var dirPath = path.join(__dirname, '..', 'data', 'sessions');

  if(fs.existsSync(dirPath)) {
    rmdir(dirPath);
  }
  fs.mkdirSync(dirPath);

  for(var i = 0; i < sessions.length; i++) {
    var session = sessions[i];
    var fileName = session.title.replace(/ /g, '_').replace(/\W/g, '').replace(/_/g, '-').toLowerCase();
    var filePath = path.join(dirPath, fileName+'.json');
    fs.writeFile(filePath, JSON.stringify(session, null, 2), 'utf8', function(err) {
      if(err != null) {
        throw new Error('Error writing session file: ' + err.message);
      }
      console.log('Session written to ' + filePath);
    });
  }
}

var rmdir = function(dir) {
  var list = fs.readdirSync(dir);
  for(var i = 0; i < list.length; i++) {
    var filename = path.join(dir, list[i]);
    var stat = fs.statSync(filename);

    if(filename == "." || filename == "..") {
    } else if(stat.isDirectory()) {
      rmdir(filename);
    } else {
      fs.unlinkSync(filename);
    }
  }
  fs.rmdirSync(dir);
};

getApprovedSessions(writeSessionsAsData);
