var Transform = require('stream').Transform,
    inherits = require('util').inherits,
    zlib = require('zlib');
	
function Unzipper(){
  Transform.call(this);
  this._zipped = new Buffer(0);
}
inherits(Unzipper, Transform);

Unzipper.prototype._transform = function(chunk, encoding, done){
  if (chunk[0] === 0x78 && chunk[1] === 0x9C){
    this._zipped = chunk;
  	zlib.unzip(this._zipped, function(err, payload){
      if (!err) {
        this.push(payload);
        this._zipped = new Buffer(0);
      }
      done();
	  }.bind(this));
  } else {
    Buffer.concat([this._zipped, chunk]);
    done();
  }
};

module.exports = Unzipper;
