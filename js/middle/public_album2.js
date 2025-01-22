// public_album2.js

const API_URL = "http://127.0.0.1:8000//api/articles/public_articles";

function fetchPublicArticles() {
    $.ajax({
        url: API_URL,
        type: "GET",
        success: function (response) {
            const sortedArticles = sortArticlesByLikes(response.results);
            updateSidebar(sortedArticles);
        },
        error: function (error) {
            console.error("Error fetching public articles:", error);
        },
    });
}

function sortArticlesByLikes(articles) {
    return articles.sort((a, b) => b.like_count - a.like_count);
}

function updateSidebar(articles) {
    const sidebar = $(".weekly");
    sidebar.empty();

    articles.forEach((article, index) => {
        const itemHtml = `
            <div class="item" id="wItem${index + 1}">
                <div class="content">
                    <img src="${article.image}" alt="${article.title}">
                    <div class="info">
                        <h4>${article.title}</h4>
                        <div class="view">
                            <i class="ri-eye-fill"></i>
                            <h5>${article.view_count}</h5>
                        </div>
                    </div>
                </div>
                <i class="ri-heart-3-fill"></i>
                <span>${article.like_count}</span>
            </div>
        `;
        sidebar.append(itemHtml);
    });
}

$(document).ready(function () {
    fetchPublicArticles();
});
