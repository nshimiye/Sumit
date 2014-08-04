(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return Spacebars.include(self.lookupTemplate("main"));
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

Template.__define__("main", (function() {
  var self = this;
  var template = this;
  return [ Spacebars.TemplateWith(function() {
    return {
      callback: Spacebars.call("callbackFunction")
    };
  }, UI.block(function() {
    var self = this;
    return Spacebars.include(self.lookupTemplate("S3"), UI.block(function() {
      var self = this;
      return [ "\n    ", HTML.INPUT({
        type: "file"
      }), "\n" ];
    }));
  })), HTML.Raw('\n\n\n  \n  <input type="file" class="myInputClass">\n\n  '), HTML.DIV("\n  ", UI.Each(function() {
    return Spacebars.call(self.lookup("images"));
  }, UI.block(function() {
    var self = this;
    return [ "\n    ", UI.If(function() {
      return Spacebars.call(self.lookup("cfsIsUploading"));
    }, UI.block(function() {
      var self = this;
      return [ "\n    ", HTML.P(function() {
        return Spacebars.mustache(self.lookup("cfsUploadProgressBar"));
      }, " ", UI.If(function() {
        return Spacebars.call(self.lookup("uploadsArePaused"));
      }, UI.block(function() {
        var self = this;
        return "Paused!";
      }), UI.block(function() {
        var self = this;
        return "Uploading...";
      }))), "\n    " ];
    }), UI.block(function() {
      var self = this;
      return [ "\n    ", HTML.H5(function() {
        return Spacebars.mustache(self.lookup("name"));
      }), "\n    ", HTML.P(function() {
        return Spacebars.mustache(self.lookup("cfsFormattedSize"));
      }), "\n    ", UI.If(function() {
        return Spacebars.call(self.lookup("url"));
      }, UI.block(function() {
        var self = this;
        return [ "\n    ", HTML.DIV(HTML.A({
          href: function() {
            return Spacebars.mustache(self.lookup("url"));
          },
          target: "_blank"
        }, HTML.IMG({
          src: function() {
            return Spacebars.mustache(self.lookup("url"));
          },
          alt: "",
          "class": "thumbnail"
        }))), "\n    " ];
      })), "\n    ", UI.If(function() {
        return Spacebars.call(self.lookup("cfsIsDownloading"));
      }, UI.block(function() {
        var self = this;
        return [ "\n    ", function() {
          return Spacebars.mustache(self.lookup("cfsDownloadProgressBar"));
        }, "\n    " ];
      }), UI.block(function() {
        var self = this;
        return [ "\n    ", function() {
          return Spacebars.mustache(self.lookup("cfsDownloadButton"), Spacebars.kw({
            "class": "btn btn-xs"
          }));
        }, "\n    " ];
      })), "\n    ", function() {
        return Spacebars.mustache(self.lookup("cfsDeleteButton"), Spacebars.kw({
          "class": "btn btn-xs"
        }));
      }, "\n    " ];
    })), "\n  " ];
  })), "\n  ") ];
}));

})();
