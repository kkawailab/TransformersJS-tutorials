/**
 * Transformers.js Tutorials - Navigation Component
 * 各章のページに共通ナビゲーションを追加
 */

(function() {
    'use strict';

    // ナビゲーションHTMLを生成
    const navHTML = `
        <style>
            .tutorial-nav {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 15px 0;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .tutorial-nav .nav-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
            }
            .tutorial-nav .nav-brand {
                color: white;
                font-size: 1.3em;
                font-weight: bold;
                text-decoration: none;
                margin-bottom: 10px;
            }
            .tutorial-nav .nav-links {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .tutorial-nav .nav-link {
                color: white;
                text-decoration: none;
                padding: 8px 16px;
                background: rgba(255,255,255,0.2);
                border-radius: 5px;
                transition: all 0.3s;
                font-size: 0.9em;
            }
            .tutorial-nav .nav-link:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            .tutorial-nav .nav-link.active {
                background: rgba(255,255,255,0.4);
            }
            @media (max-width: 768px) {
                .tutorial-nav .nav-container {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .tutorial-nav .nav-brand {
                    margin-bottom: 15px;
                }
            }
        </style>
        <nav class="tutorial-nav">
            <div class="nav-container">
                <a href="../index.html" class="nav-brand">🚀 Transformers.js チュートリアル</a>
                <div class="nav-links">
                    <a href="../chapter01/index.html" class="nav-link" data-chapter="1">第1章</a>
                    <a href="../chapter02/index.html" class="nav-link" data-chapter="2">第2章</a>
                    <a href="../chapter03/index.html" class="nav-link" data-chapter="3">第3章</a>
                    <a href="../chapter04/index.html" class="nav-link" data-chapter="4">第4章</a>
                    <a href="../chapter05/index.html" class="nav-link" data-chapter="5">第5章</a>
                    <a href="../chapter06/index.html" class="nav-link" data-chapter="6">第6章</a>
                    <a href="https://github.com/kkawailab/TransformersJS-tutorials" class="nav-link" target="_blank">GitHub</a>
                </div>
            </div>
        </nav>
    `;

    // DOMContentLoadedイベントで実行
    document.addEventListener('DOMContentLoaded', function() {
        // bodyの最初にナビゲーションを挿入
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // 現在のページのチャプター番号を取得
        const currentPath = window.location.pathname;
        const chapterMatch = currentPath.match(/chapter0?(\d)/);

        if (chapterMatch) {
            const currentChapter = chapterMatch[1];
            // 対応するナビゲーションリンクをアクティブに
            const activeLink = document.querySelector(`.nav-link[data-chapter="${currentChapter}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
})();
