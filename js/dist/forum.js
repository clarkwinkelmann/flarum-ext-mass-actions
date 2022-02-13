/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/forum/addDiscussionActions.ts":
/*!*******************************************!*\
  !*** ./src/forum/addDiscussionActions.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_proxyModels__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/proxyModels */ "./src/forum/utils/proxyModels.ts");
/* harmony import */ var _components_IconButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/IconButton */ "./src/forum/components/IconButton.ts");








/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'actionItems', function (items) {
    var select = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select');

    if (!select || select.count() === 0) {
      return;
    } // Remove global actions


    items.remove('refresh');
    items.remove('markAllAsRead');
    items.add('mass-markAsRead', m(_components_IconButton__WEBPACK_IMPORTED_MODULE_7__["default"], {
      title: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.markAsRead'),
      icon: 'fas fa-check',
      onclick: function onclick() {
        select.forEachPromise(function (discussion) {
          // Same code as in DiscussionListItem
          if (discussion.isUnread()) {
            return discussion.save({
              lastReadPostNumber: discussion.lastPostNumber()
            });
          }

          return Promise.resolve();
        }).then(function () {
          m.redraw();
        });
      }
    }));

    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('canHideDiscussionsSometime')) {
      var anyHidden = select.some(function (discussion) {
        return discussion.isHidden();
      });
      items.add('mass-hide', m(_components_IconButton__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: anyHidden ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.restore') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.hide'),
        icon: anyHidden ? 'fas fa-reply' : 'fas fa-trash-alt',
        onclick: function onclick() {
          select.forEachPromise(function (discussion) {
            if (!discussion.canHide()) {
              return Promise.resolve();
            }

            if (anyHidden) {
              return flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_5___default().restoreAction.call(discussion);
            } else {
              return flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_5___default().hideAction.call(discussion);
            }
          }).then(function () {
            m.redraw();
          });
        },
        disabled: !select.some(function (discussion) {
          return discussion.canHide();
        })
      }));
    }

    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('canLockDiscussionsSometime')) {
      var anyLocked = select.some(function (discussion) {
        return discussion.attribute('isLocked');
      });
      items.add('mass-lock', m(_components_IconButton__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: anyLocked ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.unlock') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.lock'),
        icon: anyLocked ? 'fas fa-unlock' : 'fas fa-lock',
        onclick: function onclick() {
          select.forEachPromise(function (discussion) {
            if (!discussion.attribute('canLock')) {
              return Promise.resolve();
            } // Re-implement DiscussionControls.lockAction to force lock or unlock instead of toggling


            return discussion.save({
              isLocked: !anyLocked
            });
          }).then(function () {
            m.redraw();
          });
        },
        disabled: !select.some(function (discussion) {
          return discussion.attribute('canLock');
        })
      }));
    }

    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('canTagDiscussionsSometime')) {
      items.add('mass-tags', flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default().component({
        buttonClassName: 'Button',
        label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.tags'),
        disabled: !select.some(function (discussion) {
          return discussion.attribute('canTag');
        })
      }, [flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default().component({
        onclick: function onclick() {
          flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(flarum.core.compat['tags/forum/components/TagDiscussionModal'], {
            discussion: (0,_utils_proxyModels__WEBPACK_IMPORTED_MODULE_6__["default"])(select.all())
          });
        }
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.tags-edit')), flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.all('tags').map(function (tag) {
        return flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default().component({
          onclick: function onclick() {
            select.forEachPromise(function (discussion) {
              if (!discussion.attribute('canTag')) {
                return Promise.resolve();
              }

              var tags = discussion.tags() || []; // If discussion already has this tag, skip

              if (tags.some(function (thisTag) {
                return thisTag.id() === tag.id();
              })) {
                return Promise.resolve();
              }

              tags.push(tag);
              return discussion.save({
                relationships: {
                  tags: tags
                }
              });
            }).then(function () {
              m.redraw();
            });
          }
        }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.actions.tags-add', {
          tag: tag.name()
        }));
      })]));
    }
  });
}

/***/ }),

/***/ "./src/forum/addDiscussionControls.ts":
/*!********************************************!*\
  !*** ./src/forum/addDiscussionControls.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/DiscussionListItem */ "flarum/forum/components/DiscussionListItem");
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/listItems */ "flarum/common/helpers/listItems");
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_Checkbox__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/Checkbox */ "./src/forum/components/Checkbox.ts");
/* harmony import */ var _utils_SelectState__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/SelectState */ "./src/forum/utils/SelectState.ts");











function selectAllDiscussions() {
  flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().discussions.getPages().forEach(function (page) {
    page.items.forEach(function (discussion) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select').add(discussion);
    });
  });
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'viewItems', function (items) {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('massControls')) {
      return;
    }

    var controls = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default())();
    var iconName = 'far fa-square';
    var count = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select').count();

    if (count > 0) {
      if (count === flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().discussions.getPages().reduce(function (total, page) {
        return total + page.items.length;
      }, 0)) {
        iconName = 'fas fa-check-square';
      } else {
        iconName = 'fas fa-minus-square';
      }
    }

    controls.add('all', flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default().component({
      onclick: function onclick() {
        selectAllDiscussions();
      }
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.select.all')));
    controls.add('clear', flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default().component({
      onclick: function onclick() {
        flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select').clear();
      }
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('clarkwinkelmann-mass-actions.forum.select.none'))); // We don't use Flarum's SplitDropdown because the children of the first button aren't redrawing properly

    items.add('mass-select', m('.ButtonGroup.Dropdown.Dropdown--split.dropdown', {}, [flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default().component({
      className: 'Button SplitDropdown-button MassSelectControl' + (count > 0 ? ' checked' : ''),
      onclick: function onclick() {
        if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select').count() === 0) {
          selectAllDiscussions();
        } else {
          flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select').clear();
        }
      }
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()(iconName)), m('button.Dropdown-toggle.Button.Button--icon', {
      'data-toggle': 'dropdown'
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()('fas fa-caret-down', {
      className: 'Button-caret'
    })), m('ul.Dropdown-menu.dropdown-menu', flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7___default()(controls.toArray()))]), 100);
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'view', function (vdom) {
    var _this = this;

    // Only add the checkboxes on the index page, not the drawer
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.matches((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default())) || !flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('massControls')) {
      return;
    }

    vdom.children.forEach(function (vdom) {
      if (vdom && vdom.attrs && vdom.attrs.className && vdom.attrs.className.indexOf('DiscussionListItem-content') !== -1) {
        var state = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select');
        vdom.children.unshift(m('.DiscussionListItem-select', _components_Checkbox__WEBPACK_IMPORTED_MODULE_8__["default"].component({
          state: state.contains(_this.attrs.discussion),
          onchange: function onchange() {
            state.toggle(_this.attrs.discussion);
          }
        })));
      }
    });
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'oninit', function () {
    var _this2 = this;

    this.subtree.check(function () {
      var _app$current$get;

      return (_app$current$get = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select')) == null ? void 0 : _app$current$get.contains(_this2.attrs.discussion);
    });
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'elementAttrs', function (attrs) {
    var _app$current$get2;

    if ((_app$current$get2 = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.get('mass-select')) != null && _app$current$get2.contains(this.attrs.discussion)) {
      attrs.className += ' DiscussionListItem--selected';
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oninit', function () {
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.set('mass-select', new _utils_SelectState__WEBPACK_IMPORTED_MODULE_9__["default"]('discussions'));
  });
}

/***/ }),

/***/ "./src/forum/components/Checkbox.ts":
/*!******************************************!*\
  !*** ./src/forum/components/Checkbox.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_2__);




var Checkbox = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Checkbox, _Component);

  function Checkbox() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Checkbox.prototype;

  _proto.view = function view() {
    return m('.MassSelectControl', {
      className: this.attrs.state ? 'checked' : '',
      role: 'checkbox',
      onclick: this.attrs.onchange
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_2___default()(this.attrs.state ? 'fas fa-check-square' : 'far fa-square'));
  };

  return Checkbox;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));



/***/ }),

/***/ "./src/forum/components/IconButton.ts":
/*!********************************************!*\
  !*** ./src/forum/components/IconButton.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconButton)
/* harmony export */ });
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Since every one of our buttons will need a tooltip and same class name, a re-usable component makes sense
 * Particularly because the title text needs to be injected in 2 places
 */
var IconButton = /*#__PURE__*/function () {
  function IconButton() {}

  var _proto = IconButton.prototype;

  _proto.view = function view(vnode) {
    return flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_0___default().component({
      text: vnode.attrs.title
    }, flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default().component({
      'aria-label': vnode.attrs.title,
      icon: vnode.attrs.icon,
      className: 'Button Button--icon',
      onclick: vnode.attrs.onclick,
      disabled: vnode.attrs.disabled
    }));
  };

  return IconButton;
}();



/***/ }),

/***/ "./src/forum/index.ts":
/*!****************************!*\
  !*** ./src/forum/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _patchCoreComponents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./patchCoreComponents */ "./src/forum/patchCoreComponents.ts");
/* harmony import */ var _addDiscussionControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addDiscussionControls */ "./src/forum/addDiscussionControls.ts");
/* harmony import */ var _addDiscussionActions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addDiscussionActions */ "./src/forum/addDiscussionActions.ts");




flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('mass-actions', function () {
  (0,_patchCoreComponents__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_addDiscussionControls__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_addDiscussionActions__WEBPACK_IMPORTED_MODULE_3__["default"])();
});

/***/ }),

/***/ "./src/forum/patchCoreComponents.ts":
/*!******************************************!*\
  !*** ./src/forum/patchCoreComponents.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  // Flarum's Dropdown component doesn't support disabled state out of the box
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_1___default().prototype), 'getButton', function (vnode) {
    // @ts-ignore
    vnode.attrs.disabled = this.attrs.disabled;
  });
}

/***/ }),

/***/ "./src/forum/utils/SelectState.ts":
/*!****************************************!*\
  !*** ./src/forum/utils/SelectState.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectState)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);


var SelectState = /*#__PURE__*/function () {
  function SelectState(type) {
    this.type = void 0;
    this.ids = [];
    this.type = type;
  }

  var _proto = SelectState.prototype;

  _proto.indexOf = function indexOf(model) {
    return this.ids.indexOf(model.id() || '');
  };

  _proto.contains = function contains(model) {
    return this.indexOf(model) !== -1;
  };

  _proto.toggle = function toggle(model) {
    if (!model.id()) {
      throw 'Missing ID in model';
    }

    var index = this.indexOf(model);

    if (index === -1) {
      this.ids.push(model.id());
    } else {
      this.ids.splice(index, 1);
    }
  };

  _proto.add = function add(model) {
    if (!model.id()) {
      throw 'Missing ID in model';
    }

    if (!this.contains(model)) {
      this.ids.push(model.id());
    }
  };

  _proto.clear = function clear() {
    this.ids = [];
  };

  _proto.count = function count() {
    return this.ids.length;
  };

  _proto.callbackWithModel = function callbackWithModel(callback) {
    var _this = this;

    return function (id) {
      return callback(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.getById(_this.type, id));
    };
  };

  _proto.forEach = function forEach(callback) {
    this.ids.forEach(this.callbackWithModel(callback));
  };

  _proto.forEachPromise = function forEachPromise(callback) {
    return Promise.all(this.ids.map(this.callbackWithModel(callback)));
  };

  _proto.some = function some(callback) {
    return this.ids.some(this.callbackWithModel(callback));
  };

  _proto.all = function all() {
    var _this2 = this;

    return this.ids.map(function (id) {
      return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.getById(_this2.type, id);
    });
  };

  return SelectState;
}();



/***/ }),

/***/ "./src/forum/utils/proxyModels.ts":
/*!****************************************!*\
  !*** ./src/forum/utils/proxyModels.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ proxyModels)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");

function proxyModels(models) {
  return new Proxy(models[0], {
    get: function get(target, prop, receiver) {
      if (prop === 'save') {
        return function (attributes, options) {
          if (options === void 0) {
            options = {};
          }

          return Promise.all(models.map(function (model) {
            return model.save((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, attributes), (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options));
          }));
        };
      }

      return Reflect.get(target, prop, receiver);
    }
  });
}

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Dropdown":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Dropdown']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Dropdown'];

/***/ }),

/***/ "flarum/common/components/Tooltip":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Tooltip']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Tooltip'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/helpers/listItems":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/listItems']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/listItems'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/ItemList'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/DiscussionListItem":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionListItem']" ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionListItem'];

/***/ }),

/***/ "flarum/forum/components/IndexPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/IndexPage']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/IndexPage'];

/***/ }),

/***/ "flarum/forum/utils/DiscussionControls":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/DiscussionControls']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/utils/DiscussionControls'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.ts");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map