# 第6章：高度な応用

## マルチモーダルAIの活用

この章では、これまで学んだ技術を組み合わせた高度な応用例を紹介します。

## 画像キャプション生成

画像キャプション生成は、画像の内容を自動的に文章で説明するタスクです。これは：
- 画像認識（Computer Vision）
- 自然言語生成（NLP）

の両方を組み合わせたマルチモーダルなタスクです。

## このチュートリアルで学ぶこと

- Image-to-Textパイプラインの使用
- 複数のモデルの統合
- キャプション生成のパラメータ調整
- 実践的なアプリケーションの構築

### デモ
[index.html](./index.html) - 画像から自動的にキャプションを生成してみましょう

## コード解説

### 1. Image-to-Textパイプラインの作成

```javascript
captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
```

**パラメータ:**
- **第1引数**: タスクタイプ（`'image-to-text'`）
- **第2引数**: モデル名（ViT-GPT2）

**ViT-GPT2モデルとは？**
- **ViT (Vision Transformer)**: 画像を理解する部分
- **GPT2**: テキストを生成する部分
- 2つのモデルを組み合わせたマルチモーダルAI

### 2. 画像の準備

```javascript
const reader = new FileReader();
reader.onload = (e) => {
    currentImageUrl = e.target.result;  // Data URL形式
};
reader.readAsDataURL(file);
```

画像をData URL形式で読み込みます（Base64エンコードされた文字列）。

### 3. キャプション生成の実行

```javascript
const result = await captioner(imageUrl, {
    max_new_tokens: 50,  // 生成する最大トークン数
    num_beams: 5         // ビームサーチの幅
});
```

**パラメータの詳細:**

**`max_new_tokens`**: 生成するトークン（単語）の最大数
- 小さい値（20-30）: 短い説明
- 中程度（50）: バランスの良い説明
- 大きい値（100+）: 詳細な説明

**`num_beams`**: ビームサーチの幅
- 1: 貪欲法（高速だが品質低）
- 3-5: バランス（推奨）
- 10+: 高品質だが遅い

### 4. 返り値の構造

```javascript
[
  {
    generated_text: "a close up of a cat on a bed"
  }
]
```

配列の最初の要素に生成されたキャプションが含まれます。

## 高度な使い方

### 複数のキャプション生成

```javascript
const result = await captioner(imageUrl, {
    max_new_tokens: 50,
    num_beams: 5,
    num_return_sequences: 3  // 3つの候補を生成
});

// 結果:
// [
//   { generated_text: "a cat sitting on a bed" },
//   { generated_text: "a close up of a cat on a bed" },
//   { generated_text: "a cat laying on top of a bed" }
// ]
```

### 温度パラメータでランダム性を調整

```javascript
const result = await captioner(imageUrl, {
    max_new_tokens: 50,
    temperature: 0.7,  // 0.0（決定的）〜 2.0（ランダム）
    do_sample: true    // サンプリングを有効化
});
```

## 実用例

### アクセシビリティ向上

```javascript
// 画像のaltテキストを自動生成
async function generateAltText(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    const imageUrl = canvas.toDataURL();
    const caption = await captioner(imageUrl);

    imageElement.alt = caption[0].generated_text;
}
```

### SNS投稿の自動生成

```javascript
// 画像から投稿文を生成
async function generateSocialPost(imageUrl) {
    const caption = await captioner(imageUrl, {
        max_new_tokens: 30,
        num_beams: 5
    });

    const text = caption[0].generated_text;
    return `Check out this photo: ${text} 📸 #AI #Photography`;
}
```

### Eコマース商品説明

```javascript
// 商品画像から説明文を生成
async function generateProductDescription(productImageUrl) {
    const result = await captioner(productImageUrl, {
        max_new_tokens: 60,
        num_beams: 7,
        temperature: 0.5  // より一貫性のある説明
    });

    return result[0].generated_text;
}
```

## パフォーマンス最適化

### 画像サイズの調整

```javascript
// 画像を適切なサイズにリサイズ
function resizeImage(imageUrl, maxWidth = 800) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL());
        };
        img.src = imageUrl;
    });
}
```

### バッチ処理

```javascript
// 複数画像を順次処理
async function batchCaption(imageUrls) {
    const results = [];
    for (const url of imageUrls) {
        const caption = await captioner(url);
        results.push({
            url: url,
            caption: caption[0].generated_text
        });
    }
    return results;
}
```

## ベストプラクティス

### ✅ 良い画像の条件
- 明るく、被写体が明確
- 解像度: 300×300ピクセル以上
- 主要な被写体が中央または目立つ位置にある

### ⚠️ 精度が下がる条件
- 暗い画像や低解像度の画像
- 複雑すぎるシーン（多数の物体）
- 抽象的な画像やアート作品

## 応用例

このような技術は以下のような場面で活用できます：
- **アクセシビリティ向上**: 視覚障害者向けの画像説明
- **SNSの自動投稿生成**: 画像に合わせた投稿文の自動作成
- **Eコマースの商品説明自動生成**: 商品画像から説明文を生成
- **画像検索の精度向上**: キャプションをメタデータとして活用
- **コンテンツモデレーション**: 画像内容の自動チェック

## よくある質問

**Q: 日本語のキャプションは生成できますか？**
A: デフォルトモデルは英語のみです。日本語対応モデルを使用するか、翻訳APIと組み合わせる必要があります。

**Q: 複数の物体がある場合はどうなりますか？**
A: モデルは主要な物体や全体的なシーンを説明します。すべての物体を列挙するわけではありません。

**Q: 顔認識はできますか？**
A: このモデルは「person」として認識しますが、個人を特定することはできません。

**Q: カスタムドメイン（医療画像など）には使えますか？**
A: 一般的な画像には有効ですが、専門分野にはドメイン特化モデルの使用を推奨します。
