"use strict";

require("essentials");
require("dotenv").config();
require("log-node")();

if (!process.env.AWS_REGION) process.env.AWS_REGION = "us-east-1";
