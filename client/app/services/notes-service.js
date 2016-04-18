(function() {
  angular.module('notely')
    .service('NotesService', NotesService);

  NotesService.$inject = ['$http', 'API_BASE'];
  function NotesService($http, API_BASE) {
    var _this = this;
    _this.notes = [];

    _this.fetch = function() {
      return $http.get(`${API_BASE}notes`)
        .then(
          // Success
          function(response) {
            _this.notes = response.data;
          }
        );
    };

    _this.getNotes = function() {
      return _this.notes;
    };

    _this.create = function(note) {
      var creationPromise = $http.post(`${API_BASE}notes`, {
        note: note
      });

      creationPromise.then(function(response) {
        _this.notes.unshift(response.data.note);
      });

      return creationPromise;
    };

    _this.update = function(note) {
      var updatePromise = $http.put(`${API_BASE}notes/${note._id}`, {
        note: {
          title: note.title,
          body_html: note.body_html
        }
      });

      updatePromise.then(function(response) {
        _this.replaceNote(response.data.note);
      });

      return updatePromise;
    };

    _this.delete = function(note) {
      return $http.delete(`${API_BASE}notes/${note._id}`
      ).then(function(response) {
        _this.removeNote(response.data.note);
      });
    };

    _this.removeNote = function(note) {
      for (var i = 0; i < _this.notes.length; i++) {
        if (_this.notes[i]._id === note._id) {
          _this.notes.splice(i, 1);
          return;
        }
      }
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
