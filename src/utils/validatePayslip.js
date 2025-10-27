// src/utils/validatePayslip.js
export const isEmpty = (v) =>
  v === undefined || v === null || String(v).trim() === "";
export const isNum = (v) => !Number.isNaN(Number(v));
export const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());
export const isValidPhone = (v) => {
  const digits = String(v).replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

export const EMPTY_ERRORS_SHAPE = Object.freeze({
  m: {},
  company: {},
  employee: {},
  earnings: [],
  deductions: [],
});

/**
 * options:
 *  - validateEarnings (default true)
 *  - validateDeductions (default true)
 *  - validateEmployeeExtra (default true)
 */
export function validatePayslip(
  { m, company, employee, earnings, deductions },
  options = {}
) {
  const {
    validateEarnings = true,
    validateDeductions = true,
    validateEmployeeExtra = true,
  } = options;

  const errors = {
    m: {},
    company: {},
    employee: {},
    earnings: [],
    deductions: [],
  };

  // Month
  if (isEmpty(m?.month)) errors.m.month = "Month is required.";

  // Company
  if (isEmpty(company?.name)) errors.company.name = "Company name is required.";
  if (isEmpty(company?.email))
    errors.company.email = "Company email is required.";
  else if (!isValidEmail(company.email))
    errors.company.email = "Enter a valid company email.";
  if (!isEmpty(company?.phone) && !isValidPhone(company.phone)) {
    errors.company.phone = "Enter a valid company mobile no (10–15 digits).";
  }

  // Employee (core)
  if (isEmpty(employee?.name))
    errors.employee.name = "Employee name is required.";
  if (isEmpty(employee?.employeeId))
    errors.employee.employeeId = "Employee ID is required.";
  if (isEmpty(employee?.payDate))
    errors.employee.payDate = "Pay date is required.";
  if (!isEmpty(employee?.email) && !isValidEmail(employee.email)) {
    errors.employee.email = "Enter a valid employee email.";
  }
  const empPhone = employee?.phone ?? employee?.phoneno;
  if (!isEmpty(empPhone) && !isValidPhone(empPhone)) {
    errors.employee.phone = "Enter a valid mobile no (10–15 digits).";
    errors.employee.phoneno = "Enter a valid mobile no (10–15 digits).";
  }

  // Employee extra fields — SKIPPABLE
  if (validateEmployeeExtra) {
    // If either label or value is provided, require the other.
    const ef = employee?.extraFields || [];
    errors.employee.extraFields = [];
    ef.forEach((row, i) => {
      const rowErr = {};
      const hasLabel = !isEmpty(row?.label);
      const hasValue = !isEmpty(row?.value);
      if (hasLabel && !hasValue) rowErr.value = "Value is required.";
      if (!hasLabel && hasValue) rowErr.label = "Label is required.";
      errors.employee.extraFields[i] = rowErr;
    });
  }

  // Earnings — SKIPPABLE
  if (validateEarnings) {
    (earnings || []).forEach((row, i) => {
      const rowErr = {};
      if (isEmpty(row?.label)) rowErr.label = "Label is required.";
      if (isEmpty(row?.amount)) rowErr.amount = "Amount is required.";
      else if (!isNum(row.amount)) rowErr.amount = "Amount must be a number.";
      errors.earnings[i] = rowErr;
    });
  }

  // Deductions — SKIPPABLE
  if (validateDeductions) {
    (deductions || []).forEach((row, i) => {
      const rowErr = {};
      if (isEmpty(row?.label)) rowErr.label = "Label is required.";
      if (isEmpty(row?.amount)) rowErr.amount = "Amount is required.";
      else if (!isNum(row.amount)) rowErr.amount = "Amount must be a number.";
      errors.deductions[i] = rowErr;
    });
  }

  return errors;
}

export function hasAnyError(err) {
  if (!err) return false;
  // any non-empty string somewhere inside
  return /:[ ]*"/.test(JSON.stringify(err).replace(/""/g, ""));
}

/** Only find first core-field error (ignores arrays when those validations are disabled) */
export function findFirstErrorPath(errors) {
  if (errors?.m?.month) return { path: "m.month" };

  for (const k of [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "zip",
  ]) {
    if (errors?.company?.[k]) return { path: `company.${k}` };
  }

  for (const k of [
    "name",
    "employeeId",
    "email",
    "phone",
    "phoneno",
    "payDate",
  ]) {
    if (errors?.employee?.[k]) return { path: `employee.${k}` };
  }

  // earnings/deductions/extraFields intentionally not included here
  return null;
}

export function keepOnlyFirstError(errors, first) {
  const masked = {
    m: {},
    company: {},
    employee: {},
    earnings: [],
    deductions: [],
  };
  if (!first) return masked;
  const [root, a] = first.path.split(".");
  if (root === "m") masked.m[a] = errors.m?.[a];
  else if (root === "company") masked.company[a] = errors.company?.[a];
  else if (root === "employee") masked.employee[a] = errors.employee?.[a];
  return masked;
}
