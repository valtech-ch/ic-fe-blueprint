webpackHotUpdate("main",{

/***/ "./node_modules/svg-baker-runtime/browser-symbol.js":
false,

/***/ "./node_modules/svg-sprite-loader/runtime/browser-sprite.build.js":
false,

/***/ "./node_modules/vue-loader/lib/index.js?!./src/components/App.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./src/components/App.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'App',\n\n  data () {\n    return {\n      logo,\n      navigation: {}\n    }\n  },\n\n  mounted () {\n    fetch('/navigation')\n      .then(res => res.json())\n      .then(res => {\n        this.navigation = res\n      })\n  },\n\n  computed: {\n    selected () {\n      if (Array.isArray(this.navigation)) {\n        return this.navigation.filter(i => i.title === this.$route.params.type).pop()\n      } else {\n        return {}\n      }\n    }\n  }\n});\n\n\n//# sourceURL=webpack:///./src/components/App.vue?./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/assets/logo.svg":
false

})