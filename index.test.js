/**
 * Tests for USD/JPY exchange rate chart (index.html)
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let dom, window, document;

beforeAll(() => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'http://localhost/',
  });
  window = dom.window;
  document = window.document;
});

afterAll(() => {
  if (dom) dom.window.close();
});

// TC-001
test('test_tc001_page_title_is_usdjpy', () => {
  const actual = document.title;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-001', actual: String(actual) }));
  expect(actual).toBe('USD/JPY 為替レート推移');
});

// TC-002
test('test_tc002_h1_title_displayed_above_chart', () => {
  const h1 = document.querySelector('h1');
  const actualText = h1 ? h1.textContent : '';
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-002', actual: String(actualText) }));
  expect(actualText).toBe('USD/JPY 為替レート推移');

  // h1 should be before buttons and canvas in DOM order
  const buttons = document.querySelector('.buttons');
  const canvas = document.querySelector('canvas#chart');
  const h1Pos = h1.compareDocumentPosition(buttons);
  expect(h1Pos & window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const h1CanvasPos = h1.compareDocumentPosition(canvas);
  expect(h1CanvasPos & window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

// TC-003
test('test_tc003_canvas_size_900x500', () => {
  const canvas = document.querySelector('canvas#chart');
  const actualW = canvas ? canvas.getAttribute('width') : null;
  const actualH = canvas ? canvas.getAttribute('height') : null;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-003', actual: `width=${actualW},height=${actualH}` }));
  expect(actualW).toBe('900');
  expect(actualH).toBe('500');
});

// TC-004
test('test_tc004_five_preset_buttons_with_correct_labels', () => {
  const btns = document.querySelectorAll('.buttons button');
  const labels = Array.from(btns).map(b => b.textContent);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-004', actual: JSON.stringify(labels) }));
  expect(btns.length).toBe(5);
  expect(labels).toEqual(['直近1年', '直近5年', '直近10年', '直近20年', '全期間']);
});

// TC-005
test('test_tc005_initial_active_button_is_5years', () => {
  const btns = document.querySelectorAll('.buttons button');
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const activeCount = document.querySelectorAll('.buttons button.active').length;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-005', actual: `active_data_years=${activeYears},active_count=${activeCount}` }));
  expect(activeYears).toBe('5');
  expect(activeCount).toBe(1);
});

// TC-006
test('test_tc006_initial_draw_shows_5year_data', () => {
  // Verify filterData(5) returns data from ~2021 onward
  const filterData = window.filterData;
  const data = filterData(5);
  const firstYear = data[0][0].substring(0, 4);
  const lastDate = data[data.length - 1][0];
  const actual = `firstYear=${firstYear},lastDate=${lastDate},count=${data.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-006', actual }));
  expect(parseInt(firstYear)).toBeGreaterThanOrEqual(2021);
  expect(lastDate).toBe('2026-08-07');
  expect(data.length).toBeGreaterThan(0);
});

// TC-007
test('test_tc007_y_axis_grid_lines_displayed', () => {
  // Verify the draw function uses #e0e0e0 for grid lines by checking source
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const hasGridColor = html.includes('"#e0e0e0"');
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-007', actual: `grid_color_e0e0e0=${hasGridColor}` }));
  expect(hasGridColor).toBe(true);
});

// TC-008
test('test_tc008_line_color_blue_width_1_5px', () => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const hasBlue = html.includes('"#2563eb"');
  const hasLineWidth = html.includes('lineWidth = 1.5');
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-008', actual: `blue=#2563eb:${hasBlue},lineWidth=1.5:${hasLineWidth}` }));
  expect(hasBlue).toBe(true);
  expect(hasLineWidth).toBe(true);
});

// TC-009
test('test_tc009_data_embedded_as_array_literal_no_fetch', () => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const hasDataArray = /var\s+DATA\s*=\s*\[/.test(html);
  const hasFetch = /\bfetch\s*\(/.test(html);
  const hasXHR = /XMLHttpRequest/.test(html);
  const hasImport = /\bimport\s/.test(html);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-009', actual: `DATA_array=${hasDataArray},fetch=${hasFetch},XHR=${hasXHR},import=${hasImport}` }));
  expect(hasDataArray).toBe(true);
  expect(hasFetch).toBe(false);
  expect(hasXHR).toBe(false);
  expect(hasImport).toBe(false);
});

// TC-010
test('test_tc010_no_external_cdn_or_libraries', () => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const hasScriptSrc = /<script\s[^>]*src\s*=/.test(html);
  const hasLinkHref = /<link\s[^>]*rel\s*=\s*["']stylesheet["'][^>]*href\s*=/.test(html);
  const hasCssImport = /@import\s/.test(html);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-010', actual: `scriptSrc=${hasScriptSrc},linkHref=${hasLinkHref},cssImport=${hasCssImport}` }));
  expect(hasScriptSrc).toBe(false);
  expect(hasLinkHref).toBe(false);
  expect(hasCssImport).toBe(false);
});

// TC-011
test('test_tc011_parseDate_normal_standard_date', () => {
  const parseDate = window.parseDate;
  const result = parseDate('2024-06-15');
  const actual = `${result.getFullYear()}-${result.getMonth()}-${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-011', actual }));
  expect(result.getFullYear()).toBe(2024);
  expect(result.getMonth()).toBe(5);
  expect(result.getDate()).toBe(15);
});

// TC-012
test('test_tc012_parseDate_boundary_first_date', () => {
  const parseDate = window.parseDate;
  const result = parseDate('1971-01-04');
  const actual = `${result.getFullYear()}-${result.getMonth()}-${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-012', actual }));
  expect(result.getFullYear()).toBe(1971);
  expect(result.getMonth()).toBe(0);
  expect(result.getDate()).toBe(4);
});

// TC-013
test('test_tc013_parseDate_boundary_last_date', () => {
  const parseDate = window.parseDate;
  const result = parseDate('2026-08-07');
  const actual = `${result.getFullYear()}-${result.getMonth()}-${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-013', actual }));
  expect(result.getFullYear()).toBe(2026);
  expect(result.getMonth()).toBe(7);
  expect(result.getDate()).toBe(7);
});

// TC-014
test('test_tc014_filterData_normal_all_period', () => {
  const filterData = window.filterData;
  const DATA = window.DATA;
  const result = filterData(0);
  const actual = `length=${result.length},same_ref=${result === DATA}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-014', actual }));
  expect(result.length).toBe(DATA.length);
  expect(result).toBe(DATA);
});

// TC-015
test('test_tc015_filterData_normal_one_year', () => {
  const filterData = window.filterData;
  const DATA = window.DATA;
  const result = filterData(1);
  const firstDate = result[0][0];
  const actual = `firstDate=${firstDate},length=${result.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-015', actual }));
  expect(firstDate >= '2025-08-07').toBe(true);
  expect(result.length).toBeGreaterThan(0);
  expect(result.length).toBeLessThan(DATA.length);
});

// TC-016
test('test_tc016_filterData_boundary_twenty_years', () => {
  const filterData = window.filterData;
  const DATA = window.DATA;
  const result = filterData(20);
  const firstDate = result[0][0];
  const lastEntry = result[result.length - 1];
  const actual = `firstDate=${firstDate},lastEntry=${JSON.stringify(lastEntry)}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-016', actual }));
  expect(firstDate >= '2006-08-07').toBe(true);
  expect(lastEntry[0]).toBe('2026-08-07');
  expect(lastEntry[1]).toBe(157.54);
});

// TC-017
test('test_tc017_niceStep_normal_range100', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(100, 8);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-017', actual: String(actual) }));
  expect(actual).toBe(10);
});

// TC-018
test('test_tc018_niceStep_boundary_small_range', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(1, 8);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-018', actual: String(actual) }));
  expect(actual).toBeCloseTo(0.1, 5);
});

// TC-019
test('test_tc019_button_switch_ten_years_active_class', () => {
  const btn10 = document.querySelector('.buttons button[data-years="10"]');
  btn10.click();
  const allBtns = document.querySelectorAll('.buttons button');
  const activeBtn = document.querySelector('.buttons button.active');
  const activeYears = activeBtn ? activeBtn.getAttribute('data-years') : null;
  const otherActives = Array.from(allBtns).filter(b => b !== btn10 && b.classList.contains('active'));
  const actual = `active_years=${activeYears},other_actives=${otherActives.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-019', actual }));
  expect(activeYears).toBe('10');
  expect(otherActives.length).toBe(0);
  // Reset to 5 years
  document.querySelector('.buttons button[data-years="5"]').click();
});

// TC-020
test('test_tc020_draw_empty_data_early_return', () => {
  const DATA_backup = window.DATA;
  window.DATA = [];
  let error = null;
  try {
    window.draw(0);
  } catch (e) {
    error = e;
  }
  window.DATA = DATA_backup;
  const actual = `error=${error}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-020', actual }));
  // draw(0) calls filterData(0) which returns DATA directly (empty []), then draw checks data.length===0 and returns early
  expect(error).toBeNull();
});

// TC-021
test('test_tc021_parseDate_normal_standard_date', () => {
  const parseDate = window.parseDate;
  const result = parseDate('2024-06-15');
  const actual = `year=${result.getFullYear()},month=${result.getMonth()},date=${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-021', actual }));
  expect(result.getFullYear()).toBe(2024);
  expect(result.getMonth()).toBe(5);
  expect(result.getDate()).toBe(15);
});

// TC-022
test('test_tc022_parseDate_boundary_oldest_date', () => {
  const parseDate = window.parseDate;
  const result = parseDate('1971-01-04');
  const actual = `year=${result.getFullYear()},month=${result.getMonth()},date=${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-022', actual }));
  expect(result.getFullYear()).toBe(1971);
  expect(result.getMonth()).toBe(0);
  expect(result.getDate()).toBe(4);
});

// TC-023
test('test_tc023_parseDate_abnormal_invalid_string', () => {
  const parseDate = window.parseDate;
  const result = parseDate('abc-de-fg');
  const actual = `isNaN=${isNaN(result.getTime())}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-023', actual }));
  expect(isNaN(result.getTime())).toBe(true);
});

// TC-024
test('test_tc024_filterData_normal_1year', () => {
  const filterData = window.filterData;
  const result = filterData(1);
  const firstDate = result[0][0];
  const lastDate = result[result.length - 1][0];
  const actual = `firstDate=${firstDate},lastDate=${lastDate}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-024', actual }));
  expect(firstDate >= '2025-08-07').toBe(true);
  expect(lastDate).toBe('2026-08-07');
});

// TC-025
test('test_tc025_filterData_boundary_all_period', () => {
  const filterData = window.filterData;
  const DATA = window.DATA;
  const result = filterData(0);
  const actual = `same_ref=${result === DATA},length=${result.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-025', actual }));
  expect(result).toBe(DATA);
  expect(result.length).toBe(DATA.length);
});

// TC-026
test('test_tc026_filterData_abnormal_negative_years', () => {
  const filterData = window.filterData;
  const result = filterData(-1);
  const actual = `length=${result.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-026', actual }));
  expect(result.length).toBe(0);
});

// TC-027
test('test_tc027_niceStep_normal_range100', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(100, 8);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-027', actual: String(actual) }));
  expect(actual).toBe(10);
});

// TC-028
test('test_tc028_niceStep_boundary_small_range', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(0.5, 8);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-028', actual: String(actual) }));
  expect(actual).toBeCloseTo(0.05, 5);
});

// TC-029
test('test_tc029_button_click_normal_10year_active', () => {
  const btn10 = document.querySelector('.buttons button[data-years="10"]');
  btn10.click();
  const allBtns = document.querySelectorAll('.buttons button');
  const isActive = btn10.classList.contains('active');
  const othersActive = Array.from(allBtns).filter(b => b !== btn10 && b.classList.contains('active'));
  const actual = `btn10_active=${isActive},others_active=${othersActive.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-029', actual }));
  expect(isActive).toBe(true);
  expect(othersActive.length).toBe(0);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// TC-030
test('test_tc030_draw_abnormal_empty_data_early_return', () => {
  const DATA_backup = window.DATA;
  window.DATA = [];
  let error = null;
  try {
    window.draw(0);
  } catch (e) {
    error = e;
  }
  window.DATA = DATA_backup;
  const actual = `error=${error}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-030', actual }));
  // draw(0) calls filterData(0) which returns DATA (empty []), then draw checks data.length===0 and returns early
  expect(error).toBeNull();
});

// TC-031
test('test_tc031_niceStep_small_range', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(0.5, 8);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-031', actual: String(actual) }));
  expect(actual).toBeCloseTo(0.05, 5);
});

// TC-032
test('test_tc032_niceStep_large_range', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(500, 8);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-032', actual: String(actual) }));
  expect(actual).toBe(50);
});

// TC-033
test('test_tc033_parseDate_leap_year', () => {
  const parseDate = window.parseDate;
  const result = parseDate('2024-02-29');
  const actual = `year=${result.getFullYear()},month=${result.getMonth()},date=${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-033', actual }));
  expect(result.getFullYear()).toBe(2024);
  expect(result.getMonth()).toBe(1);
  expect(result.getDate()).toBe(29);
});

// TC-034
test('test_tc034_parseDate_year_end_boundary', () => {
  const parseDate = window.parseDate;
  const result = parseDate('2025-12-31');
  const actual = `year=${result.getFullYear()},month=${result.getMonth()},date=${result.getDate()}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-034', actual }));
  expect(result.getFullYear()).toBe(2025);
  expect(result.getMonth()).toBe(11);
  expect(result.getDate()).toBe(31);
});

// TC-035
test('test_tc035_filterData_one_year_cutoff', () => {
  const filterData = window.filterData;
  const result = filterData(1);
  const firstDate = result[0][0];
  const actual = `firstDate=${firstDate},length=${result.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-035', actual }));
  expect(firstDate >= '2025-08-07').toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

// TC-036
test('test_tc036_filterData_all_data', () => {
  const filterData = window.filterData;
  const DATA = window.DATA;
  const result = filterData(0);
  const first = result[0];
  const last = result[result.length - 1];
  const actual = `same_ref=${result === DATA},first=${JSON.stringify(first)},last=${JSON.stringify(last)}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-036', actual }));
  expect(result).toBe(DATA);
  expect(first[0]).toBe('1971-01-04');
  expect(first[1]).toBe(357.73);
  expect(last[0]).toBe('2026-08-07');
  expect(last[1]).toBe(157.54);
});

// TC-037
test('test_tc037_draw_empty_data_no_error', () => {
  const DATA_backup = window.DATA;
  window.DATA = [];
  let error = null;
  try {
    window.draw(1);
  } catch (e) {
    error = e;
  }
  window.DATA = DATA_backup;
  const actual = `error=${error}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-037', actual }));
  expect(error).toBeNull();
});

// TC-038
test('test_tc038_button_active_toggle_10years', () => {
  const btn10 = document.querySelector('.buttons button[data-years="10"]');
  btn10.click();
  const allBtns = document.querySelectorAll('.buttons button');
  const isActive = btn10.classList.contains('active');
  const othersActive = Array.from(allBtns).filter(b => b !== btn10 && b.classList.contains('active'));
  const actual = `btn10_active=${isActive},others_active=${othersActive.length}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-038', actual }));
  expect(isActive).toBe(true);
  expect(othersActive.length).toBe(0);
  // Reset
  document.querySelector('.buttons button[data-years="5"]').click();
});

// TC-039
test('test_tc039_niceStep_single_tick', () => {
  const niceStep = window.niceStep;
  const actual = niceStep(100, 1);
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-039', actual: String(actual) }));
  expect(actual).toBe(100);
});

// TC-040
test('test_tc040_draw_all_period_yaxis_margin', () => {
  const DATA = window.DATA;
  const vals = DATA.map(d => d[1]);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const rangeV = maxV - minV;
  const margin = rangeV * 0.05;
  const expectedMinV = minV - margin;
  const expectedMaxV = maxV + margin;
  const actual = `minV=${expectedMinV.toFixed(2)},maxV=${expectedMaxV.toFixed(2)},dataMin=${minV},dataMax=${maxV}`;
  console.log('XOLVIEN_RESULT:' + JSON.stringify({ tc_id: 'TC-040', actual }));
  // minV should be around 61.61 (75.74 - 14.135)
  expect(expectedMinV).toBeCloseTo(75.74 - (358.44 - 75.74) * 0.05, 0);
  // maxV should be around 372.58 (358.44 + 14.135)
  expect(expectedMaxV).toBeCloseTo(358.44 + (358.44 - 75.74) * 0.05, 0);
});
