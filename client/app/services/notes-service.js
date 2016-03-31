(function() {
  angular.module('notely')
    .service('NotesService', NotesService);

  NotesService.$inject = ['$http'];
  function NotesService($http) {
    var _this = this;
    _this.notes = [];

    _this.fetch = function() {
      return $http.get('http://localhost:3030/notes')
        .then(
          // Success
          function(response) {
            _this.notes = response.data;
          },

          // Failure
          function(response) {
            console.log('aww, snap:' + response);
          }
        );
    };

    _this.getNotes = function() {
      return _this.notes;
    };

    _this.create = function(note) {
      return $http.post('http://localhost:3030/notes', {
        note: note
      }).then(function(response) {
        _this.notes.unshift(response.data.note);
      });
    };

    _this.update = function(note) {
      return $http.put('http://localhost:3030/notes/' + note._id, {
        note: {
          title: note.title,
          body_html: note.body_html
        }
      }).then(function(response) {
        _this.replaceNote(response.data.note);
      });
    };

    _this.replaceNote = function(updatedNote) {
      for (var i = 0; i < _this.notes.length; i++) {
        if (_this.notes[i]._id === updatedNote._id) {
          _this.notes[i] = updatedNote;
          return;
        }
      }
    };

    _this.findById = function(noteId) {
      for (var i = 0; i < _this.notes.length; i++) {
        // If the IDs match, return the current note
        if (_this.notes[i]._id === noteId) {
          return angular.copy(_this.notes[i]);
        }
      }
      return {};
    };
  }
}());
