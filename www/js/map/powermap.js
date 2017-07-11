// extend TileLayer class prototype
L.TileLayer.GWC = L.TileLayer.extend({
  _padZeros: function(unPaddedInt,padReq) {
      padded = unPaddedInt.toString()
      while (padded.length < padReq) {
          padded = '0'+padded;
      }
      return padded
  },

  _getWrapTileNum: function () {
    // TODO refactor, limit is not valid for non-standard projections
    return Math.pow(2, this._getZoomForUrl());
  },

  _adjustTilePoint: function (tilePoint) {

    var limit = this._getWrapTileNum();

    // wrap tile coordinates
    if (!this.options.continuousWorld && !this.options.noWrap) {
      tilePoint.x = ((tilePoint.x % limit) + limit) % limit;
    }

    if (this.options.tms) {
      tilePoint.y = limit - tilePoint.y - 1;
    }

    tilePoint.z = this._getZoomForUrl();
  },
  getTileUrl: function (tilePoint) {
    // this._adjustTilePoint(tilePoint);
    // console.log(tilePoint)
    return L.Util.template(this._url, L.extend({
      s: this._getSubdomain(tilePoint),
      z: this._padZeros(this._getZoomForUrl(),2),
      dir_x: this._padZeros(Math.floor(tilePoint.x/(Math.pow(2,Math.floor(1+(this._getZoomForUrl(tilePoint)/2))))), Math.floor(this._getZoomForUrl(tilePoint)/6)+1),
      dir_y: this._padZeros(Math.floor(tilePoint.y/(Math.pow(2,Math.floor(1+(this._getZoomForUrl(tilePoint)/2))))), Math.floor(this._getZoomForUrl(tilePoint)/6)+1),
      x: this._padZeros(tilePoint.x,2+(Math.floor(this._getZoomForUrl(tilePoint)/6)*2)),
      y: this._padZeros(tilePoint.y,2+(Math.floor(this._getZoomForUrl(tilePoint)/6)*2))
    }, this.options));
  }
})
