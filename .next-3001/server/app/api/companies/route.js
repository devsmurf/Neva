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
exports.id = "app/api/companies/route";
exports.ids = ["app/api/companies/route"];
exports.modules = {

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcompanies%2Froute&page=%2Fapi%2Fcompanies%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcompanies%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcompanies%2Froute&page=%2Fapi%2Fcompanies%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcompanies%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_enessirin_Desktop_Rev_Code_app_api_companies_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/companies/route.ts */ \"(rsc)/./app/api/companies/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/companies/route\",\n        pathname: \"/api/companies\",\n        filename: \"route\",\n        bundlePath: \"app/api/companies/route\"\n    },\n    resolvedPagePath: \"/Users/enessirin/Desktop/Rev Code/app/api/companies/route.ts\",\n    nextConfigOutput,\n    userland: _Users_enessirin_Desktop_Rev_Code_app_api_companies_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/companies/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjb21wYW5pZXMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmNvbXBhbmllcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmNvbXBhbmllcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVuZXNzaXJpbiUyRkRlc2t0b3AlMkZSZXYlMjBDb2RlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmVuZXNzaXJpbiUyRkRlc2t0b3AlMkZSZXYlMjBDb2RlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNZO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV2YS15YWxpLz9hNmFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lbmVzc2lyaW4vRGVza3RvcC9SZXYgQ29kZS9hcHAvYXBpL2NvbXBhbmllcy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY29tcGFuaWVzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvY29tcGFuaWVzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jb21wYW5pZXMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZW5lc3NpcmluL0Rlc2t0b3AvUmV2IENvZGUvYXBwL2FwaS9jb21wYW5pZXMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2NvbXBhbmllcy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcompanies%2Froute&page=%2Fapi%2Fcompanies%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcompanies%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/companies/route.ts":
/*!************************************!*\
  !*** ./app/api/companies/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabaseAdmin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabaseAdmin */ \"(rsc)/./app/lib/supabaseAdmin.ts\");\n\n\nasync function GET() {\n    try {\n        // For now, allow public access to companies list\n        // TODO: Add proper auth when needed\n        // Get companies with login email status\n        const { data: companies, error } = await _lib_supabaseAdmin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"companies\").select(`\n        *,\n        login_emails:company_login_emails(email, is_active)\n      `).order(\"name\");\n        if (error) {\n            console.error(\"Companies fetch error:\", error);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: error.message\n            }, {\n                status: 400\n            });\n        }\n        // Add login status\n        const companiesWithLoginStatus = companies?.map((company)=>({\n                ...company,\n                has_login: company.login_emails && company.login_emails.length > 0,\n                login_email: company.login_emails?.[0]?.email || null\n            })) || [];\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(companiesWithLoginStatus);\n    } catch (error) {\n        console.error(\"Companies API error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NvbXBhbmllcy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEM7QUFDUztBQUU1QyxlQUFlRTtJQUNwQixJQUFJO1FBQ0YsaURBQWlEO1FBQ2pELG9DQUFvQztRQUVwQyx3Q0FBd0M7UUFDeEMsTUFBTSxFQUFFQyxNQUFNQyxTQUFTLEVBQUVDLEtBQUssRUFBRSxHQUFHLE1BQU1KLDZEQUFhQSxDQUNuREssSUFBSSxDQUFDLGFBQ0xDLE1BQU0sQ0FBQyxDQUFDOzs7TUFHVCxDQUFDLEVBQ0FDLEtBQUssQ0FBQztRQUVULElBQUlILE9BQU87WUFDVEksUUFBUUosS0FBSyxDQUFDLDBCQUEwQkE7WUFDeEMsT0FBT0wscURBQVlBLENBQUNVLElBQUksQ0FBQztnQkFBRUwsT0FBT0EsTUFBTU0sT0FBTztZQUFDLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNuRTtRQUVBLG1CQUFtQjtRQUNuQixNQUFNQywyQkFBMkJULFdBQVdVLElBQUksQ0FBQ0MsVUFBa0I7Z0JBQ2pFLEdBQUdBLE9BQU87Z0JBQ1ZDLFdBQVdELFFBQVFFLFlBQVksSUFBSUYsUUFBUUUsWUFBWSxDQUFDQyxNQUFNLEdBQUc7Z0JBQ2pFQyxhQUFhSixRQUFRRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUVHLFNBQVM7WUFDbkQsT0FBTyxFQUFFO1FBRVQsT0FBT3BCLHFEQUFZQSxDQUFDVSxJQUFJLENBQUNHO0lBQzNCLEVBQUUsT0FBT1IsT0FBTztRQUNkSSxRQUFRSixLQUFLLENBQUMsd0JBQXdCQTtRQUN0QyxPQUFPTCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtZQUFFTCxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVPLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV2YS15YWxpLy4vYXBwL2FwaS9jb21wYW5pZXMvcm91dGUudHM/MzI3MCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IHN1cGFiYXNlQWRtaW4gfSBmcm9tICdAL2xpYi9zdXBhYmFzZUFkbWluJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICB0cnkge1xuICAgIC8vIEZvciBub3csIGFsbG93IHB1YmxpYyBhY2Nlc3MgdG8gY29tcGFuaWVzIGxpc3RcbiAgICAvLyBUT0RPOiBBZGQgcHJvcGVyIGF1dGggd2hlbiBuZWVkZWRcblxuICAgIC8vIEdldCBjb21wYW5pZXMgd2l0aCBsb2dpbiBlbWFpbCBzdGF0dXNcbiAgICBjb25zdCB7IGRhdGE6IGNvbXBhbmllcywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdjb21wYW5pZXMnKVxuICAgICAgLnNlbGVjdChgXG4gICAgICAgICosXG4gICAgICAgIGxvZ2luX2VtYWlsczpjb21wYW55X2xvZ2luX2VtYWlscyhlbWFpbCwgaXNfYWN0aXZlKVxuICAgICAgYClcbiAgICAgIC5vcmRlcignbmFtZScpXG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbXBhbmllcyBmZXRjaCBlcnJvcjonLCBlcnJvcilcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBlcnJvci5tZXNzYWdlIH0sIHsgc3RhdHVzOiA0MDAgfSlcbiAgICB9XG5cbiAgICAvLyBBZGQgbG9naW4gc3RhdHVzXG4gICAgY29uc3QgY29tcGFuaWVzV2l0aExvZ2luU3RhdHVzID0gY29tcGFuaWVzPy5tYXAoKGNvbXBhbnk6IGFueSkgPT4gKHtcbiAgICAgIC4uLmNvbXBhbnksXG4gICAgICBoYXNfbG9naW46IGNvbXBhbnkubG9naW5fZW1haWxzICYmIGNvbXBhbnkubG9naW5fZW1haWxzLmxlbmd0aCA+IDAsXG4gICAgICBsb2dpbl9lbWFpbDogY29tcGFueS5sb2dpbl9lbWFpbHM/LlswXT8uZW1haWwgfHwgbnVsbFxuICAgIH0pKSB8fCBbXVxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGNvbXBhbmllc1dpdGhMb2dpblN0YXR1cylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdDb21wYW5pZXMgQVBJIGVycm9yOicsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzdXBhYmFzZUFkbWluIiwiR0VUIiwiZGF0YSIsImNvbXBhbmllcyIsImVycm9yIiwiZnJvbSIsInNlbGVjdCIsIm9yZGVyIiwiY29uc29sZSIsImpzb24iLCJtZXNzYWdlIiwic3RhdHVzIiwiY29tcGFuaWVzV2l0aExvZ2luU3RhdHVzIiwibWFwIiwiY29tcGFueSIsImhhc19sb2dpbiIsImxvZ2luX2VtYWlscyIsImxlbmd0aCIsImxvZ2luX2VtYWlsIiwiZW1haWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/companies/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/lib/supabaseAdmin.ts":
/*!**********************************!*\
  !*** ./app/lib/supabaseAdmin.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://wunmkbijqnzsmwfjjymc.supabase.co\" || 0;\nconst supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || \"\";\n// Server-only admin client\nlet _supabaseAdmin = null;\nfunction createSupabaseAdminClient() {\n    if (_supabaseAdmin) return _supabaseAdmin;\n    if (!supabaseUrl || !supabaseServiceRole) {\n        throw new Error(\"Supabase admin configuration missing. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables.\");\n    }\n    _supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRole, {\n        auth: {\n            autoRefreshToken: false,\n            persistSession: false\n        }\n    });\n    return _supabaseAdmin;\n}\n// Only export admin client on server-side\nconst supabaseAdmin = createSupabaseAdminClient();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL3N1cGFiYXNlQWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DLElBQUk7QUFDNUQsTUFBTUcsc0JBQXNCSCxRQUFRQyxHQUFHLENBQUNHLHFCQUFxQixJQUFJO0FBRWpFLDJCQUEyQjtBQUMzQixJQUFJQyxpQkFBc0I7QUFFMUIsU0FBU0M7SUFDUCxJQUFJRCxnQkFBZ0IsT0FBT0E7SUFFM0IsSUFBSSxDQUFDTixlQUFlLENBQUNJLHFCQUFxQjtRQUN4QyxNQUFNLElBQUlJLE1BQU07SUFDbEI7SUFFQUYsaUJBQWlCUCxtRUFBWUEsQ0FBQ0MsYUFBYUkscUJBQXFCO1FBQzlESyxNQUFNO1lBQ0pDLGtCQUFrQjtZQUNsQkMsZ0JBQWdCO1FBQ2xCO0lBQ0Y7SUFFQSxPQUFPTDtBQUNUO0FBRUEsMENBQTBDO0FBQ25DLE1BQU1NLGdCQUFnQkwsNEJBQTJCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV2YS15YWxpLy4vYXBwL2xpYi9zdXBhYmFzZUFkbWluLnRzP2NlMjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ1xuXG5jb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCB8fCAnJ1xuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRSB8fCAnJ1xuXG4vLyBTZXJ2ZXItb25seSBhZG1pbiBjbGllbnRcbmxldCBfc3VwYWJhc2VBZG1pbjogYW55ID0gbnVsbFxuXG5mdW5jdGlvbiBjcmVhdGVTdXBhYmFzZUFkbWluQ2xpZW50KCkge1xuICBpZiAoX3N1cGFiYXNlQWRtaW4pIHJldHVybiBfc3VwYWJhc2VBZG1pblxuICBcbiAgaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VTZXJ2aWNlUm9sZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU3VwYWJhc2UgYWRtaW4gY29uZmlndXJhdGlvbiBtaXNzaW5nLiBDaGVjayBORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwgYW5kIFNVUEFCQVNFX1NFUlZJQ0VfUk9MRSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuJylcbiAgfVxuICBcbiAgX3N1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlU2VydmljZVJvbGUsIHtcbiAgICBhdXRoOiB7XG4gICAgICBhdXRvUmVmcmVzaFRva2VuOiBmYWxzZSxcbiAgICAgIHBlcnNpc3RTZXNzaW9uOiBmYWxzZVxuICAgIH1cbiAgfSlcbiAgXG4gIHJldHVybiBfc3VwYWJhc2VBZG1pblxufVxuXG4vLyBPbmx5IGV4cG9ydCBhZG1pbiBjbGllbnQgb24gc2VydmVyLXNpZGVcbmV4cG9ydCBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlU3VwYWJhc2VBZG1pbkNsaWVudCgpXG5cblxuXG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VTZXJ2aWNlUm9sZSIsIlNVUEFCQVNFX1NFUlZJQ0VfUk9MRSIsIl9zdXBhYmFzZUFkbWluIiwiY3JlYXRlU3VwYWJhc2VBZG1pbkNsaWVudCIsIkVycm9yIiwiYXV0aCIsImF1dG9SZWZyZXNoVG9rZW4iLCJwZXJzaXN0U2Vzc2lvbiIsInN1cGFiYXNlQWRtaW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/supabaseAdmin.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@supabase","vendor-chunks/next","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcompanies%2Froute&page=%2Fapi%2Fcompanies%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcompanies%2Froute.ts&appDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fenessirin%2FDesktop%2FRev%20Code&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();