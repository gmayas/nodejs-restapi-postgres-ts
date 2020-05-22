"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = require('body-parser');
const cors = require('cors');
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const app = express_1.default();
// settings
app.set('port', 3000 || process.env.PORT);
// Middlewares
app.use(morgan_1.default('dev'));
/*app.use(express.urlencoded({ extended: true }))
app.use(express.json());*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
exports.default = app;
