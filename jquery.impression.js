(function ($) {



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utility

    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };

    /**
     * @returns {number} that is the hashcode of some string
     */
    String.prototype.hashCode = function() {
        var hash = 0, i, $char;
        if (this.length == 0) return hash;
        for (i = 0, l = this.length; i < l; i++) {
            $char  = this.charCodeAt(i);
            hash  = ((hash<<5)-hash)+$char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    /** turn a form into a js object */
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // jQuery.impression

    var keyPrefix = 'jquery.impression:';

    // $.serializeArray (on which $.serializeObject is based) only pulls in what we care about for the most part.
    // There are a few excludes nonetheless, namely, password fields.
    var excludeTypes = [
        'password'
    ];

    $.fn.impression = function (options) {
        options = options || {};

        // non-zero set of idFields, otherwise include all
        var idFields = options.idFields && options.idFields.length && options.idFields || ['formId', 'fieldHash', 'href'];
        var idFieldsSet = {};
        $.each(idFields, function(idx, el) {
            idFieldsSet[el] = {};
        });


        // data functions

        function prepareImpData(form) {
            var data = form.serializeObject();

            // Filter out excluded types
            $.each(excludeTypes, function(idx, excludeType) {
                var inputs = form.find('input[type={0}][name]'.format(excludeType));
                inputs.each(function (idx, input) {
                    delete data[$(input).attr('name')];
                });
            });

            return data;
        }

        function getStorageId(form) {
            var id = {};
            if (idFieldsSet.formId) {
                id.formId = form.attr('id');
            }
            if (idFieldsSet.fieldHash) {
                id.fieldHash = JSON.stringify(prepareImpData(form)).hashCode();
            }
            if (idFieldsSet.href) {
                id.href = window.location.href;
            }
            return keyPrefix + $.param(id);
        }

        function getImpData(storageId) {
            var impDataJson = localStorage.getItem(storageId);
            return impDataJson ? JSON.parse(impDataJson) : {};
        }

        function saveImpData(storageId, form) {
            console.debug('saving ' + storageId);
            localStorage.setItem(storageId, JSON.stringify(prepareImpData(form)));
        }



        // core logic

        return this.each(function() {
            var $this = $(this);
            var storageId = getStorageId($this);
            var impData = getImpData(storageId);

            $.each(impData, function(key, value) {
                // restore any previously input values
                var inputs = $this.find('[name={0}]'.format(key));
                if (inputs.is('[type=checkbox]')) {
                    // checkboxes remain annoying to this day
                    inputs.prop('checked', true);
                } else if (inputs.is('[type=radio]')) {
                    // radios remain annoying to this day
                    inputs.filter('[value={0}]'.format(value)).prop('checked', true);
                } else {
                    inputs.val(value);
                }
            });

            $this.change(function(jqEvent){
                saveImpData(storageId, $this);
            });

            $(window).bind("beforeunload", function(jqEvent) {
                saveImpData(storageId, $this);
                return null;
            });
        });
    };



    // public functions

    $.impression = {
        clear: function () {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);
                if (key.indexOf(keyPrefix) === 0) {
                    console.debug('deleting ' + key);
                    localStorage.removeItem(key);
                }
            }
        }
    };


})(jQuery);