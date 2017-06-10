"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const db = require("./database");
const JWT = require("jsonwebtoken");
const api = express();
const JWTSecret = 'FAKE_SECRET_KEY';
api.post('/auth/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.header('Content-Type: application/json');
    const { usr, psw } = req.body;
    try {
        const { user_id } = yield db.logInUser(usr, psw);
        const jwt = JWT.sign({ usr: user_id }, JWTSecret, { expiresIn: '30 days' });
        res.send(JSON.stringify({ status: 'Success', data: jwt }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/:user_id/con/:con_code/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.header('Content-Type: application/json');
    try {
        const { user_id, con_code } = req.params;
        const data = yield db.getConInfo(user_id, con_code);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/user/:user_id/con/:con_code/sale/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.header('Content-Type: application/json');
    try {
        const { user_id, con_code } = req.params;
        const { records } = req.body;
        yield db.writeRecords(user_id, con_code, records);
        res.send(JSON.stringify({ status: 'Success' }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/:user_id/products/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.header('Content-Type: application/json');
    try {
        const { user_id } = req.params;
        const data = yield db.getUserProducts(user_id);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/:user_id/prices/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.header('Content-Type: application/json');
    try {
        const { user_id } = req.params;
        const data = yield db.getUserPrices(user_id);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
exports.default = api;
