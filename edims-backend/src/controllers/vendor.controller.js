import { Vendor, PurchaseOrder, Bill } from '../models/index.js'; // Import from index
import { actorUserId, recordAudit } from '../utils/auditLog.util.js';

// --- 1. Create a new Vendor (Admin Only) ---
export const createVendor = async (req, res) => {
  try {
    // Accept both frontend field names (phone_number, gst_number) and backend names (phone, gst_no)
    // Also accept vendor_id but ignore it (auto-increment)
    const { 
      vendor_name, 
      gst_no, 
      gst_number,  // Frontend sends this
      contact_person, 
      phone, 
      phone_number,  // Frontend sends this
      email, 
      address,
      vendor_id  // Frontend sends this but we ignore it
    } = req.body;

    console.log('Received vendor data:', { vendor_name, gst_number, phone_number, email, contact_person, address });

    // Use gst_number if gst_no not provided (frontend compatibility)
    const finalGstNo = (gst_no || gst_number)?.trim() || null;
    // Use phone_number if phone not provided (frontend compatibility)
    const finalPhone = (phone || phone_number)?.trim() || null;

    if (!vendor_name || !vendor_name.trim()) {
      return res.status(400).json({ message: 'Vendor name is required' });
    }
    if (!finalGstNo || !finalGstNo.trim()) {
      return res.status(400).json({ message: 'GST number is required' });
    }

    const newVendor = await Vendor.create({
      vendor_name: vendor_name.trim(),
      gst_no: finalGstNo.trim(),
      contact_person: contact_person?.trim() || null,
      phone: finalPhone?.trim() || null,
      email: email?.trim() || null,
      address: address?.trim() || null,
    });
    
    console.log('Vendor created successfully:', newVendor.vendor_id);

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'CREATE',
      module: 'Vendor',
      record_id: newVendor.vendor_id,
      details: { vendor_name: newVendor.vendor_name, gst_no: newVendor.gst_no },
    });
    
    // Return with field names mapped for frontend compatibility
    res.status(201).json({
      vendor_id: newVendor.vendor_id,
      vendor_name: newVendor.vendor_name,
      address: newVendor.address,
      phone_number: newVendor.phone,
      phone: newVendor.phone,
      email: newVendor.email,
      contact_person: newVendor.contact_person,
      gst_number: newVendor.gst_no,
      gst_no: newVendor.gst_no
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields && Array.isArray(error.fields) && error.fields.includes('vendor_name')) {
        return res.status(400).json({ message: 'Vendor name already exists' });
      }
      if (error.fields && Array.isArray(error.fields) && error.fields.includes('gst_no')) {
        return res.status(400).json({ message: 'GST number already exists' });
      }
      return res.status(400).json({ message: 'Duplicate entry. Vendor name or GST number already exists' });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${errors}` });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// --- 2. Get All Vendors (Admin & Staff) ---
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      order: [['vendor_id', 'ASC']],
    });
    
    // Map field names for frontend compatibility
    const mappedVendors = vendors.map(vendor => ({
      vendor_id: vendor.vendor_id,
      vendor_name: vendor.vendor_name,
      address: vendor.address,
      phone_number: vendor.phone,
      phone: vendor.phone,
      email: vendor.email,
      contact_person: vendor.contact_person,
      gst_number: vendor.gst_no,
      gst_no: vendor.gst_no
    }));
    
    res.status(200).json(mappedVendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. Get One Vendor by ID (Admin & Staff) ---
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 4. Update a Vendor (Admin Only) ---
export const updateVendor = async (req, res) => {
  const { id } = req.params;
  const {
    vendor_name,
    gst_no,
    gst_number,
    contact_person,
    phone,
    phone_number,
    email,
    address,
  } = req.body;

  try {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const finalGst = (gst_no || gst_number)?.trim();
    const finalPhone = (phone || phone_number)?.trim();

    if (vendor_name != null && vendor_name !== '') {
      vendor.vendor_name = vendor_name.trim();
    }
    if (finalGst) {
      vendor.gst_no = finalGst;
    }
    if (contact_person !== undefined) {
      vendor.contact_person = contact_person?.trim() || null;
    }
    if (finalPhone !== undefined && finalPhone !== null) {
      vendor.phone = finalPhone || null;
    }
    if (email !== undefined) {
      vendor.email = email?.trim() || null;
    }
    if (address !== undefined) {
      vendor.address = address?.trim() || null;
    }

    await vendor.save();

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'UPDATE',
      module: 'Vendor',
      record_id: vendor.vendor_id,
      details: {
        vendor_name: vendor.vendor_name,
        gst_no: vendor.gst_no,
      },
    });

    res.status(200).json(vendor);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields.vendor_name) {
        return res.status(400).json({ message: 'Vendor name already exists' });
      }
      if (error.fields.gst_no) {
        return res.status(400).json({ message: 'GST No. already exists' });
      }
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 5. Delete a Vendor (Admin Only) ---
export const deleteVendor = async (req, res) => {
  const { id } = req.params;

  try {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const poCount = await PurchaseOrder.count({ where: { vendor_id: vendor.vendor_id } });
    const billCount = await Bill.count({ where: { vendor_id: vendor.vendor_id } });
    if (poCount > 0 || billCount > 0) {
      return res.status(400).json({
        message:
          'Cannot delete this vendor. Purchase order(s) or bill(s) already exist for this vendor.',
      });
    }

    await recordAudit({
      userId: actorUserId(req),
      action_type: 'DELETE',
      module: 'Vendor',
      record_id: vendor.vendor_id,
      details: {
        vendor_name: vendor.vendor_name,
        gst_no: vendor.gst_no,
      },
    });

    await vendor.destroy();
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    // Handle foreign key constraint error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Cannot delete vendor. It is already linked to a Purchase Order or Bill.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};