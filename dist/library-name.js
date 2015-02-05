/*! library-name v0.0.0 - (c) 2015 Author Name - License Type */

;(function () {
  'use strict';

  /**
   * Module of library-name.
   * @module
   */
  function libraryName () {
    console.log('Hello, "library-name"!');
  }

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = libraryName;
  }
  else {
    var globalScope = typeof window !== 'undefined' ? window : this;
    globalScope.libraryName = libraryName;
  }

}).call(this);
