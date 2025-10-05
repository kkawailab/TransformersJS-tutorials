# 第5章：音声処理

## 音声処理の種類

Transformers.jsでは様々な音声処理タスクが可能です：

- **音声認識（ASR）**: 音声をテキストに変換
- **音声分類**: 音声の内容や話者を分類
- **音声翻訳**: 音声を別の言語のテキストに変換

## 自動音声認識（ASR）

Automatic Speech Recognition（ASR）は、音声データをテキストに変換する技術です。このチュートリアルでは：
1. マイクからの音声入力
2. 音声ファイルのアップロード
3. Whisperモデルによる高精度な文字起こし

## このチュートリアルで学ぶこと

- 音声ファイルの読み込みと処理
- Automatic Speech Recognitionパイプラインの使用
- マイク入力からのリアルタイム音声認識
- 音声データの前処理

### デモ
[index.html](./index.html) - 音声ファイルをテキストに変換してみましょう

## コード解説

### 1. ASRパイプラインの作成

```javascript
transcriber = await pipeline(
    'automatic-speech-recognition',
    'Xenova/whisper-tiny.en'
);
```

**パラメータ:**
- **第1引数**: タスクタイプ（`'automatic-speech-recognition'`）
- **第2引数**: モデル名（Whisper Tiny - 英語専用）

**Whisperモデルとは？**
OpenAIが開発した高精度な音声認識モデルです。複数のサイズがあります：
- `whisper-tiny`: 最軽量・高速
- `whisper-base`: 標準
- `whisper-small`: 高精度
- `whisper-medium/large`: 最高精度（重い）

### 2. 音声ファイルの読み込み

```javascript
const reader = new FileReader();
reader.onload = (e) => {
    const audioUrl = e.target.result;
    audio.src = audioUrl;
};
reader.readAsDataURL(file);
```

FileReader APIを使って音声ファイルをData URLとして読み込みます。

### 3. 文字起こしの実行

```javascript
const result = await transcriber(audioUrl);
```

**返り値の構造:**
```javascript
{
  text: "This is the transcribed text..."  // 文字起こし結果
}
```

非常にシンプル！音声URLを渡すだけで文字起こしが完了します。

### 4. マイクからの録音

```javascript
// マイクへのアクセス
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// MediaRecorderで録音
const mediaRecorder = new MediaRecorder(stream);
const audioChunks = [];

mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
};

mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    // 文字起こし実行
    transcriber(audioUrl);
};

mediaRecorder.start();
```

**重要なポイント:**
- ブラウザがマイクアクセスの許可を求めます
- HTTPSでホストする必要があります（localhostは除く）

## 実用例

### 多言語対応

```javascript
// 日本語対応モデルを使用
transcriber = await pipeline(
    'automatic-speech-recognition',
    'Xenova/whisper-small'  // 多言語対応版
);
```

### タイムスタンプ付き文字起こし

```javascript
const result = await transcriber(audioUrl, {
    return_timestamps: true
});

// 結果: { text: "...", chunks: [{ text: "Hello", timestamp: [0.0, 1.2] }, ...] }
```

### 音声ファイル形式の対応

対応形式：
- WAV
- MP3
- OGG
- FLAC
- M4A

ブラウザがサポートしている形式であれば、ほぼすべて対応しています。

## パフォーマンス最適化

### モデルサイズの選択

| モデル | サイズ | 速度 | 精度 | 用途 |
|--------|--------|------|------|------|
| tiny | 39MB | 最速 | 良 | リアルタイム処理 |
| base | 74MB | 高速 | 良好 | 一般的な用途 |
| small | 244MB | 中速 | 優秀 | 高精度が必要な場合 |
| medium | 769MB | 低速 | 非常に優秀 | 専門用語の多い音声 |

### 音声の長さ

- **推奨**: 30秒〜5分
- **最大**: 30分程度（メモリ制限に注意）
- 長い音声は分割処理を推奨

## ベストプラクティス

### ✅ 良い音声の条件
- クリアな録音（ノイズが少ない）
- 話者が明瞭に発音している
- サンプルレート: 16kHz以上
- ビットレート: 128kbps以上

### ⚠️ 認識精度が下がる条件
- 背景ノイズが多い
- 複数人が同時に話している
- 音量が小さすぎる/大きすぎる
- 専門用語や固有名詞が多い

## よくある質問

**Q: リアルタイムで音声認識できますか？**
A: できますが、モデルのサイズと処理速度のバランスが重要です。`whisper-tiny`モデルが最適です。

**Q: 日本語の音声は認識できますか？**
A: 多言語対応モデル（`whisper-small`以上）を使用すれば可能です。

**Q: オフラインで動作しますか？**
A: 一度モデルをダウンロードすれば、完全にオフラインで動作します。

**Q: 句読点は自動で入りますか？**
A: はい、Whisperモデルは句読点も自動で挿入します。
