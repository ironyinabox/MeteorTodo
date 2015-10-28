Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Template.body.events({
    "submit .new-task": function (e) {
      e.preventDefault();

      //event.target.inputName.value
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
