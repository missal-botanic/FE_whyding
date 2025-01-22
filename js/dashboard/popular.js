// public_album2.js

const API_URL = apiGlobalURL + '/api/articles/public_articles';

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
// <span>${article.like_count}</span>
    articles.forEach((article, index) => {
        const itemHtml = `
            <div class="item" id="wItem${index + 1}">
                <div class="content">
                    <img src="${article.image}" alt="#">
                    <div class="info">
                        <h4>${article.author.username}</h4>
                        <div class="view">
                            <i class="ri-eye-fill"></i>
                            <h5>${article.view_count}</h5>
                        </div>
                    </div>
                </div>
                <span>${article.like_count}<i class="ri-heart-3-fill"></i></span>
                </div>
            </div>
        `;
        sidebar.append(itemHtml);
    });
}

$(document).ready(function () {
    fetchPublicArticles();
});
