/**
 * App Tests. Loaded in the app by RequireJS.
 */

define(['morel'], function (morel) {
    window.app || (window.app = {});

    var test = {
        run: function () {
            this.populateDBSamples(45);
        },

        clean: function () {
            this.recordManager.clear();
        },

        populateDBSamples: function (number) {
            this.recordManager = new morel.Manager({
                Storage: morel.DatabaseStorage
            });
            var sample = null,
                megabyte = this._getMegabyte();

            //1000 records
            for (var i = 0; i < number; i++) {
                sample = new morel.Sample({
                    attributes: {data: megabyte}
                });
                this.recordManager.set(sample)
            }
        },

        _getMegabyte: function () {
            var data = '';

            for (var i = 0; i < 1000; i++) {
                data += this._getKilobyte();
            }
            return data;
        },

        _getKilobyte: function () {
            var data = '';

            for (var i = 0; i < 1000; i++) {
                data += '1';
            }
            return data;
        }


    };

    app.test = test;
});