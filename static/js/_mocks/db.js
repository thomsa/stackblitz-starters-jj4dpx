"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQL = void 0;
const data_json_1 = __importDefault(require("./data.json"));
const dBReadTime = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(true);
    }, Math.floor(Math.random() * (80 - 20 + 1)) + 20);
});
class PostgreSQL {
    constructor() {
        this.data = [];
        this.dbCalls = 0;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = data_json_1.default;
            this.dbCalls = 0;
            console.log('Connected to database');
        });
    }
    query(queryString, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dBReadTime();
            this.dbCalls += 1;
            console.log('DB calls aggregated: ', this.dbCalls);
            const match = queryString.match(/SELECT \* FROM users WHERE first_name LIKE '(.+)'/);
            if (match && params && params[0]) {
                const firstLetter = params[0];
                const filteredData = this.data.filter((user) => user.first_name.startsWith(firstLetter));
                return { rows: filteredData };
            }
            return { rows: [] };
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Disconnected from mock database');
        });
    }
}
exports.PostgreSQL = PostgreSQL;
