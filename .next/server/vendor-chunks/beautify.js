"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/beautify";
exports.ids = ["vendor-chunks/beautify"];
exports.modules = {

/***/ "(ssr)/./node_modules/beautify/index.js":
/*!****************************************!*\
  !*** ./node_modules/beautify/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst jsBeautify = (__webpack_require__(/*! js-beautify */ \"(ssr)/./node_modules/js-beautify/js/index.js\").js_beautify);\nconst cssbeautify = __webpack_require__(/*! cssbeautify */ \"(ssr)/./node_modules/cssbeautify/cssbeautify.js\");\nconst html = (__webpack_require__(/*! html */ \"(ssr)/./node_modules/html/lib/html.js\").prettyPrint);\n\nlet files = [];\n\nlet clean = data => {\n    if (~['\"', \"'\"].indexOf(data[0]) &&\n        ~['\"', \"'\"].indexOf(data[data.length - 1]) &&\n        data[0] === data[data.length - 1]\n    ) {\n        return data.substring(1, data.length - 1);\n    }\n\n    return data;\n};\n\nlet beautify = (data, o) => {\n    if (!data || !data.length) return '';\n\n    data = clean(data.trim());\n\n    switch (o.format) {\n        case 'css':\n            return cssbeautify(data, {\n                indent: '    ',\n                autosemicolon: true\n            });\n        case 'json':\n        case 'js':\n            return jsBeautify(data, {\n                indent_size: 4\n            });\n        case 'html':\n        case 'xml':\n            return html(data);\n    }\n};\n\nmodule.exports = beautify;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYmVhdXRpZnkvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsbUJBQW1CLG9HQUFrQztBQUNyRCxvQkFBb0IsbUJBQU8sQ0FBQyxvRUFBYTtBQUN6QyxhQUFhLHNGQUEyQjs7QUFFeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxMdWggS3JhbmtcXERlc2t0b3BcXGN5Y2FwXFxub2RlX21vZHVsZXNcXGJlYXV0aWZ5XFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGpzQmVhdXRpZnkgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpLmpzX2JlYXV0aWZ5O1xuY29uc3QgY3NzYmVhdXRpZnkgPSByZXF1aXJlKCdjc3NiZWF1dGlmeScpO1xuY29uc3QgaHRtbCA9IHJlcXVpcmUoJ2h0bWwnKS5wcmV0dHlQcmludDtcblxubGV0IGZpbGVzID0gW107XG5cbmxldCBjbGVhbiA9IGRhdGEgPT4ge1xuICAgIGlmICh+WydcIicsIFwiJ1wiXS5pbmRleE9mKGRhdGFbMF0pICYmXG4gICAgICAgIH5bJ1wiJywgXCInXCJdLmluZGV4T2YoZGF0YVtkYXRhLmxlbmd0aCAtIDFdKSAmJlxuICAgICAgICBkYXRhWzBdID09PSBkYXRhW2RhdGEubGVuZ3RoIC0gMV1cbiAgICApIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuc3Vic3RyaW5nKDEsIGRhdGEubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59O1xuXG5sZXQgYmVhdXRpZnkgPSAoZGF0YSwgbykgPT4ge1xuICAgIGlmICghZGF0YSB8fCAhZGF0YS5sZW5ndGgpIHJldHVybiAnJztcblxuICAgIGRhdGEgPSBjbGVhbihkYXRhLnRyaW0oKSk7XG5cbiAgICBzd2l0Y2ggKG8uZm9ybWF0KSB7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgICAgICByZXR1cm4gY3NzYmVhdXRpZnkoZGF0YSwge1xuICAgICAgICAgICAgICAgIGluZGVudDogJyAgICAnLFxuICAgICAgICAgICAgICAgIGF1dG9zZW1pY29sb246IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgICAgcmV0dXJuIGpzQmVhdXRpZnkoZGF0YSwge1xuICAgICAgICAgICAgICAgIGluZGVudF9zaXplOiA0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgICByZXR1cm4gaHRtbChkYXRhKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlYXV0aWZ5OyJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/beautify/index.js\n");

/***/ })

};
;