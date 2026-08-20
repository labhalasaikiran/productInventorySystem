const express = require("express");

const stockController = require("../controllers/stockController");

const router = express.Router();

router.post("/:id/stock-in", stockController.stockIn);

router.post("/:id/stock-out", stockController.stockOut);

router.get("/:id/transactions", stockController.getTransactions);

module.exports = router;