'use strict';

window.onload = function() {

  // ===================== Navbar Collapse ======================
  var navCollapseBtn = document.getElementById('navCollapseBtn');
  navCollapseBtn ? navCollapseBtn.addEventListener('click', function(e) {
    var navCollapse = document.querySelector('.navbar__collapse');

    if (navCollapse) {
      var dataOpen = navCollapse.getAttribute('data-open');

      if (dataOpen === 'true') {
        navCollapse.setAttribute('data-open', 'false');
        navCollapse.style.maxHeight = 0;
      } else {
        navCollapse.setAttribute('data-open', 'true');
        navCollapse.style.maxHeight = navCollapse.scrollHeight + 'px';
      }
    }
  }) : null;

  // ========================== Expand ==========================
  var expandBtn = document.querySelectorAll('.expand__button');

  for (var i = 0; i < expandBtn.length; i++) {
    expandBtn[i].addEventListener('click', function () {
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        this.querySelector('svg').classList.add('expand-icon__right');
        this.querySelector('svg').classList.remove('expand-icon__down');
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        this.querySelector('svg').classList.remove('expand-icon__right');
        this.querySelector('svg').classList.add('expand-icon__down');
      }
    });
  }
  
  // =================== Section Menu Collapse ==================
  document.querySelectorAll('.menu__list').forEach(function(elem) {
    if (elem.classList.contains('active')) {
      elem.style.maxHeight = elem.scrollHeight + 'px';
    }
  });

  document.querySelectorAll('.menu__title--collapse').forEach(function(elem) {
    elem.addEventListener('click', function (e) {
      var content = this.nextElementSibling;
      var menuTitleIcon = this.querySelector('.menu__title--icon');
      if (!content) {
        return null;
      }

      var parent = elem.parentNode;
      while (parent.classList.contains('menu__list') && parent.classList.contains('active')) {
        parent.style.maxHeight = 100 * parent.children.length + 'px';
        parent = parent.parentNode;
      }

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.classList.remove('active');
        menuTitleIcon.classList.add('right');
        menuTitleIcon.classList.remove('down');
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('active');
        menuTitleIcon.classList.remove('right');
        menuTitleIcon.classList.add('down');
      }
    });
  });
};
