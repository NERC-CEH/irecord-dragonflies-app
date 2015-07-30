/******************************************************************************
 * Species list sorts.
 *****************************************************************************/
define([], function () {
  /**
   * A collection of sorting options used to manage lists.
   * id - sort type identifier
   * label - label to represent the filter in the UI
   */
  var sorts =  {
    taxonomic: {
      label: 'Taxonomic',
        sort: function (list, onSuccess) {
        list.sort(function (a, b) {
          if (a.attributes.general || b.attributes.general){
            return a.attributes.general ? 1 : -1;
          }
          a = parseInt(a.attributes.id);
          b = parseInt(b.attributes.id);
          if (a === b) {
            return 0;
          }
          return a > b ? 1 : -1;
        });
        onSuccess(list);
      }
    },
    common_name: {
      label: 'Common Name',
        sort: function (list, onSuccess) {
        list.sort(function (a, b) {
          if (a.attributes.general || b.attributes.general){
            return a.attributes.general ? 1 : -1;
          }
          a = a.attributes.common_name.toLowerCase();
          b = b.attributes.common_name.toLowerCase();

          if (a === b) {
            return 0;
          }
          return a > b ? 1 : -1;
        });
        onSuccess(list);
      }
    },
    common_name_r: {
      label: 'Common Name Reverse',
        sort: function (list, onSuccess) {
        list.sort(function (a, b) {
          if (a.attributes.general || b.attributes.general){
            return a.attributes.general ? 1 : -1;
          }
          a = a.attributes.common_name.toLowerCase();
          b = b.attributes.common_name.toLowerCase();

          if (a === b) {
            return 0;
          }
          return a < b ? 1 : -1;
        });
        onSuccess(list);
      }
    },
    scientific: {
      label: 'Scientific Name',
        sort: function (list, onSuccess) {
        list.sort(function (a, b) {
          if (a.attributes.general || b.attributes.general){
            return a.attributes.general ? 1 : -1;
          }
          a = a.attributes.taxon.toLowerCase();
          b = b.attributes.taxon.toLowerCase();

          if (a === b) {
            return 0;
          }
          return a > b ? 1 : -1;
        });
        onSuccess(list);
      }
    },
    scientific_r: {
      label: 'Scientific Name Reverse',
        sort: function (list, onSuccess) {
        list.sort(function (a, b) {
          if (a.attributes.general || b.attributes.general){
            return a.attributes.general ? 1 : -1;
          }
          a = a.attributes.taxon.toLowerCase();
          b = b.attributes.taxon.toLowerCase();

          if (a === b) {
            return 0;
          }
          return a < b ? 1 : -1;
        });
        onSuccess(list);
      }
    },
    probability_sort: {
      label: 'Probability',
        sort: function (list, onSuccess){
        var sref = app.models.user.getLocationSref();
        if (sref == null) {
          app.models.user.save('sort', 'common_name'); //todo: should be done with error handler
          Backbone.history.navigate('location', {trigger:true});
          return;
        }

        list.sort(function (a, b) {
            if (a.attributes.general || b.attributes.general){
              return a.attributes.general ? 1 : -1;
            }
            var a_prob = getProb(a);
            var b_prob = getProb(b);
            if (a_prob == b_prob) return 0;
            return a_prob < b_prob ? 1 : -1;

            function getProb(species) {
              var id = species.attributes.id;
              var data = app.data.probability;
              return (data[sref] && data[sref][id]) || 0;
            }
          }
        );
        onSuccess(list);
      }
    }
  };

  return sorts;
});
