'use strict';

(function() {
  $(document).ready(function () {
    $('[data-toggle="offcanvas"]').click(function (event) {
      if (event.target.dataset) {
        $(event.target.dataset.target).toggleClass('active')
      }
    });
  });
})();