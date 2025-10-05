# 第1章：はじめてのTransformers.js

## Transformers.jsとは

Transformers.jsは、Hugging Faceの人気ライブラリ「Transformers」をJavaScriptに移植したライブラリです。ブラウザやNode.js環境で、サーバーレスでAI・機械学習モデルを実行できます。

### 特徴
- **ブラウザで動作**: サーバー不要でクライアントサイドで完結
- **豊富なモデル**: テキスト、画像、音声処理など多様なタスクに対応
- **簡単な使用**: パイプラインAPIで数行のコードで実装可能

## セットアップ方法

### CDNから読み込む（推奨）

```html
<script type="module">
  import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
</script>
```

### npmでインストール

```bash
npm install @xenova/transformers
```

## 基本サンプル：感情分析

このサンプルでは、入力されたテキストの感情（ポジティブ/ネガティブ）を分析します。

### デモ
[index.html](./index.html) - ブラウザで開いて試してみてください

### 学習ポイント
- Transformers.jsの基本的な読み込み方
- pipelineの使い方
- 非同期処理の扱い方
- モデルの初回ロード時のキャッシング

## コード解説

### 1. ライブラリのインポート

```javascript
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
```

- `pipeline`: モデルを簡単に使うための関数
- `env`: 環境設定用のオブジェクト

### 2. 環境設定

```javascript
env.allowLocalModels = false;
```

ローカルモデルのチェックを無効化し、オンラインからモデルを取得します。

### 3. パイプラインの作成

```javascript
classifier = await pipeline('sentiment-analysis');
```

- **第1引数**: タスクタイプ（`'sentiment-analysis'` = 感情分析）
- **戻り値**: 感情分析用の関数
- `await`が必要（非同期処理）

### 4. 感情分析の実行

```javascript
const result = await classifier(text);
// 結果例: [{ label: 'POSITIVE', score: 0.9998 }]
```

**返り値の構造:**
- `label`: 感情ラベル（'POSITIVE' または 'NEGATIVE'）
- `score`: 信頼度スコア（0〜1の範囲）

### 5. 結果の表示

```javascript
const { label, score } = result[0];
const percentage = (score * 100).toFixed(2);
```

スコアをパーセンテージに変換して、ユーザーフレンドリーに表示します。

## よくある質問

**Q: 初回実行が遅いのはなぜ？**
A: モデルをダウンロードしてキャッシュに保存しているためです。2回目以降は高速に動作します。

**Q: オフラインでも動作しますか？**
A: 一度モデルをダウンロードすれば、ブラウザのキャッシュから読み込まれるため、オフラインでも動作します。

**Q: 日本語のテキストは分析できますか？**
A: デフォルトモデルは英語専用ですが、多言語対応モデルを指定することで日本語も分析できます：
```javascript
classifier = await pipeline('sentiment-analysis', 'nlptown/bert-base-multilingual-uncased-sentiment');
```
