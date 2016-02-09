'use strict';

// Tournament Model

// Contains users and points accumulated on tournament

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TournamentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateStart: {
    type: Date,
    default: Date.now
  },
  dateEnd: {
    type: Date,
    default: Date.now
  },
  players: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    points: {
      type: Number,
      default: 0
    },
  }],
  created: {
    type: Date,
    default: Date.now
  },
});

TournamentSchema.virtual('isActive').get(function() {
    return (this.dateStart > Date.now && this.dateEnd < Date.now);
});

module.exports = mongoose.model('Tournament', TournamentSchema);
