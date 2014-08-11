var pdfToHtmlTransform = function(fileObj, readStream, writeStream) {
  fileObj.extension('html', {store: "templates"});
  fileObj.type('text/html', {store: "templates"});

  var fs = Npm.require("fs");
  var events = Npm.require("events");
  var eventEmitter = new events.EventEmitter();
  var id = fileObj._id;

  var download = function(){
    var localFile = fs.createWriteStream(id + ".pdf");
    readStream.pipe(localFile);
    readStream.on("end", function() {
      eventEmitter.emit("downloaded");
    });
  };

  //call pdf2html on file, arbitrarily waits 15 seconds before continuing
  var convert = function() {
    pdf2htmlEX.zoom(id + ".pdf", 1.3,
      function (err, buffer) {   
        if (err) eventEmitter.emit("error", err);
        else setTimeout(function(){eventEmitter.emit("converted");}, 15000);
    });
  };

  //put new html file in Collection
  var upload = function() {
    var readStream = fs.createReadStream(id + ".html");

    readStream.pipe(writeStream);
    readStream.on("end", function() {
      eventEmitter.emit("uploaded");
    });
  };


  eventEmitter.on("downloaded", convert);

  eventEmitter.on("converted", upload);

  eventEmitter.on("error", function(error) {
    console.log("Some sort of error");
    console.log(error); console.log("");
  });

  process.on("uncaughtException", function(err) {
    console.log("Caught exception: " + err);
  });

  return download();
};

  //test code
  var testStore = new FS.Store.FileSystem("test");

articles = new FS.Collection("articles", {
  stores: [testStore]
});

//S3 Connection to sumut_okr_html
s3Store = new FS.Store.S3("s3Store", {
    region: 'us-east-1',
    bucket: "sumit_okr_html", //required
    folder: "/oai:openknowledge.worldbank.org:10986/"
});

//Collection for sumit_okr_html articles
ArticlesFS = new FS.Collection("s3articles", {
  stores: [s3Store],
});

ArticlesFS.allow({
    insert: function(userId, file) {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    },
    download: function() {
      return true;
    }
  });

if (Meteor.isClient) {
  Meteor.subscribe("allArticles");
  //Meteor.subscribe("allS3Articles");

  Template.fileAdd.events({
    "dragover .fileDrop": function(e, t) {
      e.stopPropagation();
      e.preventDefault();
    },
    "dropped .fileDrop": function(e, t) {
      e.stopPropagation();
      e.preventDefault();

      FS.Utility.eachFile(event, function(file) {
        articles.insert(file, function (err, fileObj) {
          //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
          if (fileObj) console.log(fileObj);
          if (err) console.log(err);
        });
      });
    }
  });

  //test code
  Meteor.subscribe("allArticles");
  Template.fileAdd.files = function () {
    return articles.find({});
  };
  //end test code
}

if (Meteor.isServer) {

  //loading in sample data for the sumit_okr_html s3 articles
  //into ArticlesFS collection. Using s3Store and local file path

  //test code
  Meteor.publish("allArticles", function(){
    return articles.find({});
  });

  Meteor.publish("singleArticle", function(articleId){
    return articles.find(articleId);
  });

  articles.allow({
    insert: function(userId, file) {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    },
    download: function() {
      return true;
    }
  });
  //end test code

  Meteor.publish("allS3Articles", function() {
    return ArticlesFS.find();
  });

}
