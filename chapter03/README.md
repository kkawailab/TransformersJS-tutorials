# 第3章：質問応答システム

## 質問応答（Question Answering）とは

質問応答（QA）は、与えられたコンテキスト（文章）の中から、質問に対する答えを抽出するタスクです。検索エンジン、チャットボット、ドキュメント検索などで広く使用されています。

## 仕組み

1. **コンテキスト**: 回答が含まれる文章を提供
2. **質問**: コンテキストに基づいた質問を入力
3. **回答抽出**: モデルがコンテキストから関連する部分を抽出
4. **信頼度スコア**: 回答の確実性を数値で提示

## このチュートリアルで学ぶこと

- Question Answeringパイプラインの使用
- コンテキストと質問の設定方法
- 複数質問への対応
- スコアによる回答の信頼性評価

### デモ
[index.html](./index.html) - テキストから質問に答えるシステムを試してみましょう

## コード解説

### 1. Question Answeringパイプラインの作成

```javascript
qa = await pipeline('question-answering');
```

質問応答専用のモデルを読み込みます。デフォルトではBERTベースのモデルが使用されます。

### 2. 質問応答の実行

```javascript
const result = await qa(question, context);
```

**パラメータ:**
- **第1引数**: 質問文（例: "What is Transformers.js?"）
- **第2引数**: コンテキスト（回答の元となる文章）

**パラメータの順番が重要！**
質問が先、コンテキストが後です。

### 3. 返り値の構造

```javascript
{
  answer: "a JavaScript library...",  // 抽出された回答
  score: 0.9234                       // 信頼度スコア (0〜1)
}
```

**スコアの解釈:**
- **0.8以上**: 非常に高い信頼度
- **0.5〜0.8**: 中程度の信頼度
- **0.5未満**: 低い信頼度（回答が不正確な可能性）

### 4. 信頼度に応じた処理

```javascript
if (score > 0.8) {
    console.log('非常に高い信頼度で回答を見つけました！');
} else if (score > 0.5) {
    console.log('まあまあの信頼度で回答を見つけました。');
} else {
    console.log('回答の信頼度は低めです。');
}
```

## 実用例

### 複数の質問に連続で回答

```javascript
const questions = [
    "What is Transformers.js?",
    "Where does it run?",
    "What are the advantages?"
];

for (const question of questions) {
    const result = await qa(question, context);
    console.log(`Q: ${question}`);
    console.log(`A: ${result.answer} (信頼度: ${result.score})`);
}
```

### FAQシステムへの応用

```javascript
// FAQドキュメントから自動回答
const faqDocument = "製品Xは...（長い説明文）";
const userQuestion = "製品Xの保証期間は？";
const answer = await qa(userQuestion, faqDocument);
```

## ベストプラクティス

### ✅ 良いコンテキストの例
- 質問に関連する情報を含む
- 明確で構造化された文章
- 200〜500語程度（長すぎると精度低下）

### ❌ 避けるべきコンテキスト
- 質問と無関係な内容
- 極端に長い文章（2000語以上）
- 複雑すぎる構造

## よくある質問

**Q: コンテキストに答えがない場合はどうなる？**
A: モデルは最も近い文を返しますが、スコアが低くなります（通常0.3以下）。

**Q: 複数の段落がある場合は？**
A: すべての段落を1つのコンテキストとして渡すことができますが、関連部分のみに絞った方が精度が高まります。

**Q: 日本語の質問応答は可能？**
A: 多言語対応モデルを使用すれば可能です：
```javascript
qa = await pipeline('question-answering', 'Xenova/mbert-base-uncased-squad-v2');
```
