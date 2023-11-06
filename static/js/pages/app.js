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
const input = document.getElementById('search-input');
const list = document.getElementById('list');
const xCache = document.getElementById('xcache');
input === null || input === void 0 ? void 0 : input.addEventListener('input', (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (e.target instanceof HTMLInputElement) {
        const response = yield fetch(`/api/search?value=${e.target.value}`, {
            method: 'GET',
        });
        const { data } = yield response.json();
        if (xCache) {
            xCache.innerText = `x-cache: ${response.headers.get('x-cache')}`;
        }
        const liElems = data
            .map((el) => `<li>${el.first_name} ${el.last_name}</li>`)
            .join('');
        if (list) {
            list.innerHTML = liElems;
        }
    }
}));
