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
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const db_1 = require("./_mocks/db");
const redis_1 = require("./_mocks/redis");
/* Redis client created and ready to sue */
const redisClient = (0, redis_1.createClient)();
const app = (0, express_1.default)();
const port = 3010;
const db = new db_1.PostgreSQL();
let connection = false;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection)
            return;
        yield db.connect();
        connection = true;
    });
}
app.use(express_1.default.static('static'));
app.get('/', (req, res) => {
    res.sendFile((0, path_1.resolve)(__dirname, '../../pages/index.html'));
});
app.get('/api/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        let cacheValue = 'HIT';
        let cachedValueFromReids = redisClient.get(req.query.value);
        res.status(200).header({ 'x-cache': cacheValue }).json({ data: cachedValueFromReids });
        if (!cachedValue) {
            const result = yield db.query("SELECT * FROM users WHERE first_name LIKE 'j%'", [req.query.value]);
            redisClient.set(req.query.value, JSON.stringify(result.rows), (data) => {
                console.log('redis ', data);
                cachedValueFromReids = data;
                cacheValue = 'MISS';
            });
        }
        res.status(200).header({ 'x-cache': cacheValue }).json({ data: cachedValueFromReids });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error!' });
    }
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
