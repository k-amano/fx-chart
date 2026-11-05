# テストレポート（結合テスト）

| 項目 | 値 |
|---|---|
| 実行日時 | 2026-11-05 11:09:14 UTC |
| テストコマンド | `npm test -- --watchAll=false --verbose 2>&1` |
| 結果 | ✅ PASS |
| リトライ回数 | 0 |
| サマリー | 20 passed, 0 failed |

## テスト結果集計表

| TC-ID | テスト項目 | 期待出力 | 実際の出力 | 判定 | 実行日時 |
|---|---|---|---|---|---|
| ITC-001 | 初期表示時に「直近5年」ボタンがactive状態で、filterData(5)が2021年以降のデータのみを返し、canvasにdrawが実行されること | HTTP 200、button.active の data-years='5'、filterData(5) の先頭日付が2021年以降、データ件数 > 0 | status=200,active_years=5,firstDate=2021-08-09,count=1250 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-002 | 「直近1年」ボタンをクリックすると、activeクラスが当該ボタンのみに付与され、filterData(1)が直近1年分のデータを返すこと | HTTP 200、active ボタンが data-years='1' のみ、filterData(1) の先頭日付が2025年以降、データ件数 > 0 かつ filterData(5) より少ない | status=200,active_years=1,activeCount=1,firstDate=2025-08-07,count1=251,count5=1250 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-003 | 「直近10年」ボタンをクリックすると、activeクラスが当該ボタンのみに付与され、filterData(10)が直近10年分のデータを返すこと | HTTP 200、active ボタンが data-years='10' のみ、filterData(10) の先頭日付が2016年以降、データ件数 > filterData(5) の件数 | status=200,active_years=10,activeCount=1,firstDate=2016-08-08,count10=2497,count5=1250 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-004 | 「直近20年」ボタンをクリックすると、activeクラスが当該ボタンのみに付与され、filterData(20)が直近20年分のデータを返すこと | HTTP 200、active ボタンが data-years='20' のみ、filterData(20) の先頭日付が2006年以降、データ件数 > filterData(10) の件数 | status=200,active_years=20,activeCount=1,firstDate=2006-08-07,count20=5011,count10=2497 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-005 | 「全期間」ボタンをクリックすると、activeクラスが当該ボタンのみに付与され、filterData(0)がDATA全件を返すこと | HTTP 200、active ボタンが data-years='0' のみ、filterData(0) の先頭日付が'1971-01-04'、最終日付が'2026-08-07'、件数 = DATA.length | status=200,active_years=0,activeCount=1,firstDate=1971-01-04,lastDate=2026-08-07,count=13936,dataLen=13936 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-006 | 複数ボタンを順番にクリックした際、常にactiveクラスが1つのボタンにのみ付与されること | HTTP 200、各クリック後に button.active の個数が常に1、最終的に data-years='0' のボタンのみがactive | count1=1,active1=1,count2=1,active2=10,count3=1,active3=0 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-007 | 直近1年表示時、X軸ラベル間隔の判定ロジックがspanYears<=1.5を満たし'month'モードになること | HTTP 200、filterData(1) のデータ期間が1.5年以下、labelInterval相当の判定が'month' | status=200,spanYears=0.9993,labelInterval=month | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-008 | 直近5年表示時、X軸ラベル間隔の判定ロジックがspanYears<=6を満たし'year'モードになること | HTTP 200、filterData(5) のデータ期間が1.5超〜6以下、labelInterval相当の判定が'year' | status=200,spanYears=4.9938,labelInterval=year | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-009 | 全期間表示時、X軸ラベル間隔の判定ロジックがspanYears>6を満たし'5year'モードになること | HTTP 200、filterData(0) のデータ期間が6超（約55年）、labelInterval相当の判定が'5year' | status=200,spanYears=55.5893,labelInterval=5year | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-010 | 各期間選択時にY軸の表示範囲がデータの最小値-5%〜最大値+5%に自動調整されること | HTTP 200、Y軸下限がデータ最小値より小さい、Y軸上限がデータ最大値より大きい、余白がrange*0.05に一致 | status=200,rawMin=109.26,rawMax=163.86,margin=2.730000,minV=106.530000,maxV=166.590000 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-011 | 「直近1年」ボタンクリック後、filterDataが1年分のデータを返しdrawがキャンバスに描画する | filterData(1)の先頭日付≧2025-08-07、activeボタンのdata-years='1'、ctx.bindbindPath/strokeが呼ばれている | firstDate=2025-08-07,active_years=1,beginPath=true,stroke=true | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-012 | 「全期間」ボタンクリック後、全DATAがdrawに渡されキャンバスに描画される | filterData(0).length===13936、activeボタンのdata-years='0'、ctx.bindPath/lineToが13936回以上呼ばれている | dataLen=13936,active_years=0,lineToCount=13941 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-013 | 1年→10年→5年とボタンを連続切替し、各切替後にactive状態とフィルタ結果が正しく更新される | 各段階でactive数===1、最終activeのdata-years='5'、filterData(5)先頭日付≧2021-08-07 | ac1=1,ay1=1,ac2=1,ay2=10,ac3=1,ay3=5,firstDate5=2021-08-09 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-014 | filterData内部でparseDateが正しく日付解析しカットオフ比較が機能する | 全要素のparseDate(d[0])>=new Date(2016,7,7)、配列長>0 | count=2497,allAfterCutoff=true,firstDate=2016-08-08 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-015 | filterData(1)の値域からniceStepが適切なステップを算出しY軸グリッドが描画される | niceStepの返却値>0、Y軸gridラインがyStart〜maxVの範囲でstep刻みで描画されている | step=2,yStart=146.00,gridLines=10,beginPathCount=11 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-016 | ページロード時にactiveボタン=5年、filterData(5)、draw(5)が連携して正しく初期表示される | activeボタンtext='直近5年'、filterData(5)先頭日付≧2021-08-07、ctx.bindPath/strokeが呼ばれている | activeBtnText=直近5年,firstDate=2021-08-09,beginPath=true,stroke=true | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-017 | 「直近1年」選択時はX軸が月表示、「全期間」選択時は5年刻み表示になる | 1年:labelInterval='month'、全期間:labelInterval='5year' | span1=0.9993,label1=month,span0=55.5893,label0=5year | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-018 | filterData(20)の値域に対しdrawが5%マージンを正しく適用する | 描画用minV===rawMin-range*0.05、描画用maxV===rawMax+range*0.05（誤差1e-6以内） | rawMin=75.72,rawMax=163.86,margin=4.407000,minV=71.313000,maxV=168.267000 | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-019 | 既にactiveな5年ボタンを再クリックしてもactive状態が維持されdrawが再実行される | active数===1、activeボタンdata-years='5'、ctx.clearRectが呼ばれ再描画されている | activeCount=1,activeYears=5,clearRect=true | ✅ PASSED | 2026-11-05 11:09:14 UTC |
| ITC-020 | filterData(-1)が空配列を返した場合、drawが早期リターンしキャンバスがクリアされたまま残る | filterDataが空配列を返却、ctx.bindPath未呼び出し、ctx.clearRectのみ実行 | error=null,clearRect=true,beginPath=false | ✅ PASSED | 2026-11-05 11:09:14 UTC |

## テスト実行ログ

```
ry_oldest_date (1 ms)
  ✓ test_tc023_parseDate_abnormal_invalid_string
  ✓ test_tc024_filterData_normal_1year (13 ms)
  ✓ test_tc025_filterData_boundary_all_period (4 ms)
  ✓ test_tc026_filterData_abnormal_negative_years (13 ms)
  ✓ test_tc027_niceStep_normal_range100
  ✓ test_tc028_niceStep_boundary_small_range (2 ms)
  ✓ test_tc029_button_click_normal_10year_active (31 ms)
  ✓ test_tc030_draw_abnormal_empty_data_early_return (3 ms)
  ✓ test_tc031_niceStep_small_range (4 ms)
  ✓ test_tc032_niceStep_large_range (1 ms)
  ✓ test_tc033_parseDate_leap_year (1 ms)
  ✓ test_tc034_parseDate_year_end_boundary
  ✓ test_tc035_filterData_one_year_cutoff (12 ms)
  ✓ test_tc036_filterData_all_data (1 ms)
  ✓ test_tc037_draw_empty_data_no_error (2 ms)
  ✓ test_tc038_button_active_toggle_10years (36 ms)
  ✓ test_tc039_niceStep_single_tick (1 ms)
  ✓ test_tc040_draw_all_period_yaxis_margin (2 ms)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-006","actual":"count1=1,active1=1,count2=1,active2=10,count3=1,active3=0"}

      at Object.log (index.integration.test.js:207:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-007","actual":"status=200,spanYears=0.9993,labelInterval=month"}

      at Object.log (index.integration.test.js:225:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-008","actual":"status=200,spanYears=4.9938,labelInterval=year"}

      at Object.log (index.integration.test.js:239:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-009","actual":"status=200,spanYears=55.5893,labelInterval=5year"}

      at Object.log (index.integration.test.js:254:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-010","actual":"status=200,rawMin=109.26,rawMax=163.86,margin=2.730000,minV=106.530000,maxV=166.590000"}

      at Object.log (index.integration.test.js:273:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-011","actual":"firstDate=2025-08-07,active_years=1,beginPath=true,stroke=true"}

      at Object.log (index.integration.test.js:291:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-012","actual":"dataLen=13936,active_years=0,lineToCount=13941"}

      at Object.log (index.integration.test.js:309:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-013","actual":"ac1=1,ay1=1,ac2=1,ay2=10,ac3=1,ay3=5,firstDate5=2021-08-09"}

      at Object.log (index.integration.test.js:339:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-014","actual":"count=2497,allAfterCutoff=true,firstDate=2016-08-08"}

      at Object.log (index.integration.test.js:354:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-015","actual":"step=2,yStart=146.00,gridLines=10,beginPathCount=11"}

      at Object.log (index.integration.test.js:384:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-016","actual":"activeBtnText=直近5年,firstDate=2021-08-09,beginPath=true,stroke=true"}

      at Object.log (index.integration.test.js:407:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-017","actual":"span1=0.9993,label1=month,span0=55.5893,label0=5year"}

      at Object.log (index.integration.test.js:431:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-018","actual":"rawMin=75.72,rawMax=163.86,margin=4.407000,minV=71.313000,maxV=168.267000"}

      at Object.log (index.integration.test.js:450:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-019","actual":"activeCount=1,activeYears=5,clearRect=true"}

      at Object.log (index.integration.test.js:470:11)

  console.log
    XOLVIEN_RESULT:{"tc_id":"ITC-020","actual":"error=null,clearRect=true,beginPath=false"}

      at Object.log (index.integration.test.js:495:11)

PASS ./index.integration.test.js (5.378 s)
  ✓ test_itc001_initial_load_5year_active_and_data_filtered (46 ms)
  ✓ test_itc002_click_1year_button_filters_and_redraws (58 ms)
  ✓ test_itc003_click_10year_button_filters_and_redraws (59 ms)
  ✓ test_itc004_click_20year_button_filters_and_redraws (63 ms)
  ✓ test_itc005_click_allperiod_button_shows_full_data (41 ms)
  ✓ test_itc006_sequential_clicks_maintain_single_active (59 ms)
  ✓ test_itc007_1year_xaxis_label_interval_is_month (46 ms)
  ✓ test_itc008_5year_xaxis_label_interval_is_year (22 ms)
  ✓ test_itc009_allperiod_xaxis_label_interval_is_5year (34 ms)
  ✓ test_itc010_yaxis_autofit_with_5percent_margin (13 ms)
  ✓ test_itc011_button1year_filter_draw_pipeline (48 ms)
  ✓ test_itc012_button_allperiod_filter_draw_fulldata (33 ms)
  ✓ test_itc013_sequential_button_switch_active_and_filter (68 ms)
  ✓ test_itc014_parseDate_filterData_cutoff_consistency (15 ms)
  ✓ test_itc015_filterData_niceStep_yaxis_grid_integration (41 ms)
  ✓ test_itc016_initial_load_active_filter_draw_integration (37 ms)
  ✓ test_itc017_button_xaxis_label_interval_mode_switch (65 ms)
  ✓ test_itc018_filterData_draw_yaxis_margin_calculation (14 ms)
  ✓ test_itc019_same_button_reclick_redraw_maintains_state (32 ms)
  ✓ test_itc020_empty_filterdata_draw_early_return_integration (2 ms)

Test Suites: 2 passed, 2 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        5.93 s
Ran all test suites.
```
