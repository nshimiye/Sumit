(function(){S3.config = {
    key: 'AKIAJHIX2I55CCU2Z2NQ',
    secret: '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',
    bucket: 'sumit_okr',
    directory: '/uploads/images/' //This is optional, defaults to root
};

var imageStore = new FS.Store.S3("images", {
    region: "us-west-2", //required, use the correct region for your bucket
    key: "AKIAJHIX2I55CCU2Z2NQ", //required
    secret: "rHyrS+Dzm/HQB15VuYW/bHVIJ2qN94kR/PwRJi82", //required
    bucket: "sumit_okr", //required
    folder: "/uploads/images/" //optional
  });

Images = new FS.Collection("images", {
  stores: [imageStore],
  beforeSave: function() {
    this.gm().resize(400, 400).save();
  },
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

Images.allow({
  insert: function(userId) {
    return true;
  },
  update: function(userId) {
    return !!userId;
  },
  remove: function(userId) {
    return !!userId;
  },
  download: function(userId) {
    return true;
  },
  fetch: []
});

Meteor.publish("images", function() {
  return Images.find();
});


Meteor.methods({
    callbackFunction:function(url, context){
        console.log('Add '+url+' to the id of '+context);
    },
    saveIt:function(file){
    	console.log("no server",file);
    	var a = Images.insert(file);
        return a;
    }
});



})();
