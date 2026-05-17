import { Op } from 'sequelize';
import {
  LedgerBook,
  LedgerMovement,
  Department,
  sequelize,
} from '../models/index.js';
import { actorUserId, recordAudit } from '../utils/auditLog.util.js';

const HALVES = ['First Half', 'Second Half'];

function normalizeHalf(value) {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (v === 'first half' || v === 'first' || v === '1' || v === 'h1') return 'First Half';
  if (v === 'second half' || v === 'second' || v === '2' || v === 'h2') return 'Second Half';
  return HALVES.includes(value) ? value : null;
}

function mapLedger(row) {
  const plain = row.get ? row.get({ plain: true }) : row;
  return {
    ...plain,
    department_name: plain.Department?.dept_name || null,
  };
}

// GET /api/ledgers — search & filter
export const getLedgers = async (req, res) => {
  try {
    const {
      dept_id,
      academic_year,
      half,
      status,
      rack_code,
      q,
    } = req.query;

    const where = {};
    if (dept_id) where.dept_id = parseInt(dept_id, 10);
    if (academic_year) where.academic_year = academic_year;
    if (half) {
      const h = normalizeHalf(half);
      if (h) where.half = h;
    }
    if (status && ['In Rack', 'Issued'].includes(status)) where.status = status;
    if (rack_code) where.rack_code = { [Op.like]: `%${rack_code}%` };

    if (q && String(q).trim()) {
      const term = `%${String(q).trim()}%`;
      where[Op.or] = [
        { accession_no: { [Op.like]: term } },
        { title: { [Op.like]: term } },
        { rack_code: { [Op.like]: term } },
        { issued_to_name: { [Op.like]: term } },
      ];
    }

    const ledgers = await LedgerBook.findAll({
      where,
      include: [{ model: Department, attributes: ['dept_id', 'dept_name'] }],
      order: [
        ['academic_year', 'DESC'],
        ['dept_id', 'ASC'],
        ['half', 'ASC'],
        ['accession_no', 'ASC'],
      ],
    });

    res.status(200).json(ledgers.map(mapLedger));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/ledgers/meta — years list, stats
export const getLedgerMeta = async (req, res) => {
  try {
    const years = await LedgerBook.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('academic_year')), 'academic_year']],
      order: [[sequelize.col('academic_year'), 'DESC']],
      raw: true,
    });

    const [inRack, issued, total] = await Promise.all([
      LedgerBook.count({ where: { status: 'In Rack' } }),
      LedgerBook.count({ where: { status: 'Issued' } }),
      LedgerBook.count(),
    ]);

    res.status(200).json({
      academic_years: years.map((y) => y.academic_year).filter(Boolean),
      halves: HALVES,
      counts: { total, inRack, issued },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/ledgers
export const createLedger = async (req, res) => {
  try {
    const {
      accession_no,
      dept_id,
      academic_year,
      half,
      title,
      rack_code,
      remarks,
    } = req.body;

    if (!accession_no?.trim()) {
      return res.status(400).json({ message: 'Accession number is required.' });
    }
    if (!dept_id || !academic_year?.trim()) {
      return res.status(400).json({ message: 'Department and academic year are required.' });
    }
    const halfNorm = normalizeHalf(half);
    if (!halfNorm) {
      return res.status(400).json({ message: 'Half must be First Half or Second Half.' });
    }

    const dept = await Department.findByPk(dept_id);
    if (!dept) return res.status(400).json({ message: 'Department not found.' });

    const ledger = await LedgerBook.create({
      accession_no: accession_no.trim(),
      dept_id: parseInt(dept_id, 10),
      academic_year: academic_year.trim(),
      half: halfNorm,
      title: title?.trim() || null,
      rack_code: rack_code?.trim() || null,
      status: 'In Rack',
      remarks: remarks?.trim() || null,
    });

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'CREATE',
      module: 'LedgerBook',
      record_id: ledger.ledger_id,
      details: { accession_no: ledger.accession_no, dept_id: ledger.dept_id },
    });

    const full = await LedgerBook.findByPk(ledger.ledger_id, {
      include: [{ model: Department, attributes: ['dept_name'] }],
    });
    res.status(201).json(mapLedger(full));
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Accession number already exists.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/ledgers/:id — only when In Rack (no active issue)
export const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await LedgerBook.findByPk(id);
    if (!ledger) return res.status(404).json({ message: 'Ledger not found.' });
    if (ledger.status === 'Issued') {
      return res.status(400).json({
        message:
          'This ledger is currently issued. Return it before editing master details.',
      });
    }

    const {
      accession_no,
      dept_id,
      academic_year,
      half,
      title,
      rack_code,
      remarks,
    } = req.body;

    if (accession_no?.trim()) ledger.accession_no = accession_no.trim();
    if (dept_id) {
      const dept = await Department.findByPk(dept_id);
      if (!dept) return res.status(400).json({ message: 'Department not found.' });
      ledger.dept_id = parseInt(dept_id, 10);
    }
    if (academic_year?.trim()) ledger.academic_year = academic_year.trim();
    if (half) {
      const h = normalizeHalf(half);
      if (!h) return res.status(400).json({ message: 'Invalid half.' });
      ledger.half = h;
    }
    if (title !== undefined) ledger.title = title?.trim() || null;
    if (rack_code !== undefined) ledger.rack_code = rack_code?.trim() || null;
    if (remarks !== undefined) ledger.remarks = remarks?.trim() || null;

    await ledger.save();

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'UPDATE',
      module: 'LedgerBook',
      record_id: ledger.ledger_id,
      details: { accession_no: ledger.accession_no },
    });

    const full = await LedgerBook.findByPk(ledger.ledger_id, {
      include: [{ model: Department, attributes: ['dept_name'] }],
    });
    res.status(200).json(mapLedger(full));
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Accession number already exists.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/ledgers/:id
export const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await LedgerBook.findByPk(id);
    if (!ledger) return res.status(404).json({ message: 'Ledger not found.' });
    if (ledger.status === 'Issued') {
      return res.status(400).json({
        message: 'Cannot delete a ledger that is currently issued. Return it first.',
      });
    }

    await LedgerMovement.destroy({ where: { ledger_id: id } });
    await recordAudit({
      userId: actorUserId(req),
      action_type: 'DELETE',
      module: 'LedgerBook',
      record_id: ledger.ledger_id,
      details: { accession_no: ledger.accession_no },
    });
    await ledger.destroy();
    res.status(200).json({ message: 'Ledger deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/ledgers/:id/issue
export const issueLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { issued_to_name, issued_to_contact, notes } = req.body;

    if (!issued_to_name?.trim()) {
      return res.status(400).json({ message: 'Issued to (name) is required.' });
    }

    const ledger = await LedgerBook.findByPk(id);
    if (!ledger) return res.status(404).json({ message: 'Ledger not found.' });
    if (ledger.status === 'Issued') {
      return res.status(400).json({
        message: `Already issued to ${ledger.issued_to_name || 'someone'}. Return it first.`,
      });
    }

    ledger.status = 'Issued';
    ledger.issued_to_name = issued_to_name.trim();
    ledger.issued_to_contact = issued_to_contact?.trim() || null;
    ledger.issued_at = new Date();
    ledger.rack_code = null;
    await ledger.save();

    await LedgerMovement.create({
      ledger_id: ledger.ledger_id,
      action: 'Issue',
      issued_to_name: ledger.issued_to_name,
      issued_to_contact: ledger.issued_to_contact,
      user_id: actorUserId(req),
      notes: notes?.trim() || null,
    });

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'UPDATE',
      module: 'LedgerBook',
      record_id: ledger.ledger_id,
      details: { action: 'issue', issued_to_name: ledger.issued_to_name },
    });

    const full = await LedgerBook.findByPk(ledger.ledger_id, {
      include: [{ model: Department, attributes: ['dept_name'] }],
    });
    res.status(200).json(mapLedger(full));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/ledgers/:id/return
export const returnLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { rack_code, notes } = req.body;

    if (!rack_code?.trim()) {
      return res.status(400).json({ message: 'Rack location is required when returning.' });
    }

    const ledger = await LedgerBook.findByPk(id);
    if (!ledger) return res.status(404).json({ message: 'Ledger not found.' });
    if (ledger.status !== 'Issued') {
      return res.status(400).json({ message: 'This ledger is not currently issued.' });
    }

    const prevHolder = ledger.issued_to_name;
    ledger.status = 'In Rack';
    ledger.rack_code = rack_code.trim();
    ledger.issued_to_name = null;
    ledger.issued_to_contact = null;
    ledger.issued_at = null;
    await ledger.save();

    await LedgerMovement.create({
      ledger_id: ledger.ledger_id,
      action: 'Return',
      issued_to_name: prevHolder,
      rack_code: ledger.rack_code,
      user_id: actorUserId(req),
      notes: notes?.trim() || null,
    });

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'UPDATE',
      module: 'LedgerBook',
      record_id: ledger.ledger_id,
      details: { action: 'return', rack_code: ledger.rack_code },
    });

    const full = await LedgerBook.findByPk(ledger.ledger_id, {
      include: [{ model: Department, attributes: ['dept_name'] }],
    });
    res.status(200).json(mapLedger(full));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/ledgers/bulk-import
export const bulkImportLedgers = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No rows to import.' });
    }

    const departments = await Department.findAll({ transaction: t });
    const deptByName = new Map(
      departments.map((d) => [d.dept_name.trim().toLowerCase(), d.dept_id])
    );

    const created = [];
    const skipped = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const line = i + 1;

      let deptId = row.dept_id ? parseInt(row.dept_id, 10) : null;
      if (!deptId && row.department_name) {
        deptId = deptByName.get(String(row.department_name).trim().toLowerCase());
      }
      const accession = row.accession_no?.trim();
      const year = row.academic_year?.trim();
      const halfNorm = normalizeHalf(row.half);

      if (!deptId || !accession || !year || !halfNorm) {
        errors.push({
          line,
          message: 'Missing department, accession, year, or half (First/Second).',
        });
        continue;
      }

      const exists = await LedgerBook.findOne({
        where: { accession_no: accession },
        transaction: t,
      });
      if (exists) {
        skipped.push({ line, accession_no: accession, reason: 'Duplicate accession' });
        continue;
      }

      const ledger = await LedgerBook.create(
        {
          accession_no: accession,
          dept_id: deptId,
          academic_year: year,
          half: halfNorm,
          title: row.title?.trim() || null,
          rack_code: row.rack_code?.trim() || null,
          status: 'In Rack',
          remarks: row.remarks?.trim() || null,
        },
        { transaction: t }
      );
      created.push(ledger.accession_no);
    }

    await t.commit();

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'CREATE',
      module: 'LedgerBook',
      record_id: null,
      details: { bulk_import: true, created: created.length, skipped: skipped.length },
    });

    res.status(200).json({
      message: `Import complete: ${created.length} added, ${skipped.length} skipped, ${errors.length} errors.`,
      created_count: created.length,
      skipped_count: skipped.length,
      error_count: errors.length,
      created,
      skipped,
      errors,
    });
  } catch (error) {
    if (t.finished !== 'commit' && t.finished !== 'rollback') await t.rollback();
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};
