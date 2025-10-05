# 第2章：テキスト分類

## テキスト分類とは

テキスト分類は、与えられたテキストを事前に定義されたカテゴリに分類するタスクです。スパムフィルタリング、トピック分類、言語検出など、様々な用途に使用されます。

## パイプラインの基本

Transformers.jsの`pipeline`関数は、複雑なモデル処理を簡単なAPIで提供します。

### パイプラインの構造
1. タスクタイプの指定（例：'text-classification'）
2. モデルの指定（オプション、デフォルトモデルが使用される）
3. 入力データの処理
4. 結果の取得

## このチュートリアルで学ぶこと

- Zero-Shot分類の使用方法
- カスタムラベルの設定
- 複数のテキストの一括処理
- 信頼度スコアの活用

### デモ
[index.html](./index.html) - ニュース記事のカテゴリ分類を試してみましょう

## コード解説

### 1. Zero-Shot分類パイプラインの作成

```javascript
classifier = await pipeline('zero-shot-classification');
```

**Zero-Shot分類とは？**
- 事前学習なしで、任意のカテゴリに分類できる
- カテゴリラベルを自由に指定可能
- 新しいカテゴリを追加しても再学習不要

### 2. カテゴリの準備

```javascript
const categories = categoriesText
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);
```

ユーザー入力をカンマで分割し、空白を除去して配列に変換します。

### 3. 分類の実行

```javascript
const result = await classifier(text, categories);
```

**パラメータ:**
- **第1引数**: 分類したいテキスト
- **第2引数**: カテゴリラベルの配列

**返り値の構造:**
```javascript
{
  labels: ['science', 'technology', 'sports', ...],  // スコアの高い順
  scores: [0.85, 0.10, 0.03, ...]                   // 各カテゴリの信頼度
}
```

### 4. 結果の表示

```javascript
labels.map((label, index) => {
    const score = scores[index];
    const percentage = (score * 100).toFixed(2);
    // 表示処理...
});
```

ラベルとスコアをペアにして、信頼度の高い順に表示します。

## 実用例

### カスタムカテゴリでの分類

```javascript
// カスタマーサポートのチケット分類
const categories = ['技術的問題', '請求に関する質問', '機能リクエスト', 'その他'];
const result = await classifier(customerMessage, categories);
```

### 複数テキストの一括処理

```javascript
// 複数のテキストを同時に分類
const texts = ['テキスト1', 'テキスト2', 'テキスト3'];
const results = await Promise.all(
    texts.map(text => classifier(text, categories))
);
```

## よくある質問

**Q: どのくらいのカテゴリ数が適切ですか？**
A: 3〜10個程度が最適です。多すぎると精度が下がる可能性があります。

**Q: 日本語のカテゴリは使えますか？**
A: はい、使えます。ただし、デフォルトモデルは英語に最適化されているため、多言語モデルを使用するとより良い結果が得られます。

**Q: 信頼度スコアの閾値はどう設定すべき？**
A: 用途によりますが、0.5以上であれば比較的信頼できる結果と言えます。重要な判断には0.7〜0.8以上を推奨します。
