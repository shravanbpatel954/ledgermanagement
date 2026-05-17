import { Router } from 'express';
import {
  getLedgers,
  getLedgerMeta,
  createLedger,
  updateLedger,
  deleteLedger,
  issueLedger,
  returnLedger,
  bulkImportLedgers,
} from '../controllers/ledger.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/meta', getLedgerMeta);
router.get('/', getLedgers);
router.post('/', createLedger);
router.post('/bulk-import', bulkImportLedgers);
router.put('/:id', updateLedger);
router.delete('/:id', deleteLedger);
router.post('/:id/issue', issueLedger);
router.post('/:id/return', returnLedger);

export default router;
