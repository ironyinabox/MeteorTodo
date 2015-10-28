Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Template.body.helpers({
    tasks: function () {
      //Collection.find(notsure, options)
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "click .toggle-checked": function () {
      Tasks.update(this._id, {
        $set: {checked: !this.checked}
      })
    },

    "click .delete": function () {
      Tasks.remove(this._id);
    },
    
    "submit .new-task": function (e) {
      e.preventDefault();

      //event.target.htmlname.value
      var text = e.target.text.value

      //property: value
      Tasks.insert({
        text: text,
        createdAt: new Date()
      });
      //Clear form
      e.target.text.value = "";
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
