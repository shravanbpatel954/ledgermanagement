import {
  sequelize,
  Challan,
  ChallanItem,
  PurchaseOrder,
  PurchaseOrderItem,
  Item,
  Department,
  User,
  BillChallan     // <-- ADDED (required for unlinked challans)
} from '../models/index.js';

import { Op } from 'sequelize';


// ---------------------------
// 1. CREATE CHALLAN
// ---------------------------
export const createChallan = async (req, res) => {
  const t = await sequelize.transaction();
  let challan_id;

  try {
    const { challan_no, po_id, delivery_date, items } = req.body;
    const user_id = req.user.id;

    if (!challan_no || !po_id || !delivery_date || !items) {
      throw new Error('Missing required fields');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items must be a non-empty array');
    }

    const newChallan = await Challan.create(
      { challan_no, po_id, user_id, delivery_date },
      { transaction: t }
    );
    challan_id = newChallan.challan_id;

    for (const item of items) {
      if (!item.item_id || !item.quantity_received) {
        throw new Error('Each item must have an item_id and quantity_received');
      }

      await ChallanItem.create(
        {
          challan_id: challan_id,
          item_id: item.item_id,
          quantity_received: item.quantity_received,
        },
        { transaction: t }
      );

      const poItem = await PurchaseOrderItem.findOne({
        where: { po_id: po_id, item_id: item.item_id },
        transaction: t,
      });

      if (!poItem) {
        throw new Error(`Item ID ${item.item_id} not found on PO ID ${po_id}`);
      }

      const newReceivedQty = poItem.quantity_received + item.quantity_received;
      if (newReceivedQty > poItem.quantity_ordered) {
        throw new Error(`Cannot receive more than ordered for Item ID ${item.item_id}`);
      }

      poItem.quantity_received = newReceivedQty;
      await poItem.save({ transaction: t });

      const masterItem = await Item.findByPk(item.item_id, { transaction: t });
      masterItem.current_stock += item.quantity_received;
      await masterItem.save({ transaction: t });
    }

    const allPoItems = await PurchaseOrderItem.findAll({
      where: { po_id: po_id },
      transaction: t,
    });

    const isPoComplete = allPoItems.every(
      (pi) => pi.quantity_received >= pi.quantity_ordered
    );

    if (isPoComplete) {
      const po = await PurchaseOrder.findByPk(po_id, { transaction: t });
      po.status = 'Completed';
      await po.save({ transaction: t });
    }

    await t.commit();

    res.status(201).json({
      message: 'Challan created and stock updated successfully',
      challan_id: challan_id
    });

  } catch (error) {
    if (t.finished !== 'commit' && t.finished !== 'rollback') {
      await t.rollback();
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. Get All Challans ---
// (We should add this function if it's missing)
export const getAllChallans = async (req, res) => {
  try {
    const challans = await Challan.findAll({
      order: [['delivery_date', 'DESC']],
      include: [
        { model: PurchaseOrder, attributes: ['purchase_no'] },
        { model: User, attributes: ['full_name'] }
      ]
    });
    res.status(200).json(challans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// ---------------------------
// 2. GET ONLY UNLINKED CHALLANS
// ---------------------------
export const getUnlinkedChallans = async (req, res) => {
  try {
    // Get challan_ids already linked with bills
    const linked = await BillChallan.findAll({
      attributes: ["challan_id"],
      raw: true
    });

    const linkedIds = linked.map(l => l.challan_id);

    // Fetch only unlinked ones
    const challans = await Challan.findAll({
      where: {
        challan_id: {
          [Op.notIn]: linkedIds.length > 0 ? linkedIds : [0]
        }
      },
      include: [
        { model: PurchaseOrder, attributes: ["purchase_no"], required: false },
        { model: User, attributes: ["full_name"], required: false }
      ],
      order: [["delivery_date", "DESC"]]
    });

    res.status(200).json(challans);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ---------------------------
// 3. GET CHALLAN BY ID
// ---------------------------
export const getChallanById = async (req, res) => {
  try {
    const challan = await Challan.findByPk(req.params.id, {
      include: [
        { model: PurchaseOrder, attributes: ['purchase_no', 'vendor_id'] },
        { model: User, attributes: ['full_name'] },
        {
          model: ChallanItem,
          include: [{ model: Item, attributes: ['item_name', 'size', 'color'] }]
        }
      ]
    });

    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    res.status(200).json(challan);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ---------------------------
// 4. ITEMS SUMMARY FOR BILL PAGE
// ---------------------------
export const getChallanItemsSummary = async (req, res) => {
  try {
    const { challan_ids } = req.query;

    if (!challan_ids) {
      return res.status(400).json({ message: "challan_ids is required" });
    }

    const ids = challan_ids.split(',').map(id => parseInt(id));

    const itemsSummary = await ChallanItem.findAll({
      where: { challan_id: { [Op.in]: ids } },
      include: [{ model: Item, attributes: ['item_name', 'size', 'color'] }],
      attributes: [
        'item_id',
        [sequelize.fn("SUM", sequelize.col("quantity_received")), "total_quantity"]
      ],
      group: ['item_id', 'Item.item_id'],
      raw: true
    });

    const formatted = itemsSummary.map(i => ({
      item_id: i.item_id,
      item_name: i['Item.item_name'],
      size: i['Item.size'],
      color: i['Item.color'],
      total_quantity: parseInt(i.total_quantity)
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
