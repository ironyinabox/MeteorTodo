Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Meteor.subscribe("tasks");

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  })

  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        var options = {checked: {$ne: true}};
      } else {
        var options = {};
      }
      return Tasks.find(options, {sort: {createdAt: -1}})
    },
    hideCompleted: function () {
      return Session.get("hideCompleted")
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "click .toggle-checked": function () {
      Meteor.call("setChecked", this._id, !this.checked);
    },

    "click .delete": function () {
      Meteor.call("deleteTask", this._id)
    },

    "submit .new-task": function (e) {
      e.preventDefault();
      //event.target.htmlname.value
      var text = e.target.text.value
      Meteor.call("addTask", text);
      //Clear form
      e.target.text.value = "";
    },

    "change .hide-completed input": function (e) {
      Session.set("hideCompleted", e.target.checked);
    },

    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId}
      ]
    });
  })
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  addTask: function (text) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
})
