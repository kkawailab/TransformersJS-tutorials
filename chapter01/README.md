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
