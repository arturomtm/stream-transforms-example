var Transform = require('stream').Transform,
    inherits = require('util').inherits;

function Unpacker(){
  if (!(this instanceof Unpacker)) {
    return new Unpacker(options);
  }
  Transform.call(this);
  this._remaining = 0;
  this._buffer = new Buffer(0);
}
inherits(Unpacker, Transform);

function unpack(chunk){
  var partial = chunk.slice(0, this._remaining),
      newPackage = chunk.slice(this._remaining);
  this._buffer = Buffer.concat([this._buffer, partial]);
  this._remaining -= partial.length;
  if (this._remaining) return;
  this.push(this._buffer);
  this._buffer = new Buffer(0);
  for (var d = 0; d < newPackage.length; d++){
    if (newPackage[d] === 0xd && newPackage[d+1] === 0xa) {
      this._remaining = +newPackage.slice(0,d).toString();
      unpack.call(this, newPackage.slice(d+2));
      break;
    }
  }
};

Unpacker.prototype._transform = function(chunk, encoding, done){
  // avoid to expose unpack function
  unpack.call(this, chunk);
  done();
};

module.exports = Unpacker;
