(function () {
  require.config({
    paths: {
      'jquery': 'libs/jquery',
      'jquery-mobile': 'libs/jquery.mobile-1.4.5',
      'IndexedDBShim': 'libs/IndexedDBShim',
      'vector3d': 'libs/vector3d',
      'geo': 'libs/geo',
      'latlon-ellipsoid': 'libs/latlon-ellipsoid',
      'osgridref': 'libs/osgridref',
      'klass': 'libs/klass.min',
      'photoswipe': 'libs/code.photoswipe.jquery-3.0.5.min',
      'fastclick': 'libs/fastclick',
      'd3': 'libs/d3',
      'morel': 'libs/morel',
      'lodash': 'libs/lodash',
      'backbone': 'libs/backbone',
      'backbone.localStorage': 'libs/backbone.localStorage'
    },
    shim: {
      'backbone': {depts: ['jquery', 'lodash']}
    }
  });

  require(['app'], function (app){
    app.init();
  });

})();