/**
 * AL MEEZAN ERP - COMPREHENSIVE UNIVERSAL DUAL BACKEND ENGINE
 * Connects all 16 Frontend Pages to Google Apps Script OR Supabase PostgreSQL
 */

const ERP_CONFIG = {
  getBackendType() {
    return localStorage.getItem('erp_active_backend') || 'supabase';
  },
  setBackendType(type) {
    localStorage.setItem('erp_active_backend', type);
  },
  getScriptUrl() {
    return localStorage.getItem('erp_script_url') || '';
  },
  setScriptUrl(url) {
    localStorage.setItem('erp_script_url', url.trim());
  },
  getSupabaseUrl() {
    return localStorage.getItem('erp_supabase_url') || 'https://ofplfqawiupcmqvzkhfp.supabase.co';
  },
  getSupabaseKey() {
    return localStorage.getItem('erp_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcGxmcWF3aXVwY21xdnpraGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzA5MjAsImV4cCI6MjEwMzE0NjkyMH0.DP6_HPAoDhexUwiavzbmrXNfh3BOD27P4rsUcSKkQdU';
  },
  setSupabaseCredentials(url, key) {
    localStorage.setItem('erp_supabase_url', url.trim());
    localStorage.setItem('erp_supabase_key', key.trim());
  }
};

let _sbClient = null;
function getSupabase() {
  if (!_sbClient && window.supabase) {
    _sbClient = window.supabase.createClient(ERP_CONFIG.getSupabaseUrl(), ERP_CONFIG.getSupabaseKey());
  }
  return _sbClient;
}

/**
 * Universal Top Config Bar Injection
 */
function renderBackendConfigBar() {
  const existing = document.getElementById('erpConfigContainer');
  if (existing) return;

  const currentType = ERP_CONFIG.getBackendType();
  const scriptUrl = ERP_CONFIG.getScriptUrl();
  const sbUrl = ERP_CONFIG.getSupabaseUrl();
  const sbKey = ERP_CONFIG.getSupabaseKey();

  const container = document.createElement('div');
  container.id = 'erpConfigContainer';
  container.innerHTML = `
    <style>
      .erp-cfg-link {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 11px; font-weight: bold; color: #166534;
        cursor: pointer; padding: 4px 10px; margin-bottom: 8px;
        background: #dcfce7; border: 1px solid #86efac; border-radius: 4px;
        transition: all 0.2s;
      }
      .erp-cfg-link:hover { background: #bbf7d0; }
      .erp-cfg-panel {
        display: none; background: #ffffff; border: 1px solid #cbd5e1;
        border-radius: 8px; padding: 14px 18px; margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-size: 12px; color: #334155;
      }
      .erp-cfg-panel.show { display: block; }
      .erp-cfg-row { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
      .erp-cfg-radio { display: inline-flex; align-items: center; gap: 5px; font-weight: 600; cursor: pointer; }
      .erp-cfg-input-group { margin-bottom: 8px; }
      .erp-cfg-input-group label { display: block; font-weight: 600; font-size: 11px; margin-bottom: 3px; color: #475569; }
      .erp-cfg-input-group input { width: 100%; padding: 6px 10px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
      .erp-cfg-save-btn {
        background: #15803d; color: #ffffff; border: none; padding: 6px 14px;
        font-size: 12px; font-weight: 600; border-radius: 4px; cursor: pointer;
      }
      .erp-cfg-save-btn:hover { background: #166534; }
    </style>
    <div class="erp-cfg-link" onclick="toggleBackendConfigPanel()">
      ⚙️ Change Backend & Connection Settings (${currentType === 'supabase' ? '🟢 Supabase PostgreSQL (Fast Direct)' : '🟠 Google Apps Script (Legacy)'})
    </div>
    <div id="erpConfigPanel" class="erp-cfg-panel">
      <div style="font-weight: bold; margin-bottom: 8px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
        ⚙️ Connection & Backend Settings:
      </div>
      <div class="erp-cfg-row">
        <label class="erp-cfg-radio">
          <input type="radio" name="erpBackendType" value="google" ${currentType === 'google' ? 'checked' : ''} onchange="onBackendTypeChange(this.value)">
          Google Apps Script (Legacy)
        </label>
        <label class="erp-cfg-radio">
          <input type="radio" name="erpBackendType" value="supabase" ${currentType === 'supabase' ? 'checked' : ''} onchange="onBackendTypeChange(this.value)">
          Supabase PostgreSQL (Fast Direct)
        </label>
      </div>

      <div id="googleConfigSection" style="display: ${currentType === 'google' ? 'block' : 'none'};">
        <div class="erp-cfg-input-group">
          <label>Google Apps Script Deployment URL:</label>
          <input type="text" id="cfgScriptUrl" value="${scriptUrl}" placeholder="https://script.google.com/macros/s/XXXXXXXX/exec">
        </div>
      </div>

      <div id="supabaseConfigSection" style="display: ${currentType === 'supabase' ? 'block' : 'none'};">
        <div class="erp-cfg-input-group">
          <label>Supabase Project URL:</label>
          <input type="text" id="cfgSupabaseUrl" value="${sbUrl}" placeholder="https://ofplfqawiupcmqvzkhfp.supabase.co">
        </div>
        <div class="erp-cfg-input-group">
          <label>Supabase Anon / Public Key:</label>
          <input type="text" id="cfgSupabaseKey" value="${sbKey}" placeholder="eyJhbGciOi...">
        </div>
      </div>

      <button type="button" class="erp-cfg-save-btn" onclick="saveBackendConfig()">Save & Connect Settings</button>
    </div>
  `;

  const topTarget = document.querySelector('.container') || document.querySelector('.form-container') || document.querySelector('.main-container') || document.body;
  topTarget.insertBefore(container, topTarget.firstChild);
}

function toggleBackendConfigPanel() {
  const panel = document.getElementById('erpConfigPanel');
  if (panel) panel.classList.toggle('show');
}

function onBackendTypeChange(type) {
  document.getElementById('googleConfigSection').style.display = type === 'google' ? 'block' : 'none';
  document.getElementById('supabaseConfigSection').style.display = type === 'supabase' ? 'block' : 'none';
}

function saveBackendConfig() {
  const selectedType = document.querySelector('input[name="erpBackendType"]:checked').value;
  ERP_CONFIG.setBackendType(selectedType);

  if (selectedType === 'google') {
    const sUrl = document.getElementById('cfgScriptUrl').value.trim();
    ERP_CONFIG.setScriptUrl(sUrl);
  } else {
    const sbUrl = document.getElementById('cfgSupabaseUrl').value.trim();
    const sbKey = document.getElementById('cfgSupabaseKey').value.trim();
    ERP_CONFIG.setSupabaseCredentials(sbUrl, sbKey);
  }

  alert("Connection Settings Saved! Reloading...");
  window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  renderBackendConfigBar();
});


/**
 * ============================================================================
 * UNIFIED COMPLETE API ENGINE
 * ============================================================================
 */
const erpApi = {

  // 1. SETTINGS & LOOKUPS
  async getSettings() {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getSettings');
      return await res.json();
    } else {
      const sb = getSupabase();
      const { data, error } = await sb.from('app_settings').select('*').eq('is_active', true).order('sort_order');
      if (error) throw error;

      const cros = data.filter(d => d.category === 'CRO').map(d => d.display_name);
      const approvedBy = data.filter(d => d.category === 'APPROVED_BY').map(d => d.display_name);
      const cash = data.filter(d => d.category === 'PAY_MODE').map(d => d.display_name);
      const bank = data.filter(d => d.category === 'BANK').map(d => d.display_name);
      const vendors = data.filter(d => d.category === 'VENDOR').map(d => ({ name: d.display_name, contact: d.contact_person, mobile: d.mobile_no }));
      const expenseHeads = data.filter(d => d.category === 'EXPENSE_HEAD').map(d => d.display_name);

      return {
        success: true,
        cros: cros.length > 0 ? cros : ['JAFAR SB', 'Raza Shah', 'Hassan'],
        approvedBy: approvedBy.length > 0 ? approvedBy : ['M Shabbir', 'M Shahid'],
        cash: cash.length > 0 ? cash : ['Daybook (Cash)'],
        bank: bank.length > 0 ? bank : ['Allied Bank (1870014)'],
        vendors: vendors,
        expenseHeads: expenseHeads
      };
    }
  },

  // 2. CUSTOMER & ACCOUNT NO
  async getNextAccountNumber() {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getNextAccountNumber');
      return await res.json();
    } else {
      const sb = getSupabase();
      const { data, error } = await sb.from('customers').select('account_no').order('account_no', { ascending: false }).limit(50);
      if (error) throw error;

      let maxNum = 7860000;
      if (data && data.length > 0) {
        data.forEach(r => {
          let num = parseInt(String(r.account_no).replace(/[^\d]/g, ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        });
      }
      return { success: true, nextAccNo: String(maxNum + 1) };
    }
  },

  async getCustomer(accNo) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getCustomer&accNo=' + encodeURIComponent(accNo));
      return await res.json();
    } else {
      const sb = getSupabase();
      const { data: cust, error: custErr } = await sb
        .from('customers')
        .select('*')
        .eq('account_no', String(accNo).trim())
        .maybeSingle();

      if (custErr) throw custErr;
      if (!cust) return { success: false, error: "Account not found" };

      const { data: sales } = await sb.from('sales').select('total_amt, advance, installment_per_month').eq('account_no', String(accNo).trim());
      const { data: receipts } = await sb.from('receipts').select('amount').eq('account_no', String(accNo).trim());

      let totalSale = 0, advance = 0, monthlyInst = 0;
      if (sales) {
        sales.forEach(s => {
          totalSale += Number(s.total_amt || 0);
          advance += Number(s.advance || 0);
          if (s.installment_per_month) monthlyInst = Number(s.installment_per_month);
        });
      }

      let totalPaidReceipts = 0;
      if (receipts) {
        receipts.forEach(r => totalPaidReceipts += Number(r.amount || 0));
      }

      let totalPaid = advance + totalPaidReceipts;
      let balance = totalSale - totalPaid;

      return {
        success: true,
        accountNo: cust.account_no,
        accountTitle: cust.account_title,
        approvedBy: cust.approved_by,
        cro: cust.cro,
        mobileNo: cust.mobile_number,
        sowdowo: cust.sowdowo,
        cnicNo: cust.cnic_no,
        address: cust.address,
        totalSaleAmount: totalSale,
        paidAmount: totalPaid,
        balance: balance > 0 ? balance : 0,
        monthlyInst: monthlyInst
      };
    }
  },

  async saveCustomer(data) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl(), {
        method: 'POST',
        body: JSON.stringify({ action: 'saveNewCustomer', data: data })
      });
      return await res.json();
    } else {
      const sb = getSupabase();
      const record = {
        account_no: String(data.accountNo || data.accNo).trim(),
        account_title: data.accountTitle,
        approved_by: data.approvedBy,
        cro: data.cro,
        mobile_number: data.mobileNo,
        sowdowo: data.sowdowo,
        cnic_no: data.cnicNo,
        address: data.address,
        department: data.department,
        salary: Number(data.salary || 0),
        designation: data.designation,
        guarantor_1_name: data.g1Name,
        guarantor_1_mobile: data.g1Mobile,
        guarantor_1_dept: data.g1Dept,
        guarantor_1_designation: data.g1Desig,
        guarantor_2_name: data.g2Name,
        guarantor_2_mobile: data.g2Mobile,
        guarantor_2_dept: data.g2Dept,
        guarantor_2_designation: data.g2Desig
      };

      const { data: saved, error } = await sb.from('customers').upsert(record, { onConflict: 'account_no' }).select();
      if (error) throw error;
      return { success: true, message: "Customer saved successfully", data: saved };
    }
  },

  // 3. PRODUCTS
  async getProductDropdownData() {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getProductDropdownData');
      return await res.json();
    } else {
      const sb = getSupabase();
      const { data, error } = await sb.from('product_master').select('*');
      if (error) throw error;

      const categories = [...new Set(data.map(p => p.product_category).filter(Boolean))].sort();
      const companies = [...new Set(data.map(p => p.company_name).filter(Boolean))].sort();
      const models = [...new Set(data.map(p => p.model).filter(Boolean))].sort();
      const colors = [...new Set(data.map(p => p.color).filter(Boolean))].sort();
      const rams = [...new Set(data.map(p => p.ram).filter(Boolean))].sort();
      const roms = [...new Set(data.map(p => p.memory).filter(Boolean))].sort();

      return { categories, companies, models, colors, rams, roms };
    }
  },

  async saveProductMaster(data) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl(), {
        method: 'POST',
        body: JSON.stringify({ action: 'saveProductMaster', data: data })
      });
      return await res.json();
    } else {
      const sb = getSupabase();
      const pid = data.product_id || "PRD-" + new Date().getTime().toString(36).toUpperCase();
      const record = {
        product_id: pid,
        company_name: data.company_name,
        product_category: data.product_category,
        model: data.model,
        color: data.color || '',
        memory: data.memory || '',
        ram: data.ram || '',
        remarks: data.remarks || ''
      };

      const { error } = await sb.from('product_master').upsert(record, { onConflict: 'product_id' });
      if (error) throw error;
      return { success: true, message: "Product saved successfully.", product_id: pid };
    }
  },

  // 4. SALES
  async saveSalesEntry(data) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl(), {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSalesEntry', data: data })
      });
      return await res.json();
    } else {
      const sb = getSupabase();
      const products = data.products || [];
      const records = products.map(p => ({
        product_id: p.product_id || null,
        date: data.date,
        approved_by: data.approvedBy,
        cro: data.cro,
        account_no: data.accountNo,
        account_title: data.accountTitle,
        company_name: p.companyName,
        product_category: p.productCategory,
        model: p.model,
        color: p.color,
        qty: Number(p.qty) || 1,
        sales_rate: Number(p.salesRate) || 0,
        sales_amt: Number(p.salesAmt) || 0,
        plan_months: Number(p.planMonths) || 0,
        advance: Number(p.advance) || 0,
        installment_per_month: Number(p.installmentPerMonth) || 0,
        processing_fee: Number(p.processingFee) || 0,
        total_amt: Number(p.salesAmt || 0) + Number(p.processingFee || 0),
        next_inst_month: data.nextInstMonth || null,
        remarks: p.remarks || ''
      }));

      const { error } = await sb.from('sales').insert(records);
      if (error) throw error;

      // Deduct stock in stock_ledger
      const stockOut = products.filter(p => p.product_id).map(p => ({
        transaction_id: "OUT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: data.date,
        product_id: p.product_id,
        company_name: p.companyName,
        product_category: p.productCategory,
        model: p.model,
        color: p.color,
        qty_in: 0,
        qty_out: Number(p.qty) || 1,
        reference_type: 'SALE',
        reference_id: data.accountNo,
        warehouse: 'MAIN WAREHOUSE',
        remarks: 'Sale Acc ' + data.accountNo
      }));

      if (stockOut.length > 0) {
        await sb.from('stock_ledger').insert(stockOut);
      }

      return { success: true, message: "Sale saved successfully" };
    }
  },

  async getRecentSales(filters = {}) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getRecentSalesList');
      return await res.json();
    } else {
      const sb = getSupabase();
      let query = sb.from('sales').select('*').order('date', { ascending: false }).limit(150);
      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    }
  },

  // 5. RECEIPTS
  async saveReceipt(data) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl(), {
        method: 'POST',
        body: JSON.stringify({ action: 'saveReceipt', data: data })
      });
      return await res.json();
    } else {
      const sb = getSupabase();
      const record = {
        voucher_no: String(data.receiptNo || data.receiptNoCustom || data.voucher_no || '').trim(),
        date: data.receiptDate || data.date || new Date().toISOString().split('T')[0],
        account_no: String(data.accountNo || data.accNo || '').trim(),
        account_title: String(data.accountTitle || data.customerName || '').trim(),
        account_head: data.receiptSuffix || data.account_head || 'Cash',
        pay_mode: data.paymentMode || data.pay_mode || 'Cash',
        amount: Number(data.receiptAmount || data.amount || 0),
        remarks: data.receiptRemarks || data.remarks || ''
      };

      const { data: saved, error } = await sb.from('receipts').insert([record]).select();
      if (error) throw error;
      return { success: true, data: saved };
    }
  },

  async getRecentReceipts(filters = {}) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getAllReceiptsForReport');
      return await res.json();
    } else {
      const sb = getSupabase();
      let query = sb.from('receipts').select('*').order('date', { ascending: false }).limit(200);

      if (filters.fromDate) query = query.gte('date', filters.fromDate);
      if (filters.toDate) query = query.lte('date', filters.toDate);
      if (filters.receiptNo) query = query.ilike('voucher_no', `%${filters.receiptNo}%`);

      const { data, error } = await query;
      if (error) throw error;

      return {
        success: true,
        data: (data || []).map(r => ({
          id: r.id,
          receiptNo: r.voucher_no,
          date: r.date,
          accountNo: r.account_no,
          customerTitle: r.account_title,
          paymentMode: r.pay_mode,
          amount: r.amount,
          remarks: r.remarks
        }))
      };
    }
  },

  async deleteReceipt(idOrVoucher) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl(), {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteReceiptEntry', data: { receiptNo: idOrVoucher } })
      });
      return await res.json();
    } else {
      const sb = getSupabase();
      const { error } = await sb.from('receipts').delete().or(`id.eq.${idOrVoucher},voucher_no.eq.${idOrVoucher}`);
      if (error) throw error;
      return { success: true };
    }
  },

  // 6. LEDGER VIEW
  async getCustomerLedger(accNo) {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getAccountLedgerDetails&accNo=' + encodeURIComponent(accNo));
      return await res.json();
    } else {
      const sb = getSupabase();
      const { data, error } = await sb.from('v_customer_ledger').select('*').eq('account_no', String(accNo).trim()).order('date', { ascending: true });
      if (error) throw error;
      return { success: true, data: data || [] };
    }
  },

  // 7. STOCK LEDGER
  async getStockLedger() {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getStockLedgerRecords');
      return await res.json();
    } else {
      const sb = getSupabase();
      const { data, error } = await sb.from('stock_ledger').select('*').order('date', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    }
  },

  // 8. DASHBOARD METRICS
  async getDashboardKPIs() {
    if (ERP_CONFIG.getBackendType() === 'google') {
      const res = await fetch(ERP_CONFIG.getScriptUrl() + '?action=getDashboardMetrics');
      return await res.json();
    } else {
      const sb = getSupabase();
      const { count: customerCount } = await sb.from('customers').select('*', { count: 'exact', head: true });
      const { data: salesSum } = await sb.from('sales').select('total_amt, advance, processing_fee');

      let totalSalesVol = 0, totalAdvance = 0, totalPros = 0;
      let totalSalesContracts = salesSum ? salesSum.length : 0;
      if (salesSum) {
        salesSum.forEach(s => {
          totalSalesVol += Number(s.total_amt || 0);
          totalAdvance += Number(s.advance || 0);
          totalPros += Number(s.processing_fee || 0);
        });
      }

      const { data: rctData } = await sb.from('receipts').select('amount, pay_mode');
      let totalReceiptsCount = rctData ? rctData.length : 0;
      let cashCollections = 0, bankCollections = 0;

      if (rctData) {
        rctData.forEach(r => {
          let amt = Number(r.amount || 0);
          let mode = String(r.pay_mode || '').toLowerCase();
          if (mode.includes('bank') || mode.includes('online') || mode.includes('cheque')) bankCollections += amt;
          else cashCollections += amt;
        });
      }

      let totalRecovered = cashCollections + bankCollections;
      let totalOutstanding = totalSalesVol - (totalAdvance + totalRecovered);

      return {
        success: true,
        data: {
          totalActiveCustomers: customerCount || 0,
          totalSalesContracts: totalSalesContracts,
          totalSalesVolume: totalSalesVol,
          totalCollections: totalRecovered,
          cashCollections: cashCollections,
          bankCollections: bankCollections,
          advanceTotal: totalAdvance,
          processingFeeTotal: totalPros,
          totalOutstandingReceivable: totalOutstanding > 0 ? totalOutstanding : 0,
          totalReceiptEntries: totalReceiptsCount
        }
      };
    }
  }
};
