'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var puppeteer_1 = require("puppeteer");
var prompts_1 = require("prompts");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var waitForAndType_js_1 = require("./functions/waitForAndType.js");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, response, getChoosenBook, choosenBook;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // START
                console.log('STARTING...');
                return [4 /*yield*/, puppeteer_1["default"].launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto('https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe&suite=pearl')];
            case 3:
                _a.sent();
                console.log('LOGGING IN TO GOTLIB...');
                return [4 /*yield*/, waitForAndType_js_1.waitForAndType(page, 'input#code.loginField', process.env.GOTLIB_USERNAME)];
            case 4:
                _a.sent();
                return [4 /*yield*/, waitForAndType_js_1.waitForAndType(page, 'input#pin.loginField', process.env.GOTLIB_PIN)];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.waitForNavigation()];
            case 7:
                _a.sent();
                return [4 /*yield*/, prompts_1["default"]({
                        type: 'text',
                        name: 'name',
                        message: 'What book do you want to reserve?'
                    })];
            case 8:
                response = _a.sent();
                return [4 /*yield*/, waitForAndType_js_1.waitForAndType(page, 'input#searchString', response.name)];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 10:
                _a.sent();
                console.log('SEARCHING FOR BOOK...');
                return [4 /*yield*/, page.waitForNavigation()];
            case 11:
                _a.sent();
                getChoosenBook = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var isSure, _loop_1, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                isSure = false;
                                _loop_1 = function () {
                                    var titles, auhtors, years, availabilityMessages, books, book, value;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, page.$$eval('.dpBibTitle', function (elements) {
                                                    return elements.map(function (element) { return element.children[0].textContent.trim(); });
                                                })];
                                            case 1:
                                                titles = _a.sent();
                                                return [4 /*yield*/, page.$$eval('.dpBibAuthor', function (auhtor) {
                                                        return auhtor.map(function (auhtor) { return auhtor.textContent.trim(); });
                                                    })];
                                            case 2:
                                                auhtors = _a.sent();
                                                return [4 /*yield*/, page.$$eval('.itemMediaYear', function (year) {
                                                        return year.map(function (year) { return year.textContent.trim(); });
                                                    })];
                                            case 3:
                                                years = _a.sent();
                                                return [4 /*yield*/, page.$$eval('.availabilityMessage', function (message) { return message.map(function (message) { return message.textContent.trim(); }); })];
                                            case 4:
                                                availabilityMessages = _a.sent();
                                                books = titles.map(function (title, i) {
                                                    return {
                                                        title: title,
                                                        description: "  " + auhtors[i] + " " + years[i] + "\n        " + availabilityMessages[i],
                                                        id: i
                                                    };
                                                });
                                                return [4 /*yield*/, prompts_1["default"]({
                                                        type: 'select',
                                                        name: 'book',
                                                        message: 'Pick a book',
                                                        choices: books
                                                    })];
                                            case 5:
                                                book = (_a.sent()).book;
                                                return [4 /*yield*/, prompts_1["default"]({
                                                        type: 'toggle',
                                                        name: 'value',
                                                        message: 'Are you sure you want to reserve this book?',
                                                        initial: true,
                                                        active: 'yes',
                                                        inactive: 'no'
                                                    })];
                                            case 6:
                                                value = (_a.sent()).value;
                                                if (value) {
                                                    isSure = true;
                                                    return [2 /*return*/, { value: books.find(function (item) { return item.id === book; }) }];
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _a.label = 1;
                            case 1:
                                if (!!isSure) return [3 /*break*/, 3];
                                return [5 /*yield**/, _loop_1()];
                            case 2:
                                state_1 = _a.sent();
                                if (typeof state_1 === "object")
                                    return [2 /*return*/, state_1.value];
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, getChoosenBook()];
            case 12:
                choosenBook = _a.sent();
                console.log("You have reserved " + choosenBook.title);
                // CLOSE BROWSER
                return [4 /*yield*/, browser.close()];
            case 13:
                // CLOSE BROWSER
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
