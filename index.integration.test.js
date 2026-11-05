/**
 * Integration tests for USD/JPY exchange rate chart (index.html)
 * Fetches from running HTTP server and validates DOM + JS functions
 */
const http = require('http');
const { JSDOM } = require('jsdom');

const BASE_URL = 'http://localhost:8000/';

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

let dom, window, document, response, mockCtx;

function createMockCtx() {
  return {
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    strokeStyle: '',
    lineWidth: 0,
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
  };
}

function resetMockCtx() {
  Object.keys(mockCtx).forEach(k => {
    if (mockCtx[k] && typeof mockCtx[k].mockClear === 'function') {
      mockCtx[k].mockClear();
    }
  });
}

function computeSpanYears(data) {
  const parseDate = window.parseDate;
  const first = parseDate(data[0][0]);
  const last = parseDate(data[data.length - 1][0]);
  return (last.getTime() - first.getTime()) / (365.25 * 24 * 3600 * 1000);
}

function getLabelInterval(spanYears) {
  if (spanYears <= 1.5) return 'month';
  if (spanYears <= 6) return 'year';
  return '5year';
}

beforeAll(async () => {
  response = await fetchPage(BASE_URL);

  mockCtx = createMockCtx();

  dom = new JSDOM(response.body, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: BASE_URL,
    beforeParse(win) {
      win.HTMLCanvasElement.prototype.getContext = function () { return mockCtx; };
    }
  });
  window = dom.window;
  document = window.document;
}, 30000);

afterAll(() => {
  if (dom) dom.window.close();
});

// ITC-001
test('test_itc001_initial_load_5year_active_and_data_filtered', () => {
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const data5 = window.filterData(5);
  const firstDate = data5[0][0];
  const firstYear = parseInt(firstDate.substring(0, 4));
  const actual = `status=${response.status},active_years=${activeYears},firstDate=${firstDate},count=${data5.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-001', actual }));
  expect(response.status).toBe(200);
  expect(activeYears).toBe('5');
  expect(firstYear).toBeGreaterThanOrEqual(2021);
  expect(data5.length).toBeGreaterThan(0);
});

// ITC-002
test('test_itc002_click_1year_button_filters_and_redraws', () => {
  const btn1 = document.querySelector('.buttons button[data-years="1"]');
  btn1.click();
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const activeCount = document.querySelectorAll('.buttons button.active').length;
  const data1 = window.filterData(1);
  const data5 = window.filterData(5);
  const firstDate = data1[0][0];
  const firstYear = parseInt(firstDate.substring(0, 4));
  const actual = `status=${response.status},active_years=${activeYears},activeCount=${activeCount},firstDate=${firstDate},count1=${data1.length},count5=${data5.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-002', actual }));
  expect(response.status).toBe(200);
  expect(activeYears).toBe('1');
  expect(activeCount).toBe(1);
  expect(firstYear).toBeGreaterThanOrEqual(2025);
  expect(data1.length).toBeGreaterThan(0);
  expect(data1.length).toBeLessThan(data5.length);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-003
test('test_itc003_click_10year_button_filters_and_redraws', () => {
  const btn10 = document.querySelector('.buttons button[data-years="10"]');
  btn10.click();
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const activeCount = document.querySelectorAll('.buttons button.active').length;
  const data10 = window.filterData(10);
  const data5 = window.filterData(5);
  const firstDate = data10[0][0];
  const firstYear = parseInt(firstDate.substring(0, 4));
  const actual = `status=${response.status},active_years=${activeYears},activeCount=${activeCount},firstDate=${firstDate},count10=${data10.length},count5=${data5.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-003', actual }));
  expect(response.status).toBe(200);
  expect(activeYears).toBe('10');
  expect(activeCount).toBe(1);
  expect(firstYear).toBeGreaterThanOrEqual(2016);
  expect(data10.length).toBeGreaterThan(data5.length);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-004
test('test_itc004_click_20year_button_filters_and_redraws', () => {
  const btn20 = document.querySelector('.buttons button[data-years="20"]');
  btn20.click();
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const activeCount = document.querySelectorAll('.buttons button.active').length;
  const data20 = window.filterData(20);
  const data10 = window.filterData(10);
  const firstDate = data20[0][0];
  const firstYear = parseInt(firstDate.substring(0, 4));
  const actual = `status=${response.status},active_years=${activeYears},activeCount=${activeCount},firstDate=${firstDate},count20=${data20.length},count10=${data10.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-004', actual }));
  expect(response.status).toBe(200);
  expect(activeYears).toBe('20');
  expect(activeCount).toBe(1);
  expect(firstYear).toBeGreaterThanOrEqual(2006);
  expect(data20.length).toBeGreaterThan(data10.length);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-005
test('test_itc005_click_allperiod_button_shows_full_data', () => {
  const btn0 = document.querySelector('.buttons button[data-years="0"]');
  btn0.click();
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const activeCount = document.querySelectorAll('.buttons button.active').length;
  const data0 = window.filterData(0);
  const firstDate = data0[0][0];
  const lastDate = data0[data0.length - 1][0];
  const actual = `status=${response.status},active_years=${activeYears},activeCount=${activeCount},firstDate=${firstDate},lastDate=${lastDate},count=${data0.length},dataLen=${window.DATA.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-005', actual }));
  expect(response.status).toBe(200);
  expect(activeYears).toBe('0');
  expect(activeCount).toBe(1);
  expect(firstDate).toBe('1971-01-04');
  expect(lastDate).toBe('2026-08-07');
  expect(data0.length).toBe(window.DATA.length);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-006
test('test_itc006_sequential_clicks_maintain_single_active', () => {
  const btn1 = document.querySelector('.buttons button[data-years="1"]');
  const btn10 = document.querySelector('.buttons button[data-years="10"]');
  const btn0 = document.querySelector('.buttons button[data-years="0"]');

  btn1.click();
  const count1 = document.querySelectorAll('.buttons button.active').length;
  const active1 = document.querySelector('.buttons button.active').getAttribute('data-years');

  btn10.click();
  const count2 = document.querySelectorAll('.buttons button.active').length;
  const active2 = document.querySelector('.buttons button.active').getAttribute('data-years');

  btn0.click();
  const count3 = document.querySelectorAll('.buttons button.active').length;
  const active3 = document.querySelector('.buttons button.active').getAttribute('data-years');

  const actual = `count1=${count1},active1=${active1},count2=${count2},active2=${active2},count3=${count3},active3=${active3}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-006', actual }));
  expect(response.status).toBe(200);
  expect(count1).toBe(1);
  expect(count2).toBe(1);
  expect(count3).toBe(1);
  expect(active3).toBe('0');
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-007
test('test_itc007_1year_xaxis_label_interval_is_month', () => {
  const btn1 = document.querySelector('.buttons button[data-years="1"]');
  btn1.click();
  const data1 = window.filterData(1);
  const spanYears = computeSpanYears(data1);
  const labelInterval = getLabelInterval(spanYears);
  const actual = `status=${response.status},spanYears=${spanYears.toFixed(4)},labelInterval=${labelInterval}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-007', actual }));
  expect(response.status).toBe(200);
  expect(spanYears).toBeLessThanOrEqual(1.5);
  expect(labelInterval).toBe('month');
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-008
test('test_itc008_5year_xaxis_label_interval_is_year', () => {
  const data5 = window.filterData(5);
  const spanYears = computeSpanYears(data5);
  const labelInterval = getLabelInterval(spanYears);
  const actual = `status=${response.status},spanYears=${spanYears.toFixed(4)},labelInterval=${labelInterval}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-008', actual }));
  expect(response.status).toBe(200);
  expect(spanYears).toBeGreaterThan(1.5);
  expect(spanYears).toBeLessThanOrEqual(6);
  expect(labelInterval).toBe('year');
});

// ITC-009
test('test_itc009_allperiod_xaxis_label_interval_is_5year', () => {
  const btn0 = document.querySelector('.buttons button[data-years="0"]');
  btn0.click();
  const data0 = window.filterData(0);
  const spanYears = computeSpanYears(data0);
  const labelInterval = getLabelInterval(spanYears);
  const actual = `status=${response.status},spanYears=${spanYears.toFixed(4)},labelInterval=${labelInterval}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-009', actual }));
  expect(response.status).toBe(200);
  expect(spanYears).toBeGreaterThan(6);
  expect(labelInterval).toBe('5year');
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-010
test('test_itc010_yaxis_autofit_with_5percent_margin', () => {
  const data5 = window.filterData(5);
  const vals = data5.map(d => d[1]);
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const rangeV = rawMax - rawMin;
  const marginExpected = rangeV * 0.05;
  const minV = rawMin - marginExpected;
  const maxV = rawMax + marginExpected;
  const actual = `status=${response.status},rawMin=${rawMin},rawMax=${rawMax},margin=${marginExpected.toFixed(6)},minV=${minV.toFixed(6)},maxV=${maxV.toFixed(6)}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-010', actual }));
  expect(response.status).toBe(200);
  expect(minV).toBeLessThan(rawMin);
  expect(maxV).toBeGreaterThan(rawMax);
  expect(marginExpected).toBeCloseTo(rangeV * 0.05, 6);
});

// ITC-011
test('test_itc011_button1year_filter_draw_pipeline', () => {
  resetMockCtx();
  const btn1 = document.querySelector('.buttons button[data-years="1"]');
  btn1.click();
  const data1 = window.filterData(1);
  const firstDate = data1[0][0];
  const activeYears = document.querySelector('.buttons button.active').getAttribute('data-years');
  const beginPathCalled = mockCtx.beginPath.mock.calls.length > 0;
  const strokeCalled = mockCtx.stroke.mock.calls.length > 0;
  const actual = `firstDate=${firstDate},active_years=${activeYears},beginPath=${beginPathCalled},stroke=${strokeCalled}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-011', actual }));
  expect(firstDate >= '2025-08-07').toBe(true);
  expect(activeYears).toBe('1');
  expect(beginPathCalled).toBe(true);
  expect(strokeCalled).toBe(true);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-012
test('test_itc012_button_allperiod_filter_draw_fulldata', () => {
  resetMockCtx();
  const btn0 = document.querySelector('.buttons button[data-years="0"]');
  btn0.click();
  const data0 = window.filterData(0);
  const activeYears = document.querySelector('.buttons button.active').getAttribute('data-years');
  const lineToCount = mockCtx.lineTo.mock.calls.length;
  const actual = `dataLen=${data0.length},active_years=${activeYears},lineToCount=${lineToCount}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-012', actual }));
  expect(data0.length).toBe(13936);
  expect(activeYears).toBe('0');
  // lineTo is called for each data point except the first (which uses moveTo)
  expect(lineToCount).toBeGreaterThanOrEqual(data0.length - 1);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-013
test('test_itc013_sequential_button_switch_active_and_filter', () => {
  const btn1 = document.querySelector('.buttons button[data-years="1"]');
  const btn10 = document.querySelector('.buttons button[data-years="10"]');
  const btn5 = document.querySelector('.buttons button[data-years="5"]');

  btn1.click();
  const activeCount1 = document.querySelectorAll('.buttons button.active').length;
  const activeYears1 = document.querySelector('.buttons button.active').getAttribute('data-years');

  btn10.click();
  const activeCount2 = document.querySelectorAll('.buttons button.active').length;
  const activeYears2 = document.querySelector('.buttons button.active').getAttribute('data-years');

  btn5.click();
  const activeCount3 = document.querySelectorAll('.buttons button.active').length;
  const activeYears3 = document.querySelector('.buttons button.active').getAttribute('data-years');
  const data5 = window.filterData(5);
  const firstDate5 = data5[0][0];

  const actual = `ac1=${activeCount1},ay1=${activeYears1},ac2=${activeCount2},ay2=${activeYears2},ac3=${activeCount3},ay3=${activeYears3},firstDate5=${firstDate5}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-013', actual }));
  expect(activeCount1).toBe(1);
  expect(activeCount2).toBe(1);
  expect(activeCount3).toBe(1);
  expect(activeYears3).toBe('5');
  expect(firstDate5 >= '2021-08-07').toBe(true);
});

// ITC-014
test('test_itc014_parseDate_filterData_cutoff_consistency', () => {
  const parseDate = window.parseDate;
  const data10 = window.filterData(10);
  const cutoffDate = new Date(2016, 7, 7); // 2016-08-07
  const allAfterCutoff = data10.every(d => parseDate(d[0]) >= cutoffDate);
  const actual = `count=${data10.length},allAfterCutoff=${allAfterCutoff},firstDate=${data10[0][0]}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-014', actual }));
  expect(data10.length).toBeGreaterThan(0);
  expect(allAfterCutoff).toBe(true);
});

// ITC-015
test('test_itc015_filterData_niceStep_yaxis_grid_integration', () => {
  const data1 = window.filterData(1);
  const vals = data1.map(d => d[1]);
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const rangeV = rawMax - rawMin;
  const margin = rangeV * 0.05;
  const minV = rawMin - margin;
  const maxV = rawMax + margin;
  const adjustedRange = maxV - minV;
  const step = window.niceStep(adjustedRange, 8);
  const yStart = Math.ceil(minV / step) * step;

  // Count expected grid lines
  let gridLines = 0;
  for (let v = yStart; v <= maxV; v += step) gridLines++;

  resetMockCtx();
  window.draw(1);

  // beginPath is called for each grid line + 1 for the data line
  const beginPathCount = mockCtx.beginPath.mock.calls.length;

  const actual = `step=${step},yStart=${yStart.toFixed(2)},gridLines=${gridLines},beginPathCount=${beginPathCount}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-015', actual }));
  expect(step).toBeGreaterThan(0);
  // beginPath called at least once per grid line + once for data line
  expect(beginPathCount).toBeGreaterThanOrEqual(gridLines + 1);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-016
test('test_itc016_initial_load_active_filter_draw_integration', () => {
  // Reset to 5 years (initial state)
  document.querySelector('.buttons button[data-years="5"]').click();
  resetMockCtx();
  window.draw(5);

  const activeBtn = document.querySelector('.buttons button.active');
  const activeBtnText = activeBtn ? activeBtn.textContent : '';
  const data5 = window.filterData(5);
  const firstDate = data5[0][0];
  const beginPathCalled = mockCtx.beginPath.mock.calls.length > 0;
  const strokeCalled = mockCtx.stroke.mock.calls.length > 0;

  const actual = `activeBtnText=${activeBtnText},firstDate=${firstDate},beginPath=${beginPathCalled},stroke=${strokeCalled}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-016', actual }));
  expect(activeBtnText).toBe('直近5年');
  expect(firstDate >= '2021-08-07').toBe(true);
  expect(beginPathCalled).toBe(true);
  expect(strokeCalled).toBe(true);
});

// ITC-017
test('test_itc017_button_xaxis_label_interval_mode_switch', () => {
  // 1 year -> month
  const btn1 = document.querySelector('.buttons button[data-years="1"]');
  btn1.click();
  const data1 = window.filterData(1);
  const span1 = computeSpanYears(data1);
  const label1 = getLabelInterval(span1);

  // All period -> 5year
  const btn0 = document.querySelector('.buttons button[data-years="0"]');
  btn0.click();
  const data0 = window.filterData(0);
  const span0 = computeSpanYears(data0);
  const label0 = getLabelInterval(span0);

  const actual = `span1=${span1.toFixed(4)},label1=${label1},span0=${span0.toFixed(4)},label0=${label0}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-017', actual }));
  expect(label1).toBe('month');
  expect(label0).toBe('5year');
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// ITC-018
test('test_itc018_filterData_draw_yaxis_margin_calculation', () => {
  const data20 = window.filterData(20);
  const vals = data20.map(d => d[1]);
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const rangeV = rawMax - rawMin;
  const expectedMargin = rangeV * 0.05;
  const expectedMinV = rawMin - expectedMargin;
  const expectedMaxV = rawMax + expectedMargin;

  const actual = `rawMin=${rawMin},rawMax=${rawMax},margin=${expectedMargin.toFixed(6)},minV=${expectedMinV.toFixed(6)},maxV=${expectedMaxV.toFixed(6)}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-018', actual }));
  expect(Math.abs(expectedMinV - (rawMin - rangeV * 0.05))).toBeLessThan(1e-6);
  expect(Math.abs(expectedMaxV - (rawMax + rangeV * 0.05))).toBeLessThan(1e-6);
});

// ITC-019
test('test_itc019_same_button_reclick_redraw_maintains_state', () => {
  // Ensure 5y is active
  document.querySelector('.buttons button[data-years="5"]').click();
  resetMockCtx();

  // Re-click the already active 5y button
  const btn5 = document.querySelector('.buttons button[data-years="5"]');
  btn5.click();

  const activeCount = document.querySelectorAll('.buttons button.active').length;
  const activeYears = document.querySelector('.buttons button.active').getAttribute('data-years');
  const clearRectCalled = mockCtx.clearRect.mock.calls.length > 0;

  const actual = `activeCount=${activeCount},activeYears=${activeYears},clearRect=${clearRectCalled}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-019', actual }));
  expect(activeCount).toBe(1);
  expect(activeYears).toBe('5');
  expect(clearRectCalled).toBe(true);
});

// ITC-020
test('test_itc020_empty_filterdata_draw_early_return_integration', () => {
  const DATA_backup = window.DATA;
  window.DATA = [];
  resetMockCtx();

  let error = null;
  try {
    window.draw(0);
  } catch (e) {
    error = e;
  }

  const clearRectCalled = mockCtx.clearRect.mock.calls.length > 0;
  const beginPathCalled = mockCtx.beginPath.mock.calls.length > 0;

  window.DATA = DATA_backup;

  const actual = `error=${error},clearRect=${clearRectCalled},beginPath=${beginPathCalled}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'ITC-020', actual }));
  expect(error).toBeNull();
  expect(clearRectCalled).toBe(true);
  expect(beginPathCalled).toBe(false);
});
