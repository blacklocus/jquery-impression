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

    $.fn.impression = function () {

        function getStorageId(form) {
            var id = {};
            id.href = window.location.href;
            id.id = form.attr('id');
            // TODO it's possible that a page may have multiple of the same mini-form.
            // id.hierarchy ? when id is undefined. This is still unique and won't collide if parts
            // of the page changes. Any other problems?
            id.fieldHash = JSON.stringify(form.serializeObject()).hashCode();
            return 'jquery.impression:' + $.param(id);
        }

        function getPriorData(storageId) {
            var priorDataJson = localStorage.getItem(storageId);
            return priorDataJson ? JSON.parse(priorDataJson) : {};
        }

        function savePriorData(storageId, form) {
            localStorage.setItem(storageId, JSON.stringify(form.serializeObject()));
        }

        return this.each(function() {
            var storageId = getStorageId(this);
            var priorData = getPriorData(storageId);

            // restore any previously input values
            $.each(priorData, function(key, value) {
                this.find('[name={0}]'.format(key)).val(value);
            });

            // TODO set up recording hooks: onchange, on navigate, others?
        });
    };

})(jQuery);