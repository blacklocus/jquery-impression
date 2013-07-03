jQuery Impression
=================
Uses LocalStorage to save values entered into form fields so that on refresh or navigate away and back, the values
remain. Useful for often used `form`s which receive little to no alteration over subsequent submission.

At BlackLocus, this saves us a lot of keystrokes on internal tooling UIs where we often need to submit certain forms
multiple times with few to no intermediary input changes.



Usage
-----
This will both recall saved values and also hook change events to record form values.

    $(form).impression();

Forms are identified by their `id` attribute, a hash value of the fields' `name` attributes, and the current page URL.
The respective jquery.impression keys are `formId`, `fieldHash`, and `href`. By default all are included, but the set can
be overridden as follows.

    $(form).impression({
        idFields: ['formId', 'href']
    });

This could be useful during development where your form changes often every refresh, but you'd like to keep inputs
populated as much as possible to speed development.

Finally all jquery.impression saved form data can be cleared, if you just feel dirty with loose bits hanging around.

    $.impression.clear();


License
-------
Copyright 2013 BlackLocus

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the
License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
language governing permissions and limitations under the License.
