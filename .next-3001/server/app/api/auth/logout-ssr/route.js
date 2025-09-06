"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/logout-ssr/route";
exports.ids = ["app/api/auth/logout-ssr/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogout-ssr%2Froute&page=%2Fapi%2Fauth%2Flogout-ssr%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout-ssr%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogout-ssr%2Froute&page=%2Fapi%2Fauth%2Flogout-ssr%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout-ssr%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_enessirin_Desktop_Rev_Code_app_api_auth_logout_ssr_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/logout-ssr/route.ts */ \"(rsc)/./app/api/auth/logout-ssr/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/logout-ssr/route\",\n        pathname: \"/api/auth/logout-ssr\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/logout-ssr/route\"\n    },\n    resolvedPagePath: \"/Users/enessirin/Desktop/Rev Code/app/api/auth/logout-ssr/route.ts\",\n    nextConfigOutput,\n    userland: _Users_enessirin_Desktop_Rev_Code_app_api_auth_logout_ssr_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/logout-ssr/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9nb3V0LXNzciUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYXV0aCUyRmxvZ291dC1zc3IlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhdXRoJTJGbG9nb3V0LXNzciUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVuZXNzaXJpbiUyRkRlc2t0b3AlMkZSZXYlMjBDb2RlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmVuZXNzaXJpbiUyRkRlc2t0b3AlMkZSZXYlMjBDb2RlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNrQjtBQUMvRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL25ldmEteWFsaS8/MDM4NCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvZW5lc3NpcmluL0Rlc2t0b3AvUmV2IENvZGUvYXBwL2FwaS9hdXRoL2xvZ291dC1zc3Ivcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbG9nb3V0LXNzci9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbG9nb3V0LXNzclwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9sb2dvdXQtc3NyL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2VuZXNzaXJpbi9EZXNrdG9wL1JldiBDb2RlL2FwcC9hcGkvYXV0aC9sb2dvdXQtc3NyL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL2xvZ291dC1zc3Ivcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogout-ssr%2Froute&page=%2Fapi%2Fauth%2Flogout-ssr%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout-ssr%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/logout-ssr/route.ts":
/*!******************************************!*\
  !*** ./app/api/auth/logout-ssr/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _supabase_ssr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/ssr */ \"(rsc)/./node_modules/@supabase/ssr/dist/module/index.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\nasync function POST() {\n    try {\n        const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)();\n        const supabase = (0,_supabase_ssr__WEBPACK_IMPORTED_MODULE_1__.createServerClient)(\"https://wunmkbijqnzsmwfjjymc.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bm1rYmlqcW56c213ZmpqeW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MDIxMzUsImV4cCI6MjA3MjQ3ODEzNX0.Urgfq_i02Sw_X9R908QMdDp9sm2jIybn03YQ6qlABSM\", {\n            cookies: {\n                get (name) {\n                    return cookieStore.get(name)?.value;\n                },\n                set (name, value, options) {\n                    try {\n                        cookieStore.set({\n                            name,\n                            value,\n                            ...options\n                        });\n                    } catch (error) {\n                        console.warn(\"Could not set cookie:\", name);\n                    }\n                },\n                remove (name, options) {\n                    try {\n                        cookieStore.set({\n                            name,\n                            value: \"\",\n                            ...options\n                        });\n                    } catch (error) {\n                        console.warn(\"Could not remove cookie:\", name);\n                    }\n                }\n            }\n        });\n        await supabase.auth.signOut();\n        const response = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true\n        });\n        // Mirror sb-* cookies to response to ensure clearing on client\n        const all = cookieStore.getAll();\n        all.forEach((cookie)=>{\n            if (cookie.name.startsWith(\"sb-\")) {\n                response.cookies.set(cookie.name, cookie.value, {\n                    httpOnly: true,\n                    secure: \"development\" === \"production\",\n                    sameSite: \"lax\",\n                    maxAge: 0\n                });\n            }\n        });\n        return response;\n    } catch (error) {\n        console.error(\"Server logout error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9nb3V0LXNzci9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTBDO0FBQ1E7QUFDWjtBQUUvQixlQUFlRztJQUNwQixJQUFJO1FBQ0YsTUFBTUMsY0FBY0YscURBQU9BO1FBQzNCLE1BQU1HLFdBQVdKLGlFQUFrQkEsQ0FDakNLLDBDQUFvQyxFQUNwQ0Esa05BQXlDLEVBQ3pDO1lBQ0VKLFNBQVM7Z0JBQ1BRLEtBQUlDLElBQVk7b0JBQ2QsT0FBT1AsWUFBWU0sR0FBRyxDQUFDQyxPQUFPQztnQkFDaEM7Z0JBQ0FDLEtBQUlGLElBQVksRUFBRUMsS0FBYSxFQUFFRSxPQUFZO29CQUMzQyxJQUFJO3dCQUNGVixZQUFZUyxHQUFHLENBQUM7NEJBQUVGOzRCQUFNQzs0QkFBTyxHQUFHRSxPQUFPO3dCQUFDO29CQUM1QyxFQUFFLE9BQU9DLE9BQU87d0JBQ2RDLFFBQVFDLElBQUksQ0FBQyx5QkFBeUJOO29CQUN4QztnQkFDRjtnQkFDQU8sUUFBT1AsSUFBWSxFQUFFRyxPQUFZO29CQUMvQixJQUFJO3dCQUNGVixZQUFZUyxHQUFHLENBQUM7NEJBQUVGOzRCQUFNQyxPQUFPOzRCQUFJLEdBQUdFLE9BQU87d0JBQUM7b0JBQ2hELEVBQUUsT0FBT0MsT0FBTzt3QkFDZEMsUUFBUUMsSUFBSSxDQUFDLDRCQUE0Qk47b0JBQzNDO2dCQUNGO1lBQ0Y7UUFDRjtRQUdGLE1BQU1OLFNBQVNjLElBQUksQ0FBQ0MsT0FBTztRQUUzQixNQUFNQyxXQUFXckIscURBQVlBLENBQUNzQixJQUFJLENBQUM7WUFBRUMsSUFBSTtRQUFLO1FBQzlDLCtEQUErRDtRQUMvRCxNQUFNQyxNQUFNcEIsWUFBWXFCLE1BQU07UUFDOUJELElBQUlFLE9BQU8sQ0FBQyxDQUFDQztZQUNYLElBQUlBLE9BQU9oQixJQUFJLENBQUNpQixVQUFVLENBQUMsUUFBUTtnQkFDakNQLFNBQVNuQixPQUFPLENBQUNXLEdBQUcsQ0FBQ2MsT0FBT2hCLElBQUksRUFBRWdCLE9BQU9mLEtBQUssRUFBRTtvQkFDOUNpQixVQUFVO29CQUNWQyxRQUFReEIsa0JBQXlCO29CQUNqQ3lCLFVBQVU7b0JBQ1ZDLFFBQVE7Z0JBQ1Y7WUFDRjtRQUNGO1FBRUEsT0FBT1g7SUFDVCxFQUFFLE9BQU9OLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLHdCQUF3QkE7UUFDdEMsT0FBT2YscURBQVlBLENBQUNzQixJQUFJLENBQUM7WUFBRVAsT0FBTztRQUF3QixHQUFHO1lBQUVrQixRQUFRO1FBQUk7SUFDN0U7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL25ldmEteWFsaS8uL2FwcC9hcGkvYXV0aC9sb2dvdXQtc3NyL3JvdXRlLnRzPzE0MDAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXJDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3NyJ1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycydcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29va2llU3RvcmUgPSBjb29raWVzKClcbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZVNlcnZlckNsaWVudChcbiAgICAgIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCEsXG4gICAgICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSEsXG4gICAgICB7XG4gICAgICAgIGNvb2tpZXM6IHtcbiAgICAgICAgICBnZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gY29va2llU3RvcmUuZ2V0KG5hbWUpPy52YWx1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgb3B0aW9uczogYW55KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb29raWVTdG9yZS5zZXQoeyBuYW1lLCB2YWx1ZSwgLi4ub3B0aW9ucyB9KVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb3VsZCBub3Qgc2V0IGNvb2tpZTonLCBuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVtb3ZlKG5hbWU6IHN0cmluZywgb3B0aW9uczogYW55KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb29raWVTdG9yZS5zZXQoeyBuYW1lLCB2YWx1ZTogJycsIC4uLm9wdGlvbnMgfSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ291bGQgbm90IHJlbW92ZSBjb29raWU6JywgbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIClcblxuICAgIGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpXG5cbiAgICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5qc29uKHsgb2s6IHRydWUgfSlcbiAgICAvLyBNaXJyb3Igc2ItKiBjb29raWVzIHRvIHJlc3BvbnNlIHRvIGVuc3VyZSBjbGVhcmluZyBvbiBjbGllbnRcbiAgICBjb25zdCBhbGwgPSBjb29raWVTdG9yZS5nZXRBbGwoKVxuICAgIGFsbC5mb3JFYWNoKChjb29raWUpID0+IHtcbiAgICAgIGlmIChjb29raWUubmFtZS5zdGFydHNXaXRoKCdzYi0nKSkge1xuICAgICAgICByZXNwb25zZS5jb29raWVzLnNldChjb29raWUubmFtZSwgY29va2llLnZhbHVlLCB7XG4gICAgICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICAgIHNhbWVTaXRlOiAnbGF4JyxcbiAgICAgICAgICBtYXhBZ2U6IDAsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiByZXNwb25zZVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlcnZlciBsb2dvdXQgZXJyb3I6JywgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfVxufVxuXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY3JlYXRlU2VydmVyQ2xpZW50IiwiY29va2llcyIsIlBPU1QiLCJjb29raWVTdG9yZSIsInN1cGFiYXNlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiZ2V0IiwibmFtZSIsInZhbHVlIiwic2V0Iiwib3B0aW9ucyIsImVycm9yIiwiY29uc29sZSIsIndhcm4iLCJyZW1vdmUiLCJhdXRoIiwic2lnbk91dCIsInJlc3BvbnNlIiwianNvbiIsIm9rIiwiYWxsIiwiZ2V0QWxsIiwiZm9yRWFjaCIsImNvb2tpZSIsInN0YXJ0c1dpdGgiLCJodHRwT25seSIsInNlY3VyZSIsInNhbWVTaXRlIiwibWF4QWdlIiwic3RhdHVzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/logout-ssr/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@supabase","vendor-chunks/next","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogout-ssr%2Froute&page=%2Fapi%2Fauth%2Flogout-ssr%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout-ssr%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();