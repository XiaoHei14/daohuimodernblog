---
title: '打造獨屬於我的Agent基金經理人'
description: 'De limitationibus et methodologia investigandi systematis multi-agentes ac distributionis quantitativae in mercato stockario Taivaniae.'
pubDate: 'Oct 10 2026'
heroImage: 'https://i.pinimg.com/1200x/6b/5d/37/6b5d374089a772e16092d33ba971a632.jpg'
tags: ['AI', 'Quant', 'FinTech', 'Portfolio-Management']
---

## 12. Research Limitations & Methodology

### 12.1 Market-Specific Limitations

本專案以台灣上市與上櫃股票為研究對象。既有金融 AI Agent 與量化投資研究可作為架構設計的參考，但其研究結果不應直接視為適用於台灣市場。

不同市場在交易制度、投資人結構、流動性、交易成本與價格限制等方面存在差異。

研究時應特別考慮：

- **Price Limits：** 台股的漲跌幅限制可能影響成交機會、價格形成與策略執行。
- **Market Microstructure：** 不同市場的流動性、成交量分布及投資人組成可能影響策略表現。
- **Transaction Costs：** 應納入手續費、證券交易稅、滑價與其他適用成本。
- **Data Availability：** 財報公告時間、歷史資料完整性及資料更新頻率可能影響因子計算。
- **Execution Constraints：** 回測必須考慮實際交易制度與成交可行性，而非假設所有訊號都能立即成交。

因此，文獻中的策略績效與實驗結論，必須在台股資料上重新測試後，才能評估其適用性。

### 12.2 Research Objective Alignment

本專案的目標是建立以 **長多（Long-Only）、受限制的投資組合配置** 為核心的研究系統，而不是直接複製每日多空交易策略。

兩者在研究目標與評估方式上存在差異：

| Dimension | 部分既有研究 | Agent Quant Manager |
|---|---|---|
| 市場 | 依各論文的研究對象而異 | 台灣上市與上櫃股票 |
| 策略方向 | 依論文設計，可能包含多空策略 | 長多配置 |
| 決策目標 | 可能以短期預測或交易績效為主 | 受限制的投資組合配置 |
| LLM 職責 | 依研究設計，可能直接產生交易決策 | 提供分析與配置建議 |
| 權重計算 | 依論文方法而異 | 由量化最佳化器計算 |
| 風險控制 | 依論文方法而異 | 獨立風險規則與驗證程序 |

文獻應依照其實際研究方法引用，不應將不同策略問題視為可以直接互換。

### 12.3 Separation of Responsibilities

本專案採用較保守的決策架構，將 LLM 分析、數值最佳化與規則驗證分離。

1. **Gemini Multi-Agent — Research & Analysis**

   分析市場資料、整理研究假設、比較個股及提出配置建議。所有結論應有可追溯的資料依據。

2. **Portfolio Optimizer — Quantitative Allocation**

   根據預期報酬、風險估計、配置限制與最佳化目標計算投資組合權重。LLM 不直接取代數值最佳化。

3. **Risk Manager — Risk Evaluation**

   評估投資組合波動、最大回撤、個股集中度與其他預先定義的風險指標。

4. **Validation Layer — Independent Checks**

   透過 Python 程式檢查資料完整性、權重限制、交易規則與輸出格式。驗證結果不應只依賴另一個使用相同 Gemini 模型的 Agent。

這種分工的目的是降低模型幻覺與不受限制的交易決策風險，但不能保證策略獲利，也不能完全消除模型與量化估計的錯誤。

### 12.4 Baseline Comparison

為了評估 Multi-Agent 架構是否真正帶來增益，本專案應建立簡單且可重現的基準策略（Baseline），再與完整系統比較。

建議至少包含：

| Baseline | Purpose |
|---|---|
| Equal-Weight Portfolio | 評估複雜策略是否優於簡單等權配置 |
| Mean-Variance Optimization | 評估傳統風險報酬最佳化的表現 |
| Market Benchmark | 比較策略相對於台股市場基準的績效 |
| Gemini Multi-Agent Portfolio | 評估 LLM 分析與 Agent 協作的增量效果 |

Mean-Variance Optimization 應使用與其他策略相同的股票池、資料截止時間、交易成本及配置限制，避免比較條件不一致。

### 12.5 Sample Size & Evaluation Period

本專案初期研究股票池預計涵蓋上市市值前 100 大與上櫃市值前 50 大個股，共約 150 檔股票。

然而，股票數量不等於有效樣本數。若歷史期間過短、只涵蓋單一市場環境，或反覆依據回測結果調整策略，即使績效優異，也可能源自偶然性或過度擬合。

研究時應注意：

- 使用足夠長的歷史資料，涵蓋不同市場環境。
- 依照當時可取得的資料建立歷史股票池，避免存活者偏差（Survivorship Bias）。
- 嚴格區分訓練期、驗證期及樣本外測試期。
- 將交易成本、滑價與成交限制納入回測。
- 保留基準策略，避免只展示完整系統的績效。
- 報告報酬、波動、最大回撤、Sharpe Ratio、換手率及交易成本。
- 記錄策略版本與參數變更，避免反覆調參後只報告最佳結果。

### 12.6 Evaluation Criteria

本專案不以單一報酬率作為策略成功的唯一標準，而是同時評估：

- **Return：** 投資報酬與相對基準的超額報酬。
- **Risk：** 波動、最大回撤及持倉集中度。
- **Robustness：** 不同期間與市場環境下的穩定性。
- **Execution Feasibility：** 成交限制、滑價與交易成本。
- **Reproducibility：** 是否能使用相同資料與設定重現結果。
- **Incremental Value：** 加入 Gemini Multi-Agent 後，相較於簡單基準策略是否產生可驗證的改善。

最終目標是驗證 LLM Agent 是否能在既定的台股投資限制下，為傳統量化投資流程帶來實際且可重現的研究價值，而非預設 AI 一定能優於傳統方法。
